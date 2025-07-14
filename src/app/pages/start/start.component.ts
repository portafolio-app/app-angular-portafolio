import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-start',
  imports: [CommonModule],
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {
  animationClass = 'animate__fadeIn'; // al inicio entra con fadeIn
  isButtonVisible = false; // Controla la visibilidad del botón
  private fadeOutTimeout: any; // Para manejar el tiempo de la animación de salida

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Mostrar animación durante 3 segundos, luego animar salida
    setTimeout(() => {
      this.animationClass = 'animate__fadeOut'; // animación de salida

      // Después de la animación de entrada, mostrar el botón
      setTimeout(() => {
        this.isButtonVisible = true;
      }, 2000); // Botón aparece después de 2s

      // Esperamos que termine la animación de salida (~1s)
      this.fadeOutTimeout = setTimeout(() => {
        this.router.navigateByUrl('/home');
      }, 1000); // duración del fadeOut
    }, 3000); // tiempo que dura la pantalla inicial
  }

  // Método para manejar la navegación con el botón
  navigateToHome(): void {
    clearTimeout(this.fadeOutTimeout); // Limpiar el temporizador si el usuario hace clic
    this.router.navigateByUrl('/home');
  }
}
