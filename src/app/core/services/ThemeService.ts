// theme.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private isDarkModeSubject = new BehaviorSubject<boolean>(false); // Estado inicial del tema
  isDarkMode$ = this.isDarkModeSubject.asObservable(); // Exponemos un observable para que los componentes se suscriban

  constructor() {
    // Cargar el estado del tema desde localStorage al iniciar
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      this.setTheme(storedTheme === 'dark');
    } else {
      this.setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }

  // Método para establecer el tema y almacenar en localStorage
  setTheme(isDarkMode: boolean): void {
    this.isDarkModeSubject.next(isDarkMode);
    const html = document.documentElement;

    if (isDarkMode) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  // Método para alternar el tema
  toggleTheme(): void {
    this.setTheme(!this.isDarkModeSubject.value); // Invertir el estado actual del tema
  }
}
