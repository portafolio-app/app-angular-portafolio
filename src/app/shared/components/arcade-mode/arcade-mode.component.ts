import { Component, OnInit, OnDestroy, HostListener, NgZone, ChangeDetectorRef, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArcadeModeService } from '../../../core/services/arcade-mode.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { Observable } from 'rxjs';

interface Projectile {
  el: HTMLElement;
  x: number;
  y: number;
  angle: number;
  speed: number;
  age: number;
}

interface Enemy {
  el: HTMLElement;
  x: number;
  y: number;
  speed: number;
  lastFire: number;
}

interface Boss {
  el: HTMLElement;
  hp: number;
  maxHp: number;
  x: number;
  y: number;
  vx: number;
  lastFire: number;
}

@Component({
  selector: 'app-arcade-mode',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './arcade-mode.component.html',
  styleUrls: ['./arcade-mode.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ArcadeModeComponent implements OnInit, OnDestroy {
  isActive$: Observable<boolean>;
  
  // Ship State
  shipX = window.innerWidth / 2;
  shipY = window.innerHeight / 2;
  shipAngle = 0;
  shipSpeed = 0;
  
  // Game Loop
  private loopId?: number;
  private projectiles: Projectile[] = [];
  private enemies: Enemy[] = [];
  private enemyProjectiles: Projectile[] = [];
  private keys: { [key: string]: boolean } = {};
  private lastFireTime = 0;
  
  lives = 3;
  score = 0;
  weaponLevel = 1; // 1: Single, 2: Double, 3: Trident
  isGameOver = false;
  isMobile = false;
  private touchStates: { [key: string]: boolean } = {};
  private items: { el: HTMLElement, x: number, y: number, type: string }[] = [];
  private speedMult = 1.0;
  private speedTimer: any = null;
  private boss: Boss | null = null;
  private nextBossScore = 1500;
  public isInvulnerable = false;
  private shieldTimer: any = null;
  private audioCtx?: AudioContext;
  private noiseBuffer?: AudioBuffer;

  // DOM Cache
  private shipEl: HTMLElement | null = null;
  private thrusterEl: SVGPathElement | null = null;
  private bulletsContainer: HTMLElement | null = null;
  private flashEl: HTMLElement | null = null;

  constructor(
    private el: ElementRef,
    private arcadeService: ArcadeModeService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    this.isActive$ = this.arcadeService.isActive$;
  }

  ngOnInit(): void {
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    this.injectGlobalStyles();
    this.isActive$.subscribe(active => {
      if (active) {
        this.setupGlobalListeners();
        this.ngZone.runOutsideAngular(() => {
          this.startLoop();
        });
      } else {
        this.removeGlobalListeners();
        this.stopLoop();
        this.restoreAll();
      }
    });
  }

  ngOnDestroy(): void {
    this.removeGlobalListeners();
    this.stopLoop();
  }

  private setupGlobalListeners(): void {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
    document.addEventListener('mousemove', this.handleMouseMove);
  }

  private removeGlobalListeners(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
    document.removeEventListener('mousemove', this.handleMouseMove);
  }

  // --- Mobile Controls ---
  startMoving(dir: string): void {
    this.touchStates[dir] = true;
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  stopMoving(dir: string): void {
    this.touchStates[dir] = false;
  }

  startFiring(): void {
    this.touchStates['fire'] = true;
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  stopFiring(): void {
    this.touchStates['fire'] = false;
  }
  // -------------------------

  private handleMouseMove = (e: MouseEvent) => {
    if (this.isGameOver) return;
    const dx = e.clientX - this.shipX;
    const dy = e.clientY - this.shipY;
    // Align ship to point towards mouse
    this.shipAngle = Math.atan2(dy, dx) + Math.PI / 2;
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    this.keys[e.code] = true;
    this.keys[e.key] = true;
    
    // Global Audio Unlock on first keypress
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    if (e.code === 'Space' || e.key === ' ') {
      this.fire();
      e.preventDefault();
    }
  }

  private handleKeyUp = (e: KeyboardEvent) => {
    this.keys[e.code] = false;
    this.keys[e.key] = false;
  }

  private startLoop(): void {
    if (this.loopId) return;
    const run = () => {
      this.update();
      this.loopId = requestAnimationFrame(run);
    };
    this.loopId = requestAnimationFrame(run);
  }

  private stopLoop(): void {
    if (this.loopId) {
      cancelAnimationFrame(this.loopId);
      this.loopId = undefined;
    }
    this.shipEl = null;
    this.thrusterEl = null;
    this.bulletsContainer = null;
    this.flashEl = null;
  }

  private update(): void {
    // 0. Cache DOM elements if not already cached
    if (!this.shipEl) {
      this.shipEl = document.getElementById('arcade-ship');
      this.thrusterEl = document.getElementById('arcade-thruster') as any;
      this.bulletsContainer = document.getElementById('arcade-bullets');
      this.flashEl = document.getElementById('arcade-flash');
    }

    // 0. Scaling enemy spawn rate & limit
    const spawnProb = 0.002 + (this.score / 150000); 
    const maxEnemies = 5 + Math.floor(this.score / 1000);

    if (Math.random() < spawnProb && this.enemies.length < maxEnemies) {
      this.spawnEnemy(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
    }

    // 1. Inputs
    if (this.keys['ArrowLeft'] || this.keys['KeyA'] || this.touchStates['left']) this.shipAngle -= 0.04;
    if (this.keys['ArrowRight'] || this.keys['KeyD'] || this.touchStates['right']) this.shipAngle += 0.04;

    const propelling = this.keys['ArrowUp'] || this.keys['KeyW'] || this.touchStates['up'];
    const reversing = this.keys['ArrowDown'] || this.keys['KeyS'] || this.touchStates['down'];
    
    if (this.touchStates['fire']) {
      this.fire();
    }
    
    // 🔄 Visual Flip
    let visualAngleOffset = 0;
    if (reversing) visualAngleOffset = Math.PI;

    if (propelling) {
      this.shipSpeed = Math.min(this.shipSpeed + 0.08 * this.speedMult, 3 * this.speedMult);
    } else if (reversing) {
      this.shipSpeed = Math.max(this.shipSpeed - 0.08 * this.speedMult, -2 * this.speedMult);
    } else {
      this.shipSpeed *= 0.85; // High friction for immediate stop
    }

    // 2. Physics
    this.shipX += Math.cos(this.shipAngle - Math.PI/2) * this.shipSpeed;
    this.shipY += Math.sin(this.shipAngle - Math.PI/2) * this.shipSpeed;

    // Boundary Wrap
    if (this.shipX < 0) this.shipX = window.innerWidth;
    if (this.shipX > window.innerWidth) this.shipX = 0;
    if (this.shipY < 0) this.shipY = window.innerHeight;
    if (this.shipY > window.innerHeight) this.shipY = 0;

    // 3. Render Ship
    if (this.shipEl) {
      const finalVisualAngle = this.shipAngle + visualAngleOffset;
      this.shipEl.style.transform = `translate3d(${this.shipX}px, ${this.shipY}px, 0) rotate(${finalVisualAngle * (180/Math.PI)}deg)`;
    }
    if (this.thrusterEl) {
      this.thrusterEl.style.opacity = propelling ? '1' : '0';
    }

    // 4. Projectiles logic
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.age++;
      p.x += Math.cos(p.angle - Math.PI/2) * p.speed;
      p.y += Math.sin(p.angle - Math.PI/2) * p.speed;

      p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) rotate(${p.angle * (180/Math.PI)}deg)`;

      let hitEnemy = false;
      let hitProjectile = false;

      // a) Check collision with enemies (Drones)
      for (let j = this.enemies.length - 1; j >= 0; j--) {
        const e = this.enemies[j];
        if (Math.hypot(p.x - e.x, p.y - e.y) < 45) {
          e.el.remove();
          this.enemies.splice(j, 1);
          
          // Force UI Sync
          this.ngZone.run(() => {
            this.score += 100;
            this.cdr.detectChanges();
          });
          
          this.playScoreSound();
          if (Math.random() < 0.4) this.spawnPowerUp(e.x, e.y);
          hitEnemy = true;
          break;
        }
      }

      // b) Intercept Enemy Projectiles (Puppies)
      if (!hitEnemy) {
        for (let j = this.enemyProjectiles.length - 1; j >= 0; j--) {
          const ep = this.enemyProjectiles[j];
          if (Math.hypot(p.x - ep.x, p.y - ep.y) < 40) {
            ep.el.remove();
            this.enemyProjectiles.splice(j, 1);
            hitProjectile = true;
            this.playScoreSound(); // Sound for interception
            break;
          }
        }
      }

      // c) Check collision with page elements (buttons, text, etc)
      let hitElement = false;
      if (!hitEnemy && !hitProjectile && p.age > 10) {
        hitElement = this.checkCollision(p.x, p.y);
        if (hitElement) {
          this.ngZone.run(() => {
            this.score += 50;
            this.cdr.detectChanges();
          });
        }
      }

      // d) Check collision with BOSS
      let hitBoss = false;
      if (this.boss && !hitEnemy && !hitProjectile && !hitElement) {
        const b = this.boss;
        if (Math.hypot(p.x - b.x, p.y - b.y) < 110) {
          hitBoss = true;
          this.handleBossHit();
        }
      }

      const reallyOut = p.x < -1000 || p.x > window.innerWidth + 1000 || p.y < -1000 || p.y > window.innerHeight + 1000;

      if (hitEnemy || hitProjectile || hitElement || hitBoss || reallyOut) {
        p.el.remove();
        this.projectiles.splice(i, 1);
        if (hitEnemy || hitElement || hitBoss) this.triggerFlash();
      }
    }

    // 5. Enemies Logic
    const now = Date.now();
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      const ang = Math.atan2(this.shipY - e.y, this.shipX - e.x);
      e.x += Math.cos(ang) * e.speed;
      e.y += Math.sin(ang) * e.speed;

      e.el.style.transform = `translate3d(${e.x}px, ${e.y}px, 0) rotate(${ang * (180/Math.PI) + 90}deg)`;

      // Enemy Firing Logic
      if (now - e.lastFire > 1500) { // Aggressive: Fire every 1.5s
        this.enemyFire(e.x, e.y, ang);
        e.lastFire = now;
      }

      // Collision with ship
      const dist = Math.hypot(this.shipX - e.x, this.shipY - e.y);
      if (dist < 40) {
        e.el.remove();
        this.enemies.splice(i, 1);
        this.takeDamage();
      }
    }

    // 6. Enemy Projectiles Logic
    for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
      const p = this.enemyProjectiles[i];
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed;
      p.age++;

      p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.angle * (180/Math.PI) + 90}deg)`;

      const dist = Math.hypot(this.shipX - p.x, this.shipY - p.y);
      const out = p.x < -100 || p.x > window.innerWidth + 100 || p.y < -100 || p.y > window.innerHeight + 100;

      if (dist < 30 || out) {
        p.el.remove();
        this.enemyProjectiles.splice(i, 1);
        if (dist < 30) this.takeDamage();
      }
    }

    // 7. Items Logic
    this.updateItems();
    this.updateBoss();

    // 🔥 Boss Trigger
    if (this.score >= this.nextBossScore && !this.boss) {
      this.spawnBoss();
      this.nextBossScore += 2500;
    }
  }

  private fire(): void {
    if (this.isGameOver) return;
    
    // ⚖️ Rate of Fire Cooldown (150ms)
    const now = Date.now();
    if (now - this.lastFireTime < 150) return;
    this.lastFireTime = now;

    // Check if reversing for firing direction
    const reversing = this.keys['ArrowDown'] || this.keys['KeyS'];
    const fireAngle = reversing ? (this.shipAngle + Math.PI) : this.shipAngle;

    // Shoot based on weaponLevel
    if (this.weaponLevel === 1) {
      this.createProjectile(this.shipX, this.shipY, fireAngle);
    } else if (this.weaponLevel === 2) {
      this.createProjectile(this.shipX - 10, this.shipY, fireAngle);
      this.createProjectile(this.shipX + 10, this.shipY, fireAngle);
    } else {
      // Trident
      this.createProjectile(this.shipX, this.shipY, fireAngle);
      this.createProjectile(this.shipX, this.shipY, fireAngle - 0.2);
      this.createProjectile(this.shipX, this.shipY, fireAngle + 0.2);
    }

    this.playLaserSound(); 
  }

  private createProjectile(x: number, y: number, angle: number): void {
    const container = document.body;
    const bulletEl = document.createElement('div');
    bulletEl.style.position = 'fixed';
    bulletEl.style.top = '0';
    bulletEl.style.left = '0';
    bulletEl.style.width = '12px';
    bulletEl.style.height = '60px'; 
    bulletEl.style.background = '#ff00ff'; 
    bulletEl.style.borderRadius = '6px';
    bulletEl.style.boxShadow = '0 0 40px #ff00ff, 0 0 80px #ff00ff';
    bulletEl.style.pointerEvents = 'none';
    bulletEl.style.zIndex = '999999';
    
    bulletEl.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${angle * (180/Math.PI)}deg)`;
    container.appendChild(bulletEl);

    this.projectiles.push({
      el: bulletEl,
      x: x,
      y: y,
      angle: angle,
      speed: 12, 
      age: 0
    });

    this.playLaserSound(); // Non-blocking
    this.triggerFlash();
  }

  private checkCollision(x: number, y: number): boolean {
    const el = document.elementFromPoint(x, y);
    if (!el) return false;

    // Skip ALL arcade-related elements and structural background elements
    const tag = el.tagName.toLowerCase();
    if (
      tag === 'body' || tag === 'html' || tag === 'app-root' ||
      el.id?.startsWith('arcade-') ||
      el.closest('.arcade-overlay') ||
      (el as HTMLElement).style.zIndex === '999999' || // Identify our inline projectiles
      el.classList.contains('projectile') ||
      el.classList.contains('glitch-flash') ||
      el.classList.contains('active-flash') ||
      el.closest('.arcade-ui') ||
      el.closest('.bullets-container')
    ) return false;

    const targets = [
      '.card-proyectos', '.logo-title', 'h1', 'h2', 'h3', 'p', 
      '.tech-badge', '.skill-card', '.project-card', 'li', 'a', 'button',
      '[class*="card"]', '.img-container', '.text-content'
    ];
    
    // Find the actual meaningful target
    let targetEl: HTMLElement | null = null;
    for (const selector of targets) {
      const found = el.closest(selector);
      if (found && !found.classList.contains('destroyed-element')) {
        targetEl = found as HTMLElement;
        break;
      }
    }

    if (targetEl) {
      console.log('Arcade: Target hit, spawning Glitch Drone!');
      targetEl.classList.add('destroyed-element');
      this.playExplosionSound();
      this.spawnEnemy(x, y);
      return true;
    }
    return false;
  }

  private async playLaserSound(): Promise<void> {
    try {
      if (!this.audioCtx || this.audioCtx.state === 'closed') {
        this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = this.audioCtx;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      console.log(`Arcade Sound: State=${ctx.state}, Time=${ctx.currentTime.toFixed(2)}`);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.3);
      
      gain.gain.setValueAtTime(0.8, ctx.currentTime); // Louder
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.error('Arcade Audio Error:', e);
    }
  }

  private playExplosionSound(): void {
    try {
      if (!this.audioCtx) return;
      if (!this.noiseBuffer) {
        this.noiseBuffer = this.audioCtx.createBuffer(1, this.audioCtx.sampleRate * 0.2, this.audioCtx.sampleRate);
        const output = this.noiseBuffer.getChannelData(0);
        for (let i = 0; i < this.noiseBuffer.length; i++) output[i] = Math.random() * 2 - 1;
      }
      const noise = this.audioCtx.createBufferSource();
      noise.buffer = this.noiseBuffer;
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, this.audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(50, this.audioCtx.currentTime + 0.15);
      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.2);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);
      noise.start();
    } catch (e) {}
  }

  private triggerFlash(): void {
    if (this.flashEl) {
      this.flashEl.classList.remove('active-flash');
      void this.flashEl.offsetWidth; 
      this.flashEl.classList.add('active-flash');
    }
  }

  private spawnEnemy(x: number, y: number): void {
    const container = document.body;
    const enemyEl = document.createElement('div');
    enemyEl.id = `arcade-enemy-${Date.now()}`;
    enemyEl.style.position = 'fixed';
    enemyEl.style.top = '0';
    enemyEl.style.left = '0';
    enemyEl.style.width = '30px';
    enemyEl.style.height = '30px';
    enemyEl.style.marginLeft = '-15px';
    enemyEl.style.marginTop = '-15px';
    enemyEl.style.background = '#ff0000';
    enemyEl.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)'; // Triangle
    enemyEl.style.boxShadow = '0 0 20px #ff0000';
    enemyEl.style.zIndex = '999998';
    enemyEl.style.pointerEvents = 'none';
    
    container.appendChild(enemyEl);
    this.enemies.push({
      el: enemyEl,
      x,
      y,
      speed: 0.8 + Math.random() * 0.7, // Balanced speed (was 2-4)
      lastFire: Date.now() + Math.random() * 2000
    });
  }

  private enemyFire(x: number, y: number, angle: number): void {
    const container = document.body;
    const bulletEl = document.createElement('div');
    bulletEl.className = 'projectile black-energy';
    bulletEl.style.position = 'fixed';
    bulletEl.style.top = '0';
    bulletEl.style.left = '0';
    bulletEl.style.zIndex = '999997';
    bulletEl.style.pointerEvents = 'none';

    container.appendChild(bulletEl);
    this.enemyProjectiles.push({
      el: bulletEl,
      x,
      y,
      angle,
      speed: 4, 
      age: 0
    });
  }

  private takeDamage(): void {
    if (this.isGameOver || this.isInvulnerable) return;
    
    this.ngZone.run(() => {
      this.lives--;
      if (this.lives <= 0) {
        this.isGameOver = true;
        if (this.shipEl) this.shipEl.style.display = 'none';
        this.playExplosionSound();
      }
      this.cdr.detectChanges();
    });
    
    this.triggerFlash();
    this.playHitSound(); // Distinct damage sound
  }

  private applyShield(): void {
    this.isInvulnerable = true;
    if (this.shieldTimer) clearTimeout(this.shieldTimer);
    this.shieldTimer = setTimeout(() => {
      this.isInvulnerable = false;
      this.cdr.detectChanges();
    }, 8000); // 8 seconds of shield
    this.cdr.detectChanges();
  }

  private playHitSound(): void {
    try {
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'square'; // Harsh sound
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.2);
      
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {}
  }

  private playScoreSound(): void {
    try {
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  }

  private spawnPowerUp(x: number, y: number): void {
    const container = this.el.nativeElement.querySelector('.arcade-overlay') || document.body;
    const itemEl = document.createElement('div');
    itemEl.className = 'power-up-item';
    itemEl.style.position = 'absolute';
    itemEl.style.width = '35px';
    itemEl.style.height = '35px';
    itemEl.style.border = '2px solid #fff';
    itemEl.style.borderRadius = '50%';
    itemEl.style.color = '#fff';
    itemEl.style.fontSize = '1.2rem';
    itemEl.style.fontWeight = 'bold';
    itemEl.style.display = 'flex';
    itemEl.style.alignItems = 'center';
    itemEl.style.justifyContent = 'center';
    itemEl.style.zIndex = '999999';
    
    // Choose type: P (Weapon), S (Slow), X (PowerDown), B (Barrier/Shield)
    const rand = Math.random();
    let type = 'weapon';
    let label = 'P';
    let color = '#00ff88';

    if (rand < 0.15) {
      type = 'slow';
      label = 'S';
      color = '#ff0055';
    } else if (rand < 0.3) {
      type = 'powerdown';
      label = 'X';
      color = '#ffcc00';
    } else if (rand < 0.45) {
      type = 'shield';
      label = 'B';
      color = '#00d4ff';
    }

    itemEl.innerText = label;
    itemEl.style.background = 'rgba(0,0,0,0.8)';
    itemEl.style.borderColor = color;
    itemEl.style.color = color;
    itemEl.style.boxShadow = `0 0 15px ${color}`;
    
    // ⬇️ Spawn at top and fall
    const spawnX = Math.random() * window.innerWidth;
    const spawnY = -50;

    container.appendChild(itemEl);
    this.items.push({ el: itemEl, x: spawnX, y: spawnY, type });
  }

  private spawnBoss(): void {
    if (this.boss) return;
    
    const container = this.el.nativeElement.querySelector('.arcade-overlay') || document.body;
    
    // ⚠️ BOSS WARNING
    const warning = document.createElement('div');
    warning.innerText = '⚠️ BOSS INBOUND ⚠️';
    warning.style.position = 'absolute';
    warning.style.top = '40%';
    warning.style.left = '50%';
    warning.style.transform = 'translate(-50%, -50%)';
    warning.style.color = '#ff0055';
    warning.style.fontSize = '3rem';
    warning.style.fontWeight = 'bold';
    warning.style.fontFamily = "'JetBrains Mono', monospace";
    warning.style.zIndex = '999999';
    warning.style.textShadow = '0 0 20px #ff0055';
    warning.style.animation = 'blink 0.5s infinite';
    container.appendChild(warning);
    
    setTimeout(() => {
      warning.remove();
      this.createBossElement(container);
    }, 2000);
  }

  private createBossElement(container: HTMLElement): void {
    const bossEl = document.createElement('div');
    bossEl.className = 'boss-enemy';
    bossEl.style.position = 'absolute';
    bossEl.style.width = '200px';
    bossEl.style.height = '120px';
    bossEl.style.background = 'linear-gradient(135deg, #ff0055 0%, #330011 100%)';
    bossEl.style.border = '4px solid #fff';
    bossEl.style.borderRadius = '20px';
    bossEl.style.boxShadow = '0 0 50px rgba(255, 0, 85, 0.8)';
    bossEl.style.zIndex = '999998';
    
    // Health Bar Container
    const hb = document.createElement('div');
    hb.style.position = 'absolute';
    hb.style.top = '-20px';
    hb.style.left = '0';
    hb.style.width = '100%';
    hb.style.height = '10px';
    hb.style.background = '#333';
    hb.style.border = '1px solid #fff';
    
    const hFill = document.createElement('div');
    hFill.className = 'boss-hp-fill';
    hFill.style.width = '100%';
    hFill.style.height = '100%';
    hFill.style.background = '#00ff88';
    hFill.style.transition = 'width 0.2s';
    
    hb.appendChild(hFill);
    bossEl.appendChild(hb);
    
    container.appendChild(bossEl);
    
    this.boss = {
      el: bossEl,
      hp: 15,
      maxHp: 15,
      x: window.innerWidth / 2,
      y: 100,
      vx: 2,
      lastFire: Date.now()
    };
    
    this.playExplosionSound(); // Big entrance sound
  }

  private updateBoss(): void {
    if (!this.boss) return;
    const b = this.boss;
    
    // 1. Movement (Side to side)
    b.x += b.vx;
    if (b.x < 100 || b.x > window.innerWidth - 100) b.vx *= -1;
    
    b.el.style.transform = `translate3d(${b.x - 100}px, ${b.y}px, 0)`;

    // 2. Attacks (Spread shots)
    const now = Date.now();
    if (now - b.lastFire > 2500) {
      for (let i = -2; i <= 2; i++) {
        this.enemyFire(b.x, b.y + 60, Math.PI/2 + (i * 0.3));
      }
      b.lastFire = now;
    }
  }

  private handleBossHit(): void {
    if (!this.boss) return;
    this.boss.hp--;
    
    const fill = this.boss.el.querySelector('.boss-hp-fill') as HTMLElement;
    if (fill) {
      fill.style.width = `${(this.boss.hp / this.boss.maxHp) * 100}%`;
    }

    if (this.boss.hp <= 0) {
      this.defeatBoss();
    }
  }

  private defeatBoss(): void {
    if (!this.boss) return;
    this.playExplosionSound();
    this.ngZone.run(() => {
      this.score += 2000;
      this.cdr.detectChanges();
    });
    
    // Loot fountain!
    for (let i = 0; i < 5; i++) {
      this.spawnPowerUp(this.boss.x + (Math.random() * 100 - 50), this.boss.y + 50);
    }
    
    this.boss.el.remove();
    this.boss = null;
    this.triggerFlash();
  }

  private applySlowDebuff(): void {
    this.speedMult = 0.4;
    if (this.speedTimer) clearTimeout(this.speedTimer);
    this.speedTimer = setTimeout(() => {
      this.speedMult = 1.0;
    }, 5000);
  }

  private updateItems(): void {
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      // Balanced fall speed
      item.y += 1.5;
      item.el.style.transform = `translate(${item.x}px, ${item.y}px)`;

      // Check collision with ship
      const dist = Math.hypot(item.x - this.shipX, item.y - this.shipY);
      if (dist < 65) {
        this.ngZone.run(() => {
          if (item.type === 'weapon') {
            this.weaponLevel = Math.min(this.weaponLevel + 1, 3);
            this.playScoreSound();
          } else if (item.type === 'slow') {
            this.applySlowDebuff();
            this.playHitSound(); // Punishment sound
          } else if (item.type === 'powerdown') {
            this.weaponLevel = Math.max(1, this.weaponLevel - 1);
            this.playHitSound(); // Punishment sound
          } else if (item.type === 'shield') {
            this.applyShield();
            this.playScoreSound();
          }
          this.cdr.detectChanges();
        });
        item.el.remove();
        this.items.splice(i, 1);
        continue;
      }

      // Cleanup offscreen
      if (item.y > window.innerHeight) {
        item.el.remove();
        this.items.splice(i, 1);
      }
    }
  }

  public restoreAll(): void {
    const destroyed = document.querySelectorAll('.destroyed-element');
    destroyed.forEach(el => el.classList.remove('destroyed-element'));
    
    // Add temporary shake to the whole body for impact
    document.body.style.animation = 'none';
    void document.body.offsetHeight; 
    document.body.style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both';
    setTimeout(() => document.body.style.animation = '', 500);

    // Cleanup projectiles
    this.projectiles.forEach(p => p.el.remove());
    this.projectiles = [];
    
    // Cleanup enemy projectiles
    this.enemyProjectiles.forEach(p => p.el.remove());
    this.enemyProjectiles = [];
    
    // Cleanup enemies
    this.enemies.forEach(e => e.el.remove());
    this.enemies = [];

    // Cleanup items
    this.items.forEach(it => it.el.remove());
    this.items = [];

    this.lives = 3;
    this.score = 0;
    this.weaponLevel = 1;
    this.speedMult = 1.0;
    this.isInvulnerable = false;
    if (this.speedTimer) clearTimeout(this.speedTimer);
    if (this.shieldTimer) clearTimeout(this.shieldTimer);
    this.nextBossScore = 1500;
    if (this.boss) {
      this.boss.el.remove();
      this.boss = null;
    }
    this.isGameOver = false;
    if (this.shipEl) this.shipEl.style.display = 'block';

    const bulletContainer = document.getElementById('arcade-bullets');
    if (bulletContainer) bulletContainer.innerHTML = '';
  }

  private injectGlobalStyles(): void {
    if (document.getElementById('arcade-global-styles')) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'arcade-global-styles';
    styleEl.textContent = `
      .destroyed-element {
        opacity: 0 !important;
        transform: translateY(100px) scale(0.1) rotate(45deg) !important;
        pointer-events: none !important;
        filter: blur(10px) brightness(2);
        transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
      }
    `;
    document.head.appendChild(styleEl);
  }

  deactivate(): void {
    this.arcadeService.deactivate();
  }
}
