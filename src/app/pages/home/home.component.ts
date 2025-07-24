// src/app/pages/home/home.component.ts - CORREGIDO
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import Typewriter from 'typewriter-effect/dist/core';
import { NavbardComponent } from '../../shared/components/navbard/navbard.component';
import { ThemeService } from '../../core/services/ThemeService';
import { AlertService } from '../../core/services/alert.service';
import {
  AlertComponent,
  AlertConfig,
} from '../../shared/components/alert/alert.component';
import { CardProyectosComponent } from '../../shared/components/card-proyectos/card-proyectos.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { StackTecnologicoComponent } from '../../shared/components/stack-tecnologico/stack-tecnologico.component';
import { HeroComponent } from '../../shared/components/hero/hero.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbardComponent,
    CardProyectosComponent,
    FooterComponent,
    StackTecnologicoComponent,
    HeroComponent,
    AlertComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('typewriter', { static: false }) typewriterElement!: ElementRef;

  isDarkMode: boolean = false;
  private typewriterInstance: any;
  private observer: IntersectionObserver | null = null;

  // Propiedades para Alert
  currentAlert: AlertConfig | null = null;
  isAlertVisible: boolean = false;
  private alertSubscription?: Subscription;
  private visibilitySubscription?: Subscription;

  // PROPIEDADES AGREGADAS para el botón
  isButtonLoading: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private themeService: ThemeService,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((isDarkMode) => {
      this.isDarkMode = isDarkMode;
      this.cdr.detectChanges();
    });

    this.setupAlertSubscriptions();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initScrollAnimations();
      this.initTypewriterEffect();
    }
  }

  ngOnDestroy(): void {
    if (this.typewriterInstance) {
      this.typewriterInstance.stop();
    }

    if (this.observer) {
      this.observer.disconnect();
    }

    this.alertSubscription?.unsubscribe();
    this.visibilitySubscription?.unsubscribe();

    // CLEANUP MEJORADO del scroll
    if (isPlatformBrowser(this.platformId)) {
      const body = document.body;
      const html = document.documentElement;

      // Asegurar que el scroll se restaure completamente
      body.style.position = '';
      body.style.top = '';
      body.style.width = '';
      body.style.overflow = '';
      html.style.overflow = '';
    }
  }

  // MÉTODOS DE ALERT
  private setupAlertSubscriptions(): void {
    this.alertSubscription = this.alertService.currentAlert$.subscribe(
      (alert) => {
        console.log('🔔 Alert config changed:', alert);
        this.currentAlert = alert;
        this.cdr.detectChanges();
      }
    );

    this.visibilitySubscription = this.alertService.isVisible$.subscribe(
      (isVisible) => {
        console.log('👁️ Alert visibility changed:', isVisible);
        this.isAlertVisible = isVisible;
        this.isButtonLoading = false;
        this.cdr.detectChanges();

        // MANEJO MEJORADO DEL SCROLL
        this.handleBodyScrollLock(isVisible);
      }
    );
  }
  private handleBodyScrollLock(isVisible: boolean): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const body = document.body;
    const html = document.documentElement;

    if (isVisible) {
      // Bloquear scroll cuando se abre el modal
      const scrollY = window.scrollY;
      body.style.position = 'fixed';
      body.style.top = `-${scrollY}px`;
      body.style.width = '100%';
      body.style.overflow = 'hidden';
      html.style.overflow = 'hidden';
    } else {
      // Restaurar scroll cuando se cierra el modal
      const scrollY = body.style.top;
      body.style.position = '';
      body.style.top = '';
      body.style.width = '';
      body.style.overflow = '';
      html.style.overflow = '';

      // Restaurar la posición del scroll
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
  }
  // MÉTODO MEJORADO para mostrar información
  showDevelopmentInfo(): void {
    console.log('🚀 Showing development info');

    // Verificar si ya hay una alerta activa
    if (this.alertService.hasActiveAlert()) {
      console.log('⚠️ Alert already active, not showing new one');
      return;
    }

    // Activar estado de loading
    this.isButtonLoading = true;
    this.cdr.detectChanges();

    // Simular pequeña carga para feedback visual (opcional)
    setTimeout(() => {
      this.alertService.showDevelopmentAlert();
      // El loading se desactiva automáticamente en setupAlertSubscriptions
    }, 300);
  }

  // Manejar acciones de alerta
  onAlertAction(action: string): void {
    console.log('🎬 Processing alert action:', action);

    switch (action) {
      case 'view_available':
      case 'explore':
        console.log('📂 Navigating to projects...');
        setTimeout(() => this.scrollToSection('proyectos'), 100);
        break;

      case 'about':
        console.log('ℹ️ Navigating to about...');
        setTimeout(() => this.scrollToSection('tecnologias'), 100);
        break;

      case 'contact':
      case 'email':
        console.log('📧 Opening email...');
        this.openEmail();
        break;

      case 'linkedin':
        console.log('💼 Opening LinkedIn...');
        this.openLinkedIn();
        break;

      case 'github':
        console.log('🐙 Opening GitHub...');
        this.openGitHub();
        break;

      default:
        console.log('❓ Unknown action:', action);
    }
  }

  // Manejar cierre de alerta
  onAlertClosed(reason: string): void {
    console.log('🔒 Alert closed with reason:', reason);

    // Asegurar que el loading state se resetee
    this.isButtonLoading = false;
    this.cdr.detectChanges();

    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'auto';
    }
  }

  // MÉTODOS DE NAVEGACIÓN
  private scrollToSection(sectionId: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    console.log(`📍 Scrolling to section: ${sectionId}`);

    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 80;
      const elementPosition = element.offsetTop - navbarHeight;

      window.scrollTo({
        top: Math.max(0, elementPosition),
        behavior: 'smooth',
      });

      console.log(`✅ Scrolled to ${sectionId}`);
    } else {
      console.error(`❌ Element ${sectionId} not found`);
    }
  }

  private openEmail(): void {
    if (isPlatformBrowser(this.platformId)) {
      const subject = encodeURIComponent('Contacto desde portafolio');
      const body = encodeURIComponent(
        'Hola Jorge,\n\nMe pongo en contacto contigo desde tu portafolio web...'
      );
      window.open(
        `mailto:casvejorge1@gmail.com?subject=${subject}&body=${body}`,
        '_blank'
      );
    }
  }

  private openLinkedIn(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.open('https://www.linkedin.com/in/jcastillov15', '_blank');
    }
  }

  private openGitHub(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.open('https://github.com/VCL-tt', '_blank');
    }
  }

  // MÉTODOS EXISTENTES (sin cambios)
  private initTypewriterEffect(): void {
    if (this.typewriterElement?.nativeElement) {
      this.typewriterInstance = new Typewriter(
        this.typewriterElement.nativeElement,
        {
          loop: false,
          delay: 75,
          cursor: '|',
        }
      );

      this.typewriterInstance
        .typeString('Jorge Luis ')
        .pauseFor(500)
        .typeString(
          '<span class="text-green-600 dark:text-green-400">Castillo Vega</span>'
        )
        .pauseFor(500)
        .deleteChars(13)
        .pauseFor(500)
        .typeString(
          '<span class="text-green-600 dark:text-green-400">Desarrollador Software</span>'
        )
        .start();
    }
  }

  private initScrollAnimations(): void {
    if (isPlatformBrowser(this.platformId)) {
      const observerOptions: IntersectionObserverInit = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate__fadeInUp');
            entry.target.classList.remove('opacity-0', 'translate-y-8');
          }
        });
      }, observerOptions);

      const elementsToAnimate = document.querySelectorAll('.scroll-animate');
      elementsToAnimate.forEach((element) => {
        element.classList.add(
          'opacity-0',
          'translate-y-8',
          'transition-all',
          'duration-700'
        );
        this.observer?.observe(element);
      });
    }
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
