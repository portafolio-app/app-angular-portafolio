import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, QueryList, ViewChildren, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { trigger, transition, style, animate, state } from '@angular/animations';
import Lenis from 'lenis';

export interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  location: string;
  type: 'work' | 'freelance' | 'education';
  description: string;
  achievements: string[];
  technologies: string[];
  current: boolean;
}

@Component({
  selector: 'app-experiencia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experiencia.component.html',
  styleUrls: ['./experiencia.component.css'],
  animations: [
    trigger('scrollAnimation', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateY(50px)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      transition('hidden => visible', [
        animate('600ms ease-out')
      ])
    ])
  ]
})
export class ExperienciaComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('experienceCard') experienceCards!: QueryList<ElementRef>;
  @ViewChild('horizontalSection', { static: false }) horizontalSection!: ElementRef;
  @ViewChild('horizontalScroller', { static: false }) horizontalScroller!: ElementRef;

  private observer!: IntersectionObserver;
  private scrollListener: any;
  private wheelListener: any;
  private lenis: Lenis | null = null;
  private animationFrameId: number | null = null;
  animationStates: { [key: string]: string } = {};
  headerState = 'hidden';

  // Variables para el scroll horizontal
  private scrollProgress = 0;
  private maxScroll = 0;
  private isInHorizontalSection = false;
  private targetScrollLeft = 0;
  private currentScrollLeft = 0;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    // Inicializar estados de animación
    this.experiences.forEach(exp => {
      this.animationStates[exp.id] = 'hidden';
    });

    // Crear IntersectionObserver
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-id');
            if (id) {
              setTimeout(() => {
                this.animationStates[id] = 'visible';
              }, 100);
            } else if (entry.target.classList.contains('header-section')) {
              this.headerState = 'visible';
            }
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      }
    );
  }

  ngAfterViewInit() {
    // Observar el header
    const headerElement = document.querySelector('.header-section');
    if (headerElement) {
      this.observer.observe(headerElement);
    }

    // Observar cada tarjeta de experiencia
    this.experienceCards.forEach(card => {
      this.observer.observe(card.nativeElement);
    });

    // Setup del scroll horizontal
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.setupHorizontalScroll(), 100);
    }
  }

  private setupHorizontalScroll() {
    const section = this.horizontalSection?.nativeElement;
    const scroller = this.horizontalScroller?.nativeElement;

    if (!section || !scroller) {
      return;
    }

    // Inicializar Lenis para scroll suave
    this.lenis = new Lenis({
      duration: 1.5,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    // Función para recalcular el ancho máximo del scroll
    const updateMaxScroll = () => {
      setTimeout(() => {
        this.maxScroll = scroller.scrollWidth - scroller.clientWidth;
      }, 300);
    };

    updateMaxScroll();
    window.addEventListener('resize', updateMaxScroll);

    // Recalcular después de que las imágenes carguen
    window.addEventListener('load', updateMaxScroll);

    // Animation loop para Lenis
    const raf = (time: number) => {
      this.lenis?.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // Animation loop para smooth horizontal scroll
    const smoothScroll = () => {
      const diff = this.targetScrollLeft - this.currentScrollLeft;
      if (Math.abs(diff) > 0.5) {
        this.currentScrollLeft += diff * 0.2; // Smooth pero rápido
        scroller.scrollLeft = this.currentScrollLeft;
      } else {
        this.currentScrollLeft = this.targetScrollLeft;
        scroller.scrollLeft = this.targetScrollLeft;
      }
      this.animationFrameId = requestAnimationFrame(smoothScroll);
    };
    this.animationFrameId = requestAnimationFrame(smoothScroll);

    // Hijack del scroll - convertir vertical en horizontal (solo desktop)
    this.wheelListener = (e: WheelEvent) => {
      // Solo en desktop (ancho > 768px)
      if (window.innerWidth <= 768) {
        return;
      }

      const rect = section.getBoundingClientRect();

      // Recalcular maxScroll dinámicamente para evitar problemas de timing
      const currentMaxScroll = scroller.scrollWidth - scroller.clientWidth;

      // Si no hay contenido para scrollear horizontalmente (todos los cards caben), no hacer nada
      if (currentMaxScroll <= 5) {
        return;
      }

      const scrollAmount = e.deltaY * 1.5;
      const newScrollLeft = this.targetScrollLeft + scrollAmount;

      // Detectar si estamos en la sección y dentro de los límites
      if (rect.top <= 0 && rect.bottom >= window.innerHeight) {

        // Si estamos en el límite superior y scrolleando hacia arriba, liberar
        if (this.currentScrollLeft <= 5 && scrollAmount < 0) {
          this.isInHorizontalSection = false;
          return; // Permitir scroll vertical normal
        }

        // Si estamos cerca del límite inferior (con margen de 10px) y scrolleando hacia abajo, liberar
        if (this.currentScrollLeft >= (currentMaxScroll - 10) && scrollAmount > 0) {
          this.isInHorizontalSection = false;
          return; // Permitir scroll vertical normal
        }

        // Estamos dentro de los límites, interceptar el scroll
        this.isInHorizontalSection = true;
        e.preventDefault();

        // Actualizar maxScroll
        this.maxScroll = currentMaxScroll;

        // Aplicar scroll horizontal con límites
        if (newScrollLeft >= 0 && newScrollLeft <= this.maxScroll) {
          this.targetScrollLeft = newScrollLeft;
        } else if (newScrollLeft < 0) {
          this.targetScrollLeft = 0;
          this.currentScrollLeft = 0;
        } else {
          this.targetScrollLeft = this.maxScroll;
          this.currentScrollLeft = this.maxScroll;
        }
      } else {
        this.isInHorizontalSection = false;
      }
    };

    window.addEventListener('wheel', this.wheelListener, { passive: false });

    // Scroll listener para detección de sección
    this.scrollListener = () => {
      const rect = section.getBoundingClientRect();

      if (rect.top > 0 || rect.bottom < window.innerHeight) {
        this.isInHorizontalSection = false;
      }
    };

    window.addEventListener('scroll', this.scrollListener, { passive: true });
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }

    if (isPlatformBrowser(this.platformId)) {
      if (this.scrollListener) {
        window.removeEventListener('scroll', this.scrollListener);
      }
      if (this.wheelListener) {
        window.removeEventListener('wheel', this.wheelListener);
      }
    }

    // Destruir Lenis
    if (this.lenis) {
      this.lenis.destroy();
    }

    // Cancelar animation frame
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  getAnimationState(id: string): string {
    return this.animationStates[id] || 'hidden';
  }

  experiences: Experience[] = [
    {
      id: '1',
      title: 'Desarrollador de Software Front End',
      company: 'Gato Marketing y Software S.A.C',
      period: 'Octubre 2025 - Enero 2026',
      location: 'Lima, Perú (Remoto)',
      type: 'work',
      current: false,
      description: 'Encargado del mantenimiento y desarrollo frontend de múltiples proyectos empresariales para distintos clientes: ERP contable, ERP de recursos humanos y plataforma de gestión para estudios fotográficos.',
      achievements: [
        'Desarrollo de arquitectura frontend con Angular para ERP contable de empresa cliente',
        'Mantenimiento y corrección de errores en ERP de recursos humanos (React) para otro cliente',
        'Creación de nuevos módulos y mantenimiento de sistema de gestión de estudios fotográficos',
        'Implementación de interfaces interactivas con Fabric.js para edición gráfica',
        'Integración continua con APIs REST y coordinación con equipos backend de cada proyecto',
        'Resolución de incidencias críticas y mejoras en múltiples sistemas en producción',
        'Validación directa de requerimientos con diferentes clientes finales'
      ],
      technologies: ['Angular', 'React', 'Tailwind CSS', 'Fabric.js', 'REST APIs', 'TypeScript', 'JavaScript']
    },
    {
      id: '2',
      title: 'Ingeniero de Software',
      company: 'Gato Marketing y Software S.A.C',
      period: 'Agosto 2025 - Enero 2026',
      location: 'Lima, Perú',
      type: 'work',
      current: false,
      description: 'Participación en equipo de desarrollo para módulo contable de ERP, trabajando en arquitectura full stack con metodologías ágiles.',
      achievements: [
        'Maquetación e integración de interfaces con Angular en módulo contable ERP',
        'Trabajo colaborativo en equipo de 3 desarrolladores',
        'Gestión de bugs y seguimiento de tareas en Jira',
        'Implementación de mejoras continuas basadas en feedback de usuarios'
      ],
      technologies: ['Angular', 'Express.js', 'Node.js', 'Jira', 'Git']
    },
    {
      id: '3',
      title: 'Full Stack Developer',
      company: 'Sistema InnovaShop (Freelance)',
      period: 'Julio 2024 - Febrero 2025',
      location: 'Trujillo, Perú',
      type: 'freelance',
      current: false,
      description: 'Diseño y desarrollo completo de plataforma e-commerce escalable para venta de productos electrónicos, desde la arquitectura hasta el despliegue en producción.',
      achievements: [
        'Desarrollo full stack con Angular + Spring Boot, garantizando experiencia de usuario dinámica',
        'Implementación de seguridad con JWT y Spring Security para transacciones protegidas',
        'Contenedorización con Docker y despliegue exitoso en AWS',
        'Pruebas de rendimiento con JMeter para alta disponibilidad bajo cargas de tráfico',
        'Desarrollo de suite de pruebas unitarias con Mockito para calidad de código',
        'Diseño e implementación de base de datos MySQL optimizada'
      ],
      technologies: ['Angular', 'Spring Boot', 'MySQL', 'Docker', 'AWS', 'JWT', 'Spring Security', 'JMeter', 'Mockito']
    }
  ];

  getTypeIcon(type: string): string {
    switch (type) {
      case 'work':
        return 'fas fa-briefcase';
      case 'freelance':
        return 'fas fa-laptop-code';
      case 'education':
        return 'fas fa-graduation-cap';
      default:
        return 'fas fa-circle';
    }
  }

  getTypeColor(type: string): string {
    switch (type) {
      case 'work':
        return 'text-emerald-600 dark:text-emerald-400';
      case 'freelance':
        return 'text-blue-600 dark:text-blue-400';
      case 'education':
        return 'text-purple-600 dark:text-purple-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  }

  getTypeBgColor(type: string): string {
    switch (type) {
      case 'work':
        return 'bg-emerald-100 dark:bg-emerald-900/30';
      case 'freelance':
        return 'bg-blue-100 dark:bg-blue-900/30';
      case 'education':
        return 'bg-purple-100 dark:bg-purple-900/30';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30';
    }
  }

  getTypeGradient(type: string): string {
    switch (type) {
      case 'work':
        return 'bg-gradient-to-br from-emerald-500 to-emerald-600';
      case 'freelance':
        return 'bg-gradient-to-br from-blue-500 to-blue-600';
      case 'education':
        return 'bg-gradient-to-br from-purple-500 to-purple-600';
      default:
        return 'bg-gradient-to-br from-gray-500 to-gray-600';
    }
  }
}
