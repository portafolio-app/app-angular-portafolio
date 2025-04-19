import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-start',
  imports: [CommonModule],
  templateUrl: './start.component.html',
  styleUrl: './start.component.css'
})
export class StartComponent implements OnInit {
  animationClass = 'animate__fadeIn'; // al inicio entra con fadeIn

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Mostrar animación durante 3 segundos, luego animar salida
    setTimeout(() => {
      this.animationClass = 'animate__fadeOut'; // animación de salida

      // Esperamos que termine la animación de salida (~1s)
      setTimeout(() => {
        this.router.navigateByUrl('/home');
      }, 1000); // duración del fadeOut
    }, 3000); // tiempo que dura la pantalla inicial
  }
}
