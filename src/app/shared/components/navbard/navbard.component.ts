import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, Input, Output, HostListener, ElementRef, Inject, PLATFORM_ID, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { trigger, transition, style, animate, state } from '@angular/animations';

@Component({
  selector: 'app-navbard',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
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
    ]),
    trigger('drawer', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('260ms cubic-bezier(0.35, 0, 0.25, 1)', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(-100%)' }))
      ])
    ]),
    trigger('fade', [
      transition(':enter', [ style({ opacity: 0 }), animate('200ms ease-out', style({ opacity: 1 })) ]),
      transition(':leave', [ animate('200ms ease-in', style({ opacity: 0 })) ])
    ])
  ]
})
export class NavbardComponent implements OnInit, OnDestroy {

  isMenuOpen: boolean = false;
  isDropdownOpen: boolean = false;
  navbarState = 'hidden';
  menuItemsState = 'hidden';

  @Input() isDarkMode!: boolean;
  @Output() themeToggle = new EventEmitter<void>();

  currentLang: string = 'es';

  // Sección activa (scrollspy)
  activeSection: string = 'home';
  private spyObserver?: IntersectionObserver;
  private readonly spyIds = ['home', 'sobre-mi', 'tecnologias', 'experiencia', 'certificaciones'];

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private translate: TranslateService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.translate.setDefaultLang('es');
    
    // Recuperar idioma guardado
    let savedLang = 'es';
    if (isPlatformBrowser(this.platformId)) {
      savedLang = localStorage.getItem('language') || 'es';
    }
    
    this.translate.use(savedLang);
    this.currentLang = savedLang;
  }

  ngOnInit(): void {
    // Mostrar navbar inmediatamente para mejorar la percepción de velocidad
    this.navbarState = 'visible';
    this.menuItemsState = 'visible';

    if (isPlatformBrowser(this.platformId)) {
      // Scrollspy: resalta la sección visible en el sidebar
      setTimeout(() => this.setupScrollSpy(), 300);
    }
  }

  private setupScrollSpy(): void {
    this.spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            // IntersectionObserver corre fuera de la zona de Angular:
            // forzamos la actualización dentro de la zona para refrescar la vista.
            this.zone.run(() => {
              this.activeSection = entry.target.id;
              this.cdr.markForCheck();
            });
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    this.spyIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) this.spyObserver!.observe(el);
    });
  }

  isActive(id: string): boolean {
    return this.activeSection === id;
  }

  ngOnDestroy(): void {
    this.spyObserver?.disconnect();
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

  switchLanguage(lang: string): void {
    this.translate.use(lang);
    this.currentLang = lang;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('language', lang);
    }
    this.closeDropdown();
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
