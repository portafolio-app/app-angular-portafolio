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
@Component({
  standalone: true,
  selector: 'app-start',
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
    ) {}

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private geometry!: THREE.BufferGeometry;
  private material!: THREE.PointsMaterial;
  private points!: THREE.Points;
  private animationId = 0;
  private basePositions = new Float32Array(0);
  private textPositions = new Float32Array(0);
  private time = 0;

  private particleCount = 15100; // 150x100 + 100 extras
  private spacing = 0.24; // Mantener por compatibilidad

  private mouseX = 0;
  private mouseY = 0;
  private targetMouseX = 0;
  private targetMouseY = 0;
  private scrollProgress = 0;
  private touchStartY = 0;

  // Sistema de ripples (ondas circulares) como Offground
  private ripples: Array<{
    x: number;
    y: number;
    startTime: number;
    maxAge: number;
  }> = [];

  ngOnInit(): void {
    setTimeout(() => {
      this.isVisible = true;
    }, 300);
  }

  ngAfterViewInit(): void {
    this.initThree();
    // Pasar elementos al servicio de cortinas
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

    if (this.geometry) {
      this.geometry.dispose();
    }

    if (this.material) {
      this.material.dispose();
    }

    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (!this.camera || !this.renderer) return;

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
    this.targetMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent): void {
    event.preventDefault();
    const delta = event.deltaY * 0.0015;
    this.scrollProgress = Math.max(0, Math.min(1, this.scrollProgress + delta));

    // Ocultar hint cuando comience scroll
    if (this.scrollProgress > 0.05 && this.scrollHint) {
      this.scrollHint.nativeElement.classList.add('hidden');
    }

    // Activar cortinas cuando scroll llegue a 100%
    if (this.scrollProgress >= 0.99 && !this.curtainsActivated) {
      this.activateCurtains();
    }
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    this.touchStartY = event.touches[0].clientY;
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    event.preventDefault();
    const touchEndY = event.touches[0].clientY;
    const delta = (this.touchStartY - touchEndY) * 0.0018;
    this.scrollProgress = Math.max(0, Math.min(1, this.scrollProgress + delta));
    this.touchStartY = touchEndY;

    // Ocultar hint cuando comience swipe
    if (this.scrollProgress > 0.05 && this.scrollHint) {
      this.scrollHint.nativeElement.classList.add('hidden');
    }

    // Activar cortinas cuando scroll llegue a 100%
    if (this.scrollProgress >= 0.99 && !this.curtainsActivated) {
      this.activateCurtains();
    }
  }

  private curtainsActivated = false;

  private activateCurtains(): void {
    this.curtainsActivated = true;
    console.log('🎬 Activando cortinas!');

    // Usar el servicio de cortinas para manejar la transición
    // Las cortinas persisten en app.component, así que se abren automáticamente después
    this.curtainService.closeCurtains(() => {
      console.log('🏠 Navegando al home...');
      this.router.navigate(['/home']);
    });
  }
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const mouse = new THREE.Vector2();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Raycast para obtener la posición en el plano horizontal (Y=0)
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);

    // Plano horizontal en Y=0 (el plano está rotado -90 grados en X)
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersectPoint = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersectPoint);

    // Crear ripple con tiempo de inicio
    this.ripples.push({
      x: intersectPoint.x,
      y: intersectPoint.z, // En el plano horizontal, Z es la profundidad (Y en 2D)
      startTime: performance.now(),
      maxAge: 4000 // 4 segundos como Offground
    });

    console.log('Ripple creado en:', intersectPoint.x.toFixed(2), intersectPoint.z.toFixed(2));
  }

  private initThree(): void {
    const canvas = this.canvasRef.nativeElement;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0xffffff, 25, 50); // Fog blanco como el fondo

    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    // Cámara más alta para ver el plano completo
    this.camera.position.set(0, 10, 0);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.createParticles();
  }

  private createParticles(): void {
    // PlaneGeometry más grande para llenar pantalla: 40x30 unidades, 250x200 subdivisiones
    this.geometry = new THREE.PlaneGeometry(40, 30, 250, 200);

    const positionAttr = this.geometry.getAttribute('position') as THREE.BufferAttribute;
    this.particleCount = positionAttr.count;

    // Guardar posiciones base
    this.basePositions = new Float32Array(this.particleCount * 3);
    for (let i = 0; i < this.particleCount; i++) {
      this.basePositions[i * 3] = positionAttr.getX(i);
      this.basePositions[i * 3 + 1] = positionAttr.getY(i);
      this.basePositions[i * 3 + 2] = positionAttr.getZ(i);
    }

    // Crear textura circular para los puntos
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    const texture = new THREE.CanvasTexture(canvas);

    this.material = new THREE.PointsMaterial({
      color: 0x00ff00, // Verde puro
      size: 0.015,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.NormalBlending,
      map: texture
    });

    this.points = new THREE.Points(this.geometry, this.material);

    // Generar posiciones basadas en el texto "JCV CODE"
    this.generateTextPositions();

    // Crear grupo para rotación
    const surface = new THREE.Group();
    surface.add(this.points);
    surface.rotation.x = -Math.PI / 2; // Rotar para que sea plano
    this.scene.add(surface);
  }

  private generateTextPositions(): void {
    // Crear canvas para renderizar texto
    const canvas = document.createElement('canvas');
    const size = 512;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Configurar texto - SOLO CONTORNO
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeText('JCV CODE', size / 2, size / 2);

    // Obtener píxeles del texto
    const imageData = ctx.getImageData(0, 0, size, size);
    const pixels = imageData.data;

    // Extraer posiciones de píxeles blancos (contorno del texto)
    const textPoints: number[] = [];
    const step = 3; // Saltar píxeles para tener menos puntos

    for (let y = 0; y < size; y += step) {
      for (let x = 0; x < size; x += step) {
        const i = (y * size + x) * 4;
        const alpha = pixels[i + 3];

        if (alpha > 128) {
          // Normalizar a coordenadas -5 a 5 en X, -4 a 4 en Y
          const px = ((x / size) * 10 - 5);
          const py = ((y / size) * 8 - 4);
          textPoints.push(px, py, 0);
        }
      }
    }

    // Asignar posiciones a partículas
    this.textPositions = new Float32Array(this.particleCount * 3);

    for (let i = 0; i < this.particleCount; i++) {
      if (i < textPoints.length / 3) {
        // Usar posición del contorno del texto
        this.textPositions[i * 3] = textPoints[i * 3];
        this.textPositions[i * 3 + 1] = textPoints[i * 3 + 1];
        this.textPositions[i * 3 + 2] = textPoints[i * 3 + 2];
      } else {
        // Puntos extras: distribuir aleatoriamente alrededor
        const angle = Math.random() * Math.PI * 2;
        const radius = 6 + Math.random() * 2;
        this.textPositions[i * 3] = Math.cos(angle) * radius;
        this.textPositions[i * 3 + 1] = Math.sin(angle) * radius * 0.6;
        this.textPositions[i * 3 + 2] = (Math.random() - 0.5) * 2;
      }
    }
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());
    this.time += 0.03;

    this.mouseX += (this.targetMouseX - this.mouseX) * 0.04;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.04;

    this.updateParticles();

    this.renderer.render(this.scene, this.camera);
  }

  private updateParticles(): void {
    const positionAttr = this.geometry.getAttribute('position') as THREE.BufferAttribute;
    const currentTime = performance.now();

    // Parámetros de ondas como Offground
    const clickFrequency = 4.0;
    const clickAmplitude = 0.7;
    const clickSpeed = 2.0;
    const clickDamping = 0.6;
    const fadeInDuration = 1000;
    const fadeOutDuration = 2200;

    // Limpiar ripples expirados
    this.ripples = this.ripples.filter(ripple => {
      const age = currentTime - ripple.startTime;
      return age <= ripple.maxAge;
    });

    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      const baseX = this.basePositions[i3];
      const baseY = this.basePositions[i3 + 1];

      // Ondas suaves de base (muy reducidas)
      const waveY = Math.sin(baseX * 0.8 + this.time) * 0.15 +
                    Math.sin(baseX * 1.5 + this.time * 0.7) * 0.08;

      const waveX = Math.sin(baseY * 0.6 + this.time * 0.8) * 0.1 +
                    Math.cos(baseY * 1.2 + this.time * 0.5) * 0.05;

      const waveZ = Math.sin((baseX + baseY) * 0.4 + this.time * 0.6) * 0.1;

      // Calcular ondas circulares de ripples (COMO OFFGROUND)
      let ripplesY = 0;
      for (const ripple of this.ripples) {
        const rippleAge = currentTime - ripple.startTime;

        // Envelope con fade in/out suave
        let envelope;
        if (rippleAge < fadeInDuration) {
          envelope = rippleAge / fadeInDuration;
        } else if (rippleAge > ripple.maxAge - fadeOutDuration) {
          envelope = 1.0 - (rippleAge - (ripple.maxAge - fadeOutDuration)) / fadeOutDuration;
        } else {
          envelope = 1.0;
        }
        envelope = Math.max(0, envelope);

        // Distancia desde el centro del ripple
        const dx = baseX - ripple.x;
        const dy = baseY - ripple.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Onda circular con decaimiento exponencial
        ripplesY += envelope * clickAmplitude *
                    Math.exp(-distance * clickDamping) *
                    Math.sin(distance * clickFrequency - (rippleAge / 1000) * clickSpeed);
      }

      // Posición final con ondas base + ripples
      const planeX = baseX + waveX;
      const planeY = waveY + ripplesY; // Ripples en Y (altura del plano)
      const planeZ = baseY + waveZ;

      // Posición del texto (para scroll)
      const textX = this.textPositions[i * 3];
      const textY = this.textPositions[i * 3 + 1];
      const textZ = this.textPositions[i * 3 + 2];

      // Interpolar entre plano ondulado y texto
      positionAttr.setXYZ(
        i,
        planeX + (textX - planeX) * this.scrollProgress,
        planeY + (textY - planeY) * this.scrollProgress,
        planeZ + (textZ - planeZ) * this.scrollProgress
      );
    }

    positionAttr.needsUpdate = true;
  }
}
