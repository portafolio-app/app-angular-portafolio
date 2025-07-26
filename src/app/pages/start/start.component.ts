import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-start',
  imports: [CommonModule],
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit, OnDestroy {
  isVisible = false;
  droplets: any[] = [];
  private hasInteracted = false;
  private fadeOutTimeout: any;
  private touchStartTime = 0;

  constructor(private router: Router) {}

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.isVisible && !this.hasInteracted) {
      this.navigateToHome();
    }
  }

  // Manejo más robusto de eventos táctiles para tablets
  @HostListener('touchstart', ['$event'])
  handleTouchStart(event: TouchEvent) {
    this.touchStartTime = Date.now();

    // Prevenir zoom con múltiples dedos
    if (event.touches.length > 1) {
      event.preventDefault();
      return;
    }

    // Para tablets que manejan touchstart diferente
    if (!this.hasInteracted) {
      // Pequeño delay para evitar conflictos con gestos del sistema
      setTimeout(() => {
        if (!this.hasInteracted && Date.now() - this.touchStartTime < 200) {
          this.navigateToHome();
        }
      }, 50);
    }
  }

  @HostListener('touchend', ['$event'])
  handleTouchEnd(event: TouchEvent) {
    const touchDuration = Date.now() - this.touchStartTime;

    // Solo procesar si es un tap corto (no un swipe o gesto largo)
    if (event.changedTouches.length === 1 &&
        touchDuration < 300 &&
        !this.hasInteracted) {
      event.preventDefault();
      this.navigateToHome();
    }
  }

  // Backup con evento click para casos donde touch no funciona
  @HostListener('click', ['$event'])
  handleClick(event: MouseEvent) {
    if (!this.hasInteracted) {
      this.navigateToHome();
    }
  }

  // Manejo de pointer events (más moderno y compatible)
  @HostListener('pointerdown', ['$event'])
  handlePointerDown(event: PointerEvent) {
    if (!this.hasInteracted && event.isPrimary) {
      // Delay pequeño para tablets que procesan eventos más lento
      setTimeout(() => {
        if (!this.hasInteracted) {
          this.navigateToHome();
        }
      }, 100);
    }
  }

  ngOnInit(): void {
    // Aparición gradual
    setTimeout(() => {
      this.isVisible = true;
    }, 500);

    // Generar droplets aleatorios
    setTimeout(() => {
      this.generateDroplets();
    }, 2000);

    // Auto-navegación
    this.fadeOutTimeout = setTimeout(() => {
      if (!this.hasInteracted) {
        this.navigateToHome();
      }
    }, 8000);
  }

  ngOnDestroy(): void {
    clearTimeout(this.fadeOutTimeout);
  }

  generateDroplets(): void {
    // Crear 12 gotas distribuidas
    for (let i = 0; i < 12; i++) {
      this.droplets.push({
        id: i,
        left: Math.random() * 80 + 10,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 2,
        size: 0.5 + Math.random() * 1
      });
    }
  }

  navigateToHome(): void {
    if (this.hasInteracted) return;

    this.hasInteracted = true;
    clearTimeout(this.fadeOutTimeout);
    this.isVisible = false;

    // Agregar efecto de ondas al hacer click
    this.createClickEffect();

    setTimeout(() => {
      this.router.navigateByUrl('/home');
    }, 600);
  }

  createClickEffect(): void {
    // Crear múltiples gotas desde el centro al hacer click
    for (let i = 0; i < 8; i++) {
      const droplet = {
        id: Date.now() + i,
        left: 50 + (Math.random() - 0.5) * 40,
        delay: i * 0.1,
        duration: 1,
        size: 1.5
      };
      this.droplets.push(droplet);
    }
  }

  onLetterHover(event: any): void {
    // Crear efecto de gota al hacer hover
    const rect = event.target.getBoundingClientRect();
    const droplet = {
      id: Date.now(),
      left: ((rect.left + rect.width / 2) / window.innerWidth) * 100,
      delay: 0,
      duration: 1.5,
      size: 1.2
    };

    this.droplets.push(droplet);

    // Remover después de la animación
    setTimeout(() => {
      this.droplets = this.droplets.filter(d => d.id !== droplet.id);
    }, 2000);
  }
}
