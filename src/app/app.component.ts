import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FlowbiteService } from './flowbite.service';
import { CurtainService } from './core/services/curtain.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'portafolio_1.0_jcv';
  isDarkMode = false; // Estado del modo oscuro

  @ViewChild('curtainLeft', { static: false })
  curtainLeft!: ElementRef<HTMLDivElement>;

  @ViewChild('curtainRight', { static: false })
  curtainRight!: ElementRef<HTMLDivElement>;

  constructor(
    private flowbiteService: FlowbiteService,
    @Inject(PLATFORM_ID) private platformId: object,
    public router: Router,
    private cdr: ChangeDetectorRef,
    private curtainService: CurtainService
  ) {}

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

  ngAfterViewInit(): void {
     // Inicializar el servicio de cortinas con las referencias
     if (this.curtainLeft && this.curtainRight) {
       this.curtainService.setCurtainElements(
         this.curtainLeft.nativeElement,
         this.curtainRight.nativeElement
       );
     }
    // Forzamos la detección de cambios después de la renderización de la vista
    this.cdr.detectChanges();
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
