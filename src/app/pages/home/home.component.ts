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
import { AlertComponent, AlertConfig } from '../../shared/components/alert/alert.component';
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
    AlertComponent
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('typewriter', { static: false }) typewriterElement!: ElementRef;

  isDarkMode: boolean = false;
  private typewriterInstance: any;
  private observer: IntersectionObserver | null = null;

  // Propiedades para Alert - SIMPLIFICADAS
  currentAlert: AlertConfig | null = null;
  isAlertVisible: boolean = false;
  private alertSubscription?: Subscription;
  private visibilitySubscription?: Subscription;

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

    // Configurar suscripciones de alertas
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

    // Limpiar suscripciones de alertas
    this.alertSubscription?.unsubscribe();
    this.visibilitySubscription?.unsubscribe();

    // Restaurar scroll del body
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'auto';
    }
  }

  // MÉTODOS DE ALERT CORREGIDOS
  private setupAlertSubscriptions(): void {
    this.alertSubscription = this.alertService.currentAlert$.subscribe(alert => {
      console.log('🔔 Alert config changed:', alert);
      this.currentAlert = alert;
      this.cdr.detectChanges();
    });

    this.visibilitySubscription = this.alertService.isVisible$.subscribe(isVisible => {
      console.log('👁️ Alert visibility changed:', isVisible);
      this.isAlertVisible = isVisible;
      this.cdr.detectChanges();

      // Manejar el scroll del body
      if (isPlatformBrowser(this.platformId)) {
        document.body.style.overflow = isVisible ? 'hidden' : 'auto';
      }
    });
  }

  showDevelopmentInfo(): void {
    console.log('🚀 Showing development info');

    // Verificar si ya hay una alerta activa
    if (this.alertService.hasActiveAlert()) {
      console.log('⚠️ Alert already active, not showing new one');
      return;
    }

    // Mostrar la alerta
    this.alertService.showDevelopmentAlert();
  }

  // MÉTODO CORREGIDO: Manejar acciones de alerta
  onAlertAction(action: string): void {
    console.log('🎬 Processing alert action:', action);

    // Procesar la acción inmediatamente SIN cerrar el modal aún
    switch (action) {
      case 'view_available':
      case 'explore':
        console.log('📂 Navigating to projects...');
        // NO cerrar el modal aquí, se cierra automáticamente en handleActionButton
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

  // MÉTODO CORREGIDO: Manejar cierre de alerta
  onAlertClosed(reason: string): void {
    console.log('🔒 Alert closed with reason:', reason);

    // El AlertService ya maneja la limpieza del estado
    // Solo necesitamos restaurar el scroll del body
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'auto';
    }
  }

  // MÉTODOS DE NAVEGACIÓN MEJORADOS
  private scrollToSection(sectionId: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    console.log(`📍 Scrolling to section: ${sectionId}`);

    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 80;
      const elementPosition = element.offsetTop - navbarHeight;

      window.scrollTo({
        top: Math.max(0, elementPosition),
        behavior: 'smooth'
      });

      console.log(`✅ Scrolled to ${sectionId}`);
    } else {
      console.error(`❌ Element ${sectionId} not found`);
    }
  }

  private openEmail(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.open('mailto:casvejorge1@gmail.com', '_blank');
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
