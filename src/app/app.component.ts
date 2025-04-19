import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { FlowbiteService } from './flowbite.service';
import { NavbardComponent } from './shared/components/navbard/navbard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavbardComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'portafolio_1.0_jcv';
  isDarkMode = false; // Estado del modo oscuro
  showNavbar = true;  // Controla si el Navbar se muestra o no

  constructor(
    private flowbiteService: FlowbiteService,
    @Inject(PLATFORM_ID) private platformId: object,
    public router: Router,
    private cdr: ChangeDetectorRef // Inyectamos ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });

    if (isPlatformBrowser(this.platformId)) {
      // Solo en el navegador
      this.isDarkMode =
        localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);

      this.updateTheme();
    }
  }

  ngAfterViewInit(): void {
    // Aquí es donde forzamos la detección de cambios después de la renderización de la vista
    this.cdr.detectChanges();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    const html = document.documentElement;

    if (this.isDarkMode) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  updateTheme() {
    if (isPlatformBrowser(this.platformId)) {
      // Solo en el navegador
      document.documentElement.classList.toggle('dark', this.isDarkMode);
    }
  }

  // Método para ocultar o mostrar el Navbard
  setShowNavbar(visible: boolean) {
    this.showNavbar = visible;
    this.cdr.detectChanges(); // Esto fuerza la detección de cambios
  }
}
