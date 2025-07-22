import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
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
  isButtonVisible = false;
  droplets: any[] = [];

  private fadeOutTimeout: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Aparición gradual
    setTimeout(() => {
      this.isVisible = true;
    }, 500);

    // Generar droplets aleatorios
    setTimeout(() => {
      this.generateDroplets();
    }, 2000);

    // Mostrar botón
    setTimeout(() => {
      this.isButtonVisible = true;
    }, 4000);

    // Auto-navegación
    this.fadeOutTimeout = setTimeout(() => {
      this.navigateToHome();
    }, 10000);
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
    clearTimeout(this.fadeOutTimeout);
    this.isVisible = false;

    setTimeout(() => {
      this.router.navigateByUrl('/home');
    }, 600);
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
