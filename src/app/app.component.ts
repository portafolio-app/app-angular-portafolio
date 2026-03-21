import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ViewportScroller } from '@angular/common';
import { FlowbiteService } from './flowbite.service';
import { ArcadeModeComponent } from './shared/components/arcade-mode/arcade-mode.component';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, ArcadeModeComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'portafolio_1.0_jcv';
  isDarkMode = false; // Estado del modo oscuro

  constructor(
    private flowbiteService: FlowbiteService,
    @Inject(PLATFORM_ID) private platformId: object,
    public router: Router,
    private cdr: ChangeDetectorRef,
    private viewportScroller: ViewportScroller
  ) {
    // Scroll to top on navigation
    if (isPlatformBrowser(this.platformId)) {
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        this.viewportScroller.scrollToPosition([0, 0]);
      });
    }
  }

  // Usamos async/await para asegurar que el flujo sea correcto
  async ngOnInit(): Promise<void> {
    // Primero, gestionamos el estado del modo oscuro, antes de cualquier otra cosa
    if (isPlatformBrowser(this.platformId)) {
      // Verificar el estado del tema en localStorage o el tema preferido del sistema
      this.isDarkMode =
        localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);
      this.updateTheme(); // Aplicar el tema si ya se sabe el estado
    }

    // Cargar Flowbite solo cuando se necesite
    await this.flowbiteService.loadFlowbite();
  }



  // Método para cambiar el tema (oscuro/claro)
  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode; // Alternamos el estado del tema
    const html = document.documentElement;

    // Cambiamos la clase en el HTML según el estado del tema
    if (this.isDarkMode) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  // Método para actualizar el tema en el DOM
  updateTheme(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.classList.toggle('dark', this.isDarkMode); // Aplicamos el tema al documento
    }
  }
}
