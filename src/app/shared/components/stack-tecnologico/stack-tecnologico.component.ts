import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, state } from '@angular/animations';

interface TechSkill {
  name: string;
  icon: string;
  level: number;
  category: string;
}

@Component({
  selector: 'app-stack-tecnologico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stack-tecnologico.component.html',
  animations: [
    trigger('fadeInUp', [
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
        transform: 'translateX(-80px)'
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
export class StackTecnologicoComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('techCard') techCards!: QueryList<ElementRef>;
  
  private observer!: IntersectionObserver;
  animationStates: { [key: string]: string } = {};
  headerState = 'hidden';

  // Datos de habilidades Frontend
  frontend: TechSkill[] = [
    {
      name: 'HTML5',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
      level: 95,
      category: 'frontend'
    },
    {
      name: 'CSS3',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
      level: 90,
      category: 'frontend'
    },
    {
      name: 'JavaScript',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
      level: 88,
      category: 'frontend'
    },
    {
      name: 'TypeScript',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
      level: 85,
      category: 'frontend'
    },
    {
      name: 'Angular',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
      level: 82,
      category: 'frontend'
    },
    {
      name: 'Tailwind CSS',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
      level: 90,
      category: 'frontend'
    },
  ];

  // Datos de habilidades Backend
  backend: TechSkill[] = [
    {
      name: 'Java',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
      level: 88,
      category: 'backend'
    },
    {
      name: 'Spring Boot',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg',
      level: 85,
      category: 'backend'
    },
    {
      name: 'Python',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      level: 80,
      category: 'backend'
    },
    {
      name: 'Node.js',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
      level: 75,
      category: 'backend'
    },
  ];

  // Datos de bases de datos
  databases: TechSkill[] = [
    {
      name: 'MySQL',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
      level: 85,
      category: 'database'
    },
    {
      name: 'PostgreSQL',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
      level: 80,
      category: 'database'
    },
    {
      name: 'MongoDB',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
      level: 75,
      category: 'database'
    },
  ];

  // Herramientas y tecnologías
  tools: TechSkill[] = [
    {
      name: 'Git',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
      level: 90,
      category: 'tool'
    },
    {
      name: 'GitHub',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
      level: 88,
      category: 'tool'
    },
    {
      name: 'Docker',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
      level: 78,
      category: 'tool'
    },
    {
      name: 'VS Code',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg',
      level: 95,
      category: 'tool'
    },
  ];

  // MÉTODOS OPTIMIZADOS PARA RESPONSIVIDAD

  /**
   * TrackBy function para optimizar performance
   */
  trackByTech(index: number, tech: TechSkill): string {
    return `${tech.name}-${tech.category}`;
  }

  /**
   * Manejo de errores para iconos con fallback SVG
   */
  handleTechIconError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (!target) return;

    console.warn(`Error loading icon: ${target.src}`);

    // Fallback SVG más robusto
    target.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" fill="#f3f4f6" rx="8"/>
        <circle cx="16" cy="16" r="6" fill="#9ca3af"/>
        <circle cx="16" cy="14" r="2" fill="#6b7280"/>
        <path d="M12 20c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="#6b7280" stroke-width="1.5" fill="none"/>
      </svg>
    `)}`;
  }

  /**
   * Obtiene el número de columnas basado en el tamaño de pantalla
   */
  getResponsiveColumns(category: TechSkill[]): string {
    const length = category.length;

    // Lógica responsive mejorada
    if (length <= 2) return 'grid-cols-2';
    if (length <= 4) return 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2';
    if (length <= 6) return 'grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3';
    return 'grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4';
  }

  /**
   * Obtiene todas las tecnologías con nivel mínimo
   */
  getTechnologiesByLevel(minLevel: number): TechSkill[] {
    const allTech = [
      ...this.frontend,
      ...this.backend,
      ...this.databases,
      ...this.tools
    ];
    return allTech.filter(tech => tech.level >= minLevel);
  }

  /**
   * Calcula el promedio de nivel por categoría
   */
  getAverageLevel(category: TechSkill[]): number {
    if (category.length === 0) return 0;
    const sum = category.reduce((acc, tech) => acc + tech.level, 0);
    return Math.round(sum / category.length);
  }

  /**
   * Obtiene el total de tecnologías
   */
  getTotalTechnologies(): number {
    return this.frontend.length +
           this.backend.length +
           this.databases.length +
           this.tools.length;
  }

  /**
   * Obtiene la categoría con más tecnologías
   */
  getMostPopularCategory(): string {
    const categories = [
      { name: 'Frontend', count: this.frontend.length },
      { name: 'Backend', count: this.backend.length },
      { name: 'Databases', count: this.databases.length },
      { name: 'Tools', count: this.tools.length }
    ];

    return categories.reduce((prev, current) =>
      prev.count > current.count ? prev : current
    ).name;
  }

  /**
   * Obtiene la configuración de color por categoría
   */
  getCategoryConfig(category: string): { color: string, icon: string, title: string, subtitle: string } {
    const configs = {
      frontend: {
        color: 'emerald',
        icon: 'fas fa-palette',
        title: 'Frontend',
        subtitle: 'Interfaces & UX'
      },
      backend: {
        color: 'blue',
        icon: 'fas fa-server',
        title: 'Backend',
        subtitle: 'Lógica & APIs'
      },
      database: {
        color: 'purple',
        icon: 'fas fa-database',
        title: 'Databases',
        subtitle: 'Gestión de Datos'
      },
      tool: {
        color: 'orange',
        icon: 'fas fa-tools',
        title: 'Herramientas',
        subtitle: 'DevOps & Utilidades'
      }
    };

    return configs[category as keyof typeof configs] || configs.frontend;
  }

  /**
   * Verifica si el dispositivo soporta hover
   */
  get supportsHover(): boolean {
    return window.matchMedia('(hover: hover)').matches;
  }

  /**
   * Detecta si es un dispositivo táctil
   */
  get isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  ngOnInit(): void {
    // Inicializar estados de animación para cada categoría
    ['frontend', 'backend', 'databases', 'tools'].forEach(category => {
      this.animationStates[category] = 'hidden';
    });

    // Crear IntersectionObserver
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const category = entry.target.getAttribute('data-category');
            if (category) {
              setTimeout(() => {
                this.animationStates[category] = 'visible';
              }, 100);
            } else if (entry.target.classList.contains('stack-header')) {
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

  ngAfterViewInit(): void {
    // Observar el header
    const headerElement = document.querySelector('.stack-header');
    if (headerElement) {
      this.observer.observe(headerElement);
    }

    // Observar cada categoría de tecnologías
    this.techCards?.forEach(card => {
      this.observer.observe(card.nativeElement);
    });
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  getAnimationState(category: string): string {
    return this.animationStates[category] || 'hidden';
  }
}
