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
import { RouterModule } from '@angular/router';
import Typewriter from 'typewriter-effect/dist/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hero.component.html'
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  @ViewChild('typewriter', { static: false }) typewriterElement!: ElementRef;

  private typewriterInstance: any;
  private observer: IntersectionObserver | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initScrollAnimations();
      this.initTypewriterEffect();
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

      // Observar elementos con animación de scroll
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

  ngOnDestroy(): void {
    if (this.typewriterInstance) {
      this.typewriterInstance.stop();
    }

    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
