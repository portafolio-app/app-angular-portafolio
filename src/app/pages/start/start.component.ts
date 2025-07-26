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

  constructor(private router: Router) {}

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.isVisible && !this.hasInteracted) {
      this.navigateToHome();
    }
  }

  // Prevenir zoom en dispositivos móviles con doble tap
  @HostListener('touchstart', ['$event'])
  handleTouchStart(event: TouchEvent) {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  }

  @HostListener('touchend', ['$event'])
  handleTouchEnd(event: TouchEvent) {
    if (event.changedTouches.length === 1 && !this.hasInteracted) {
      event.preventDefault();
      this.navigateToHome();
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
    }, 8000); // Reducido a 8 segundos ya que no hay hint
  }

  ngOnDestroy(): void {
    clearTimeout(this.fadeOutTimeout);
  }

  generateDroplets(): void {
    // Crear 12 gotas distribuidas
    for (let i = 0; i < 12; i++) {
      this.droplets.push({
        id: i,
        left: Math.random() * 80 + 10, // 10% a 90%
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
        left: 50 + (Math.random() - 0.5) * 40, // Centrado con variación
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
