import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, Input, Output, HostListener, ElementRef, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { trigger, transition, style, animate, state } from '@angular/animations';

@Component({
  selector: 'app-navbard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbard.component.html',
  animations: [
    trigger('slideDown', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateY(-100%)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      transition('hidden => visible', [
        animate('500ms cubic-bezier(0.35, 0, 0.25, 1)')
      ])
    ]),
    trigger('fadeIn', [
      state('hidden', style({
        opacity: 0
      })),
      state('visible', style({
        opacity: 1
      })),
      transition('hidden => visible', [
        animate('400ms 200ms ease-out')
      ])
    ]),
    trigger('mobileMenu', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class NavbardComponent implements OnInit {

  isMenuOpen: boolean = false;
  isDropdownOpen: boolean = false;
  navbarState = 'hidden';
  menuItemsState = 'hidden';

  @Input() isDarkMode!: boolean;
  @Output() themeToggle = new EventEmitter<void>();

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Mostrar navbar inmediatamente para mejorar la percepción de velocidad
    this.navbarState = 'visible';
    this.menuItemsState = 'visible';
  }

  scrollToSection(sectionId: string): void {
    // Solo ejecutar en el navegador
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Cerrar menú móvil y dropdown si están abiertos
    this.closeMenu();
    this.closeDropdown();

    // Verificar si estamos en la página correcta (home)
    const currentUrl = this.router.url.split('#')[0];
    if (currentUrl !== '/home' && currentUrl !== '/') {
      // Si no estamos en home, navegar primero
      this.router.navigate(['/home']).then(() => {
        // Esperar a que cargue la página y luego hacer scroll
        setTimeout(() => {
          this.performScroll(sectionId);
        }, 500); 
      });
    } else {
      // Si ya estamos en home, hacer scroll directamente
      this.performScroll(sectionId);
    }
  }

  private performScroll(sectionId: string): void {
    // Intentar varias veces para asegurar que el elemento existe
    let attempts = 0;
    const maxAttempts = 10;

    const attemptScroll = () => {
      const element = document.getElementById(sectionId);
      if (element) {
        const navbarHeight = 80; // Altura del navbar
        const elementPosition = element.offsetTop - navbarHeight;

        window.scrollTo({
          top: Math.max(0, elementPosition),
          behavior: 'smooth'
        });
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(attemptScroll, 100);
      } else {
        console.warn(`No se encontró el elemento con ID: ${sectionId}`);
      }
    };

    attemptScroll();
  }

  // Función para navegación regular (para páginas que no son secciones)
  navigateToPage(route: string): void {
    this.closeMenu();
    this.router.navigate([route]);
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

    if (this.isDropdownOpen && !navbar.contains(target)) {
      this.closeDropdown();
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.isMenuOpen) {
      this.closeMenu();
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth >= 768 && this.isMenuOpen) {
      this.closeMenu();
    }
  }

  @HostListener('window:orientationchange')
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

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) this.isDropdownOpen = false;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  onMenuItemClick() {
    this.closeMenu();
    this.closeDropdown();
  }
}
