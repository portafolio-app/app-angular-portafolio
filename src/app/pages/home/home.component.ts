import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import Typewriter from 'typewriter-effect/dist/core';
import { NavbardComponent } from '../../shared/components/navbard/navbard.component';
import { ThemeService } from '../../core/services/ThemeService';
import { CardProyectosComponent } from '../../shared/components/card-proyectos/card-proyectos.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbardComponent,
    CardProyectosComponent,
    FooterComponent
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('typewriter', { static: false }) typewriterElement!: ElementRef;
  isDarkMode: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((isDarkMode) => {
      this.isDarkMode = isDarkMode;
    });
  }

  ngAfterViewInit(): void {
    // Llamamos al método para aplicar el efecto de scroll
    this.initScrollAnimations();

    // Typewriter animation (sin cambios)
    if (this.typewriterElement) {
      this.typewriterElement.nativeElement.classList.add('animate__fadeIn');
      const typewriter = new Typewriter(this.typewriterElement.nativeElement, {
        loop: false,
        delay: 75,
        cursor: '|',
      });

      typewriter
        .typeString('Jorge Luis ')
        .pauseFor(500)
        .typeString('<span class="text-green-500">Castillo Vega</span>')
        .pauseFor(500)
        .deleteChars(13)
        .pauseFor(500)
        .typeString(
          '<span class="text-green-500">Desarrollador Software</span>'
        )
        .start();
    }
  }
  initScrollAnimations(): void {
    const elements = document.querySelectorAll('.scroll-animate');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate__fadeIn');
          } else {
            entry.target.classList.remove('animate__fadeIn');
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    elements.forEach((element) => observer.observe(element));
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  frontend = [
    {
      name: 'HTML',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
    },
    {
      name: 'CSS',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
    },
    {
      name: 'JavaScript',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
    },
    {
      name: 'Tailwind CSS',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
    },
    {
      name: 'Bootstrap',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg',
    },
    {
      name: 'Angular',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
    },
  ];

  backend = [
    {
      name: 'Java',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
    },
    {
      name: 'Spring Boot',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg',
    },
    {
      name: 'Python',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    },
  ];

  databases = [
    {
      name: 'MySQL',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
    },
    {
      name: 'PostgreSQL',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
    },
  ];

  tools = [
    {
      name: 'Git',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
    },
    {
      name: 'GitHub',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
    },
    {
      name: 'Docker',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
    },
  ];
}
