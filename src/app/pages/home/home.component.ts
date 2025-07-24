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

      // Restaurar completamente los estilos
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
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
      }
    );
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

  // CORREGIDO: Manejar acciones de alerta
  onAlertAction(action: string): void {
    console.log('🎬 Processing alert action:', action);

    switch (action) {
      case 'view_available':
      case 'explore':
        console.log('📂 Navigating to projects...');
        // Cerrar primero el modal, luego hacer scroll
        this.alertService.hideAlert();
        setTimeout(() => this.scrollToSection('proyectos'), 500); // Aumentar tiempo
        break;

      case 'about':
        console.log('ℹ️ Navigating to about...');
        this.alertService.hideAlert();
        setTimeout(() => this.scrollToSection('tecnologias'), 500);
        break;

      case 'contact':
      case 'email':
        console.log('📧 Opening email...');
        this.openEmail();
        this.alertService.hideAlert();
        break;

      case 'linkedin':
        console.log('💼 Opening LinkedIn...');
        this.openLinkedIn();
        this.alertService.hideAlert();
        break;

      case 'github':
        console.log('🐙 Opening GitHub...');
        this.openGitHub();
        this.alertService.hideAlert();
        break;

      default:
        console.log('❓ Unknown action:', action);
        this.alertService.hideAlert();
    }
  }

  // Manejar cierre de alerta
  onAlertClosed(reason: string): void {
    console.log('🔒 Alert closed with reason:', reason);

    // Asegurar que el loading state se resetee
    this.isButtonLoading = false;
    this.cdr.detectChanges();

    // REMOVIDO - ya no es necesario porque se maneja en el alert component
  }

  // CORREGIDO: Métodos de navegación
  private scrollToSection(sectionId: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    console.log(`📍 Scrolling to section: ${sectionId}`);

    // Intentar scroll múltiples veces para asegurar que funcione
    let attempts = 0;
    const maxAttempts = 5;

    const attemptScroll = () => {
      const element = document.getElementById(sectionId);
      if (element) {
        const navbarHeight = 80;
        const elementPosition = element.offsetTop - navbarHeight;

        window.scrollTo({
          top: Math.max(0, elementPosition),
          behavior: 'smooth',
        });

        console.log(`✅ Scrolled to ${sectionId}`);
      } else if (attempts < maxAttempts) {
        attempts++;
        console.log(`⏳ Attempt ${attempts} - retrying scroll to ${sectionId}`);
        setTimeout(attemptScroll, 200);
      } else {
        console.error(`❌ Element ${sectionId} not found after ${maxAttempts} attempts`);
      }
    };

    // Esperar un poco antes del primer intento
    setTimeout(attemptScroll, 100);
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
