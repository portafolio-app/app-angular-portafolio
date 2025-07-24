// src/app/pages/home/home.component.ts - CON DEBUG
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

  // Propiedades para Alert
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

  // Métodos para manejar alertas
  private setupAlertSubscriptions(): void {
    this.alertSubscription = this.alertService.currentAlert$.subscribe(alert => {
      console.log('Alert changed:', alert);
      this.currentAlert = alert;
      this.cdr.detectChanges();
    });

    this.visibilitySubscription = this.alertService.isVisible$.subscribe(isVisible => {
      console.log('Alert visibility changed:', isVisible);
      this.isAlertVisible = isVisible;
      this.cdr.detectChanges();

      // Manejar el scroll del body
      if (isPlatformBrowser(this.platformId)) {
        if (isVisible) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = 'auto';
        }
      }
    });
  }

  showDevelopmentInfo(): void {
    console.log('Showing development info - current alert visible:', this.isAlertVisible);

    if (!this.alertService.hasActiveAlert()) {
      this.alertService.showDevelopmentAlert();
    } else {
      console.log('Alert already active, not showing new one');
    }
  }

  // Método para manejar acciones de las alertas
  onAlertAction(action: string): void {
    console.log('🚀 Alert action received in home component:', action);

    // NO llamar alertService.handleAction aquí porque eso cierra el modal antes de tiempo
    // Solo manejar acciones específicas
    switch (action) {
      case 'view_available':
      case 'explore':
        console.log('📍 Scrolling to projects section...');
        setTimeout(() => {
          this.scrollToSection('proyectos');
        }, 300); // Reducir delay
        break;
      case 'about':
        console.log('📍 Scrolling to technologies section...');
        setTimeout(() => {
          this.scrollToSection('tecnologias');
        }, 300);
        break;
      case 'contact':
      case 'email':
        console.log('📧 Opening email...');
        if (isPlatformBrowser(this.platformId)) {
          window.open('mailto:casvejorge1@gmail.com', '_blank');
        }
        break;
      case 'linkedin':
        console.log('🔗 Opening LinkedIn...');
        if (isPlatformBrowser(this.platformId)) {
          window.open('https://www.linkedin.com/in/jcastillov15', '_blank');
        }
        break;
      case 'github':
        console.log('🐙 Opening GitHub...');
        if (isPlatformBrowser(this.platformId)) {
          window.open('https://github.com/VCL-tt', '_blank');
        }
        break;
      default:
        console.log('❓ Unknown action:', action);
    }
  }

  // Método para manejar el cierre de alertas
  onAlertClosed(reason: string): void {
    console.log('🔒 Alert closed in home component with reason:', reason);

    // Llamar al servicio para limpiar el estado
    this.alertService.hideAlert();

    // Restaurar scroll del body
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'auto';
    }
  }

  private scrollToSection(sectionId: string): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log(`📍 Attempting to scroll to section: ${sectionId}`);

      const element = document.getElementById(sectionId);
      if (element) {
        console.log(`✅ Element found: ${sectionId}`);
        const navbarHeight = 80;
        const elementPosition = element.offsetTop - navbarHeight;

        window.scrollTo({
          top: Math.max(0, elementPosition),
          behavior: 'smooth'
        });

        console.log(`📍 Scrolled to position: ${elementPosition}`);
      } else {
        console.error(`❌ Element not found: ${sectionId}`);
      }
    }
  }

  // Métodos existentes
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
