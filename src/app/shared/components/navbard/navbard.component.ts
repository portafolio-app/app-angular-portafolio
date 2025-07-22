
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, Input, Output, HostListener, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-navbard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbard.component.html'
})
export class NavbardComponent {

  isMenuOpen: boolean = false;

  @Input() isDarkMode!: boolean;
  @Output() themeToggle = new EventEmitter<void>();

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // NUEVA FUNCIÓN: Scroll suave a las secciones
  scrollToSection(sectionId: string): void {
    // Solo ejecutar en el navegador
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Si no estamos en la página home, navegar primero
    if (this.router.url !== '/') {
      this.router.navigate(['/']).then(() => {
        // Esperar un poco a que cargue la página y luego hacer scroll
        setTimeout(() => {
          this.performScroll(sectionId);
        }, 300);
      });
    } else {
      // Si ya estamos en home, hacer scroll directamente
      this.performScroll(sectionId);
    }
  }

  private performScroll(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 80; // Altura aproximada del navbar
      const elementPosition = element.offsetTop - navbarHeight;

      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  }

  // Resto de tus métodos existentes...
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const navbar = this.elementRef.nativeElement;
    const menuButton = navbar.querySelector('#menu-toggle');

    if (this.isMenuOpen &&
        !navbar.contains(target) &&
        !menuButton?.contains(target)) {
      this.closeMenu();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapePress(event: KeyboardEvent) {
    if (this.isMenuOpen) {
      event.preventDefault();
      this.closeMenu();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth >= 768 && this.isMenuOpen) {
      this.closeMenu();
    }
  }

  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange() {
    setTimeout(() => {
      if (window.innerWidth >= 768 && this.isMenuOpen) {
        this.closeMenu();
      }
    }, 100);
  }

  toggleTheme() {
    this.themeToggle.emit();
  }

  toggleMenu(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  onMenuItemClick() {
    this.closeMenu();
  }
}
