import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, state } from '@angular/animations';

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
    ]),
    trigger('slideInLeft', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateX(-100px)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('hidden => visible', [
        animate('700ms cubic-bezier(0.34, 1.56, 0.64, 1)')
      ])
    ]),
    trigger('slideInRight', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateX(100px)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('hidden => visible', [
        animate('700ms cubic-bezier(0.34, 1.56, 0.64, 1)')
      ])
    ])
  ]
})
export class ExperienciaComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('experienceCard') experienceCards!: QueryList<ElementRef>;

  private observer!: IntersectionObserver;
  animationStates: { [key: string]: string } = {};
  headerState = 'hidden';

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
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
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
      period: 'Agosto 2025 - Noviembre 2025',
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
}
