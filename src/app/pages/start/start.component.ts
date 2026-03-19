import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import * as THREE from 'three';
import { gsap } from 'gsap';

import { CurtainService } from '../../core/services/curtain.service';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-start',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css'],
})
export class StartComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('threeCanvas', { static: false })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  @ViewChild('mainContent', { static: false })
  mainContent!: ElementRef<HTMLDivElement>;

  @ViewChild('scrollHint', { static: false })
  scrollHint!: ElementRef<HTMLDivElement>;

  isVisible = false;

  constructor(
    private router: Router,
    private curtainService: CurtainService
  ) { }

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private geometry!: THREE.BufferGeometry;
  private material!: THREE.PointsMaterial;
  private points!: THREE.Points;
  private animationId = 0;
  private originalPositions!: Float32Array;
  private targetPositions!: Float32Array;
  private currentPositions!: Float32Array;
  private particleCount = 60000;
  private isMobile = false;
  private time = 0;

  private mouseX = 0;
  private mouseY = 0;
  private targetMouseX = 0;
  private targetMouseY = 0;
  private targetScrollProgress = 0;
  private smoothedScrollProgress = 0;
  private touchStartY = 0;

  ngOnInit(): void {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) {
      this.particleCount = 30000;
    }

    setTimeout(() => {
      this.isVisible = true;
    }, 300);
  }

  ngAfterViewInit(): void {
    this.initThree();
    this.curtainService.setCanvasAndContent(
      this.canvasRef.nativeElement,
      this.mainContent.nativeElement
    );
    this.animate();
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.geometry) this.geometry.dispose();
    if (this.material) this.material.dispose();
    if (this.renderer) this.renderer.dispose();
    if (this.audioCtx) {
      this.audioCtx.close();
    }
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.targetMouseX = (event.clientX / window.innerWidth - 0.5) * 2;
    this.targetMouseY = (event.clientY / window.innerHeight - 0.5) * 2;
  }

  @HostListener('window:wheel', ['$event'])
  onWheel(event: WheelEvent): void {
    this.primeSpeech(); // Desbloquear voz en el primer scroll
    const delta = event.deltaY * 0.0005;
    this.targetScrollProgress = Math.max(0, Math.min(1, this.targetScrollProgress + delta));

    if (this.targetScrollProgress > 0.05 && this.scrollHint) {
      this.scrollHint.nativeElement.classList.add('hidden');
    }
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    this.primeSpeech(); // Desbloquear voz en el primer toque
    this.touchStartY = event.touches[0].clientY;
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    const touchEndY = event.touches[0].clientY;
    // Sensibilidad aumentada (0.01) para que sea 'muy rápido' como pidió el usuario
    const delta = (this.touchStartY - touchEndY) * 0.01;
    this.targetScrollProgress = Math.max(0, Math.min(1, this.targetScrollProgress + delta));
    this.touchStartY = touchEndY;

    if (this.targetScrollProgress > 0.01 && this.scrollHint) {
      this.scrollHint.nativeElement.classList.add('hidden');
    }
  }

  @HostListener('click')
  onClick(): void {
    this.primeSpeech(); // Desbloquear voz en el click
    // Salto digital: Inicia la transición inmediatamente si el usuario hace click
    this.targetScrollProgress = 1;
    this.isShattering = true;
    
    // Aceleración visual: Saltar a la mitad de la explosión para mayor rapidez
    if (this.shatterProgress < 0.5) {
      this.shatterProgress = 0.5;
    }

    if (this.scrollHint) {
      this.scrollHint.nativeElement.classList.add('hidden');
    }
  }

  private curtainsActivated = false;
  private activateCurtains(): void {
    if (this.curtainsActivated) return;
    this.curtainsActivated = true;

    // Seamless Digital Dissolve
    gsap.to([this.mainContent.nativeElement, this.canvasRef.nativeElement], {
      opacity: 0,
      scale: 1.1,
      duration: 1.5,
      ease: 'power2.inOut',
      onComplete: () => {
        this.router.navigate(['/home']);
      }
    });
  }

  private initThree(): void {
    const canvas = this.canvasRef.nativeElement;
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x050505, 10, 50);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 25;

    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.createParticles();
  }

  private createParticles(): void {
    this.geometry = new THREE.BufferGeometry();
    this.originalPositions = new Float32Array(this.particleCount * 3);
    this.currentPositions = new Float32Array(this.particleCount * 3);
    this.targetPositions = new Float32Array(this.particleCount * 3);

    const radius = 5;
    for (let i = 0; i < this.particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.pow(Math.random(), 0.5) * radius;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      this.originalPositions[i * 3] = x;
      this.originalPositions[i * 3 + 1] = y;
      this.originalPositions[i * 3 + 2] = z;

      this.currentPositions[i * 3] = x;
      this.currentPositions[i * 3 + 1] = y;
      this.currentPositions[i * 3 + 2] = z;
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.currentPositions, 3));

    this.material = new THREE.PointsMaterial({
      color: 0x00ffaa,
      size: 0.06,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    this.points = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.points);
  }

  private generateTextPositions(): void {
    const canvas = document.createElement('canvas');
    const size = 512;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = 'white';
    ctx.font = 'bold 80px Orbitron';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('JCV CODE', size / 2, size / 2);

    const imageData = ctx.getImageData(0, 0, size, size);
    const pixels = imageData.data;
    const validPoints: THREE.Vector3[] = [];

    for (let y = 0; y < size; y += 4) {
      for (let x = 0; x < size; x += 4) {
        const index = (y * size + x) * 4;
        if (pixels[index] > 128) {
          validPoints.push(new THREE.Vector3(
            (x - size / 2) * 0.1,
            -(y - size / 2) * 0.1,
            (Math.random() - 0.5) * 2
          ));
        }
      }
    }

    for (let i = 0; i < this.particleCount; i++) {
      const p = validPoints[i % validPoints.length];
      this.targetPositions[i * 3] = p.x;
      this.targetPositions[i * 3 + 1] = p.y;
      this.targetPositions[i * 3 + 2] = p.z;
    }
  }

  private audioCtx?: AudioContext;

  private initAudio(): void {
    if (this.audioCtx) return;
    this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  private burstPlayed = false;
  private hasSpoken = false;
  private isShattering = false;
  private shatterProgress = 0;

  private speakInitiation(): void {
    if (this.hasSpoken) return;

    // Asegurar que las voces estén cargadas antes de proceder
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      setTimeout(() => this.speakInitiation(), 200);
      return;
    }

    this.hasSpoken = true;

    // Limpiar cualquier locución previa o bloqueada (Crucial para producción/Opera)
    window.speechSynthesis.cancel();

    const msg = new SpeechSynthesisUtterance();
    msg.text = "Hola, un placer saludarte. Soy Imay, tu guía virtual. Bienvenido a esta área preparada para que conozcas sobre la trayectoria de Jorge Castillo en la industria y su experiencia como desarrollador Full Stack.";
    msg.lang = 'es-ES';
    msg.rate = 0.9;
    msg.pitch = 1.0;

    // Prioridad por voces MASCULINAS de alta calidad
    const priorityNames = [
      'microsoft pablo',
      'microsoft raul',
      'pablo',
      'raul',
      'male'
    ];

    let bestVoice = voices.find(v => 
      v.lang.startsWith('es') && 
      priorityNames.some(name => v.name.toLowerCase().includes(name))
    );

    // Búsqueda específica de la mejor opción masculina española
    const pablo = voices.find(v => v.name.toLowerCase().includes('pablo') && v.lang.startsWith('es'));
    if (pablo) bestVoice = pablo;
    
    if (bestVoice) msg.voice = bestVoice;

    // Ejecutar con un pequeño delay tras el cancel para mayor estabilidad
    setTimeout(() => {
      window.speechSynthesis.speak(msg);
    }, 100);
  }

  // Método para "desbloquear" el motor de voz en la primera interacción del usuario
  private primeSpeech(): void {
    if (this.hasSpoken) return;
    try {
      const silentMsg = new SpeechSynthesisUtterance("");
      silentMsg.volume = 0;
      window.speechSynthesis.speak(silentMsg);
    } catch (e) {}
  }


  private playSoftBurst(): void {
    if (!this.audioCtx) return;
    this.burstPlayed = true;

    const noiseBuffer = this.audioCtx.createBuffer(1, this.audioCtx.sampleRate * 1, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.audioCtx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(2000, this.audioCtx.currentTime);
    filter.Q.setValueAtTime(10, this.audioCtx.currentTime);

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0, this.audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, this.audioCtx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 1.0);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioCtx.destination);
    noise.start();
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());
    this.time += 0.01;

    // Suavizado cinemático del scroll (Lerp)
    this.smoothedScrollProgress += (this.targetScrollProgress - this.smoothedScrollProgress) * 0.05;

    // Trabuco de Animación Autónoma
    if (this.targetScrollProgress > 0.05 && !this.isShattering) {
      this.isShattering = true;
      this.initAudio();
      this.speakInitiation();
    }

    if (this.isShattering) {
      this.shatterProgress += 0.001; // Animación majestuosa y lenta (~10-12 segundos)
      if (this.shatterProgress > 1) this.shatterProgress = 1;

      // Brillo al final de la rotura
      if (this.shatterProgress > 0.85 && !this.burstPlayed) {
        this.playSoftBurst();
      }

      // Navegación automática al terminar la secuencia de Imay
      if (this.shatterProgress >= 0.99 && !this.curtainsActivated) {
        this.activateCurtains();
      }
    }

    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    const positions = this.geometry.attributes['position'].array as Float32Array;

    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      const x = this.originalPositions[i3];
      const y = this.originalPositions[i3 + 1];
      const z = this.originalPositions[i3 + 2];

      const ambientX = Math.sin(this.time * 0.5 + i * 0.01) * 0.5;
      const ambientY = Math.cos(this.time * 0.4 + i * 0.02) * 0.5;
      const ambientZ = Math.sin(this.time * 0.6 + i * 0.03) * 0.5;

      if (!this.isShattering) {
        // Estado inicial: Orbe palpitante (Respiración)
        const pulse = 1 + Math.sin(this.time * 2 + i * 0.1) * 0.05;
        positions[i3] = x * pulse + this.mouseX + ambientX;
        positions[i3 + 1] = y * pulse - this.mouseY + ambientY;
        positions[i3 + 2] = z * pulse + ambientZ;
      } else {
        // Fase Autónoma: Expansión Supernova Lenta + Stream Fugaz Persistente
        const t = this.shatterProgress;
        
        // 1. Expansión Radial Moderada (Para que se noten todas las partículas)
        const expansion = 1 + t * 20;
        
        // 2. Aceleración Horizontal Suave (Shooting Stars a la derecha)
        const easeIn = Math.pow(t, 2);
        const internalSpeed = 1 + (i % 100) * 0.2;
        const shootingX = easeIn * 80 * internalSpeed;
        
        // 3. Posiciones Finales
        positions[i3] = x * expansion + shootingX + ambientX;
        positions[i3 + 1] = y * expansion + ambientY;
        positions[i3 + 2] = z * expansion + ambientZ;

        // Desvanecimiento muy tardío (t^4) para máxima persistencia
        this.material.opacity = 0.8 * (1 - Math.pow(t, 4));
        this.material.size = 0.05 * (1 + t * 3); // Un poco más grandes para que se noten
      }
    }

    this.geometry.attributes['position'].needsUpdate = true;
    this.points.rotation.y = this.time * 0.2;
    this.renderer.render(this.scene, this.camera);
  }
}
