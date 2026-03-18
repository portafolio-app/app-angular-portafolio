import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import Typewriter from 'typewriter-effect/dist/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './hero.component.html',
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  @ViewChild('typewriter', { static: false }) typewriterElement!: ElementRef;

  private typewriterInstance: any;
  private observer: IntersectionObserver | null = null;
  private langSubscription?: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initScrollAnimations();
      
      // Initialize typewriter
      this.initTypewriterEffect();
      
      // Subscribe to language changes to restart typewriter
      this.langSubscription = this.translate.onLangChange.subscribe(() => {
        this.initTypewriterEffect();
      });
    }
  }

  private initTypewriterEffect(): void {
    if (this.typewriterElement?.nativeElement) {
      // Stop and clear if already exists
      if (this.typewriterInstance) {
        this.typewriterInstance.stop();
        this.typewriterElement.nativeElement.innerHTML = '';
      }

      this.translate.get('HOME.TITLE').subscribe((title: string) => {
        this.typewriterInstance = new Typewriter(
          this.typewriterElement.nativeElement,
          {
            loop: false,
            delay: 75,
            cursor: '|',
          }
        );

        this.typewriterInstance
          .typeString(
            '<span class="text-gray-900 dark:text-white">Jorge Luis </span>'
          )
          .pauseFor(500)
          .typeString(
            '<span class="text-green-600 dark:text-green-400">Castillo Vega</span>'
          )
          .pauseFor(500)
          .deleteChars(13)
          .pauseFor(500)
          .typeString(
            `<span class="text-green-600 dark:text-green-400">${title}</span>`
          )
          .start();
      });
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

      // Observar elementos con animación de scroll
      const elementsToAnimate = document.querySelectorAll('.scroll-animate');
      elementsToAnimate.forEach((element) => {
        // No ocultar inicialmente para evitar sensación de lentitud
        this.observer?.observe(element);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.typewriterInstance) {
      this.typewriterInstance.stop();
    }

    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }

    if (this.observer) {
      this.observer.disconnect();
    }
  }

  navigateToBlog(): void {
    this.router.navigate(['/blog']);
  }
}
