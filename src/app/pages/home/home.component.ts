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
import { CardProyectosComponent } from '../../shared/components/Proyectos/card-proyectos/card-proyectos.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { StackTecnologicoComponent } from '../../shared/components/stack-tecnologico/stack-tecnologico.component';
import { HeroComponent } from '../../shared/components/hero/hero.component';
import { ExperienciaComponent } from '../../shared/components/experiencia/experiencia.component';
import { CertificacionesComponent } from '../../shared/components/certificaciones/certificaciones.component';
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
    ExperienciaComponent,
    CertificacionesComponent,
    AlertComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('typewriter', { static: false }) typewriterElement!: ElementRef;

  isDarkMode: boolean = false;
  private typewriterInstance: any;
  private observer: IntersectionObserver | null = null;

  currentAlert: AlertConfig | null = null;
  isAlertVisible: boolean = false;
  private alertSubscription?: Subscription;
  private visibilitySubscription?: Subscription;

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

    if (this.alertSubscription) {
      this.alertSubscription.unsubscribe();
      this.alertSubscription = undefined;
    }

    if (this.visibilitySubscription) {
      this.visibilitySubscription.unsubscribe();
      this.visibilitySubscription = undefined;
    }

    this.isButtonLoading = false;
    this.isAlertVisible = false;
    this.currentAlert = null;

    if (this.alertService.hasActiveAlert()) {
      this.alertService.hideAlert();
    }

    if (isPlatformBrowser(this.platformId)) {
      const body = document.body;
      const html = document.documentElement;

      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.width = '';
      body.style.overflow = '';
      html.style.overflow = '';
    }
  }

  private setupAlertSubscriptions(): void {
    this.alertSubscription = this.alertService.currentAlert$.subscribe(
      (alert) => {
        this.currentAlert = alert;
        this.cdr.detectChanges();
      }
    );

    this.visibilitySubscription = this.alertService.isVisible$.subscribe(
      (isVisible) => {
        this.isAlertVisible = isVisible;

        if (!isVisible) {
          this.isButtonLoading = false;
          setTimeout(() => {
            this.currentAlert = null;
            this.cdr.detectChanges();
          }, 100);
        }

        this.cdr.detectChanges();
      }
    );
  }

  showDevelopmentInfo(): void {
    if (this.isButtonLoading) {
      return;
    }

    if (this.alertService.hasActiveAlert()) {
      this.alertService.forceReset();
      this.isButtonLoading = false;
      this.isAlertVisible = false;
      this.currentAlert = null;
      this.cdr.detectChanges();

      setTimeout(() => {
        this.showDevelopmentInfo();
      }, 200);
      return;
    }

    this.isButtonLoading = true;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.alertService.showDevelopmentAlert();
    }, 300);
  }

  onAlertAction(action: string): void {
    switch (action) {
      case 'view_available':
      case 'explore':
        this.alertService.hideAlert();
        setTimeout(() => this.scrollToSection('proyectos'), 500);
        break;

      case 'about':
        this.alertService.hideAlert();
        setTimeout(() => this.scrollToSection('tecnologias'), 500);
        break;

      case 'contact':
      case 'email':
        this.openEmail();
        this.alertService.hideAlert();
        break;

      case 'linkedin':
        this.openLinkedIn();
        this.alertService.hideAlert();
        break;

      case 'github':
        this.openGitHub();
        this.alertService.hideAlert();
        break;

      default:
        this.alertService.hideAlert();
    }
  }

  onAlertClosed(reason: string): void {
    this.isButtonLoading = false;
    this.isAlertVisible = false;

    setTimeout(() => {
      this.currentAlert = null;
      this.alertService.forceReset();
      this.cdr.detectChanges();
    }, 50);
  }

  private scrollToSection(sectionId: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

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
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(attemptScroll, 200);
      }
    };

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
          '<span class="text-green-600 dark:text-green-400">Desarrollador Full Stack</span>'
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
