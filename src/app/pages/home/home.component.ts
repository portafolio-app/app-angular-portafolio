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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbardComponent,CardProyectosComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('typewriter', { static: false }) typewriterElement!: ElementRef;
  isDarkMode: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // Suscribirse al observable para obtener el estado del tema
    this.themeService.isDarkMode$.subscribe((isDarkMode) => {
      this.isDarkMode = isDarkMode;
    });
  }

  ngAfterViewInit(): void {
    // Solo ejecuta si está en el navegador
    if (isPlatformBrowser(this.platformId)) {
      // Verificamos si el elemento está disponible antes de manipularlo
      if (this.typewriterElement) {
        // Agregar la clase de animación 'fadeIn' después de que el componente haya sido renderizado
        this.typewriterElement.nativeElement.classList.add('animate__fadeIn');

        // Iniciar la animación del typewriter
        const typewriter = new Typewriter(
          this.typewriterElement.nativeElement,
          {
            loop: false,
            delay: 75,
            cursor: '|',
          }
        );

        // Definir el comportamiento del typewriter
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
  }

  // Método para alternar entre modo oscuro y claro
  toggleTheme(): void {
    this.themeService.toggleTheme(); // Llamamos al servicio para cambiar el tema
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
