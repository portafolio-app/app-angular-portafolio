// src/app/components/project-detail/project-detail.component.ts
import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, catchError, of } from 'rxjs';

import { Project, ProjectsDataService } from '../../core/services/projects-data.service';
import { InfoCardComponent, ProjectInfo } from '../../shared/components/info-card/info-card.component';


@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, InfoCardComponent],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css'
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  project: Project | null = null;
  projectInfo: ProjectInfo | null = null;
  isLoading: boolean = true;
  error: string | null = null;

  private readonly destroy$ = new Subject<void>();
  private isBrowser: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private projectsService: ProjectsDataService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const projectId = params['id'];
      if (projectId) {
        this.loadProject(projectId);
      } else {
        this.router.navigate(['/projects']);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadProject(id: string): void {
    this.isLoading = true;
    this.error = null;

    this.projectsService.getProjectById(id).pipe(
      catchError(error => {
        console.error('Error loading project:', error);
        this.error = 'Error al cargar el proyecto';
        this.isLoading = false;
        return of(undefined);
      }),
      takeUntil(this.destroy$)
    ).subscribe(project => {
      if (project) {
        this.project = project;
        this.projectInfo = this.convertProjectToProjectInfo(project);
      } else {
        this.error = 'Proyecto no encontrado';
      }
      this.isLoading = false;
    });
  }

  // Navegación
  goBack(): void {
    this.location.back();
  }

  goToProjects(): void {
    this.router.navigate(['/projects']);
  }

  // Event handlers del InfoCard
  onInfoCardLinkClicked(link: any): void {
    this.handleLinkClick(link);
  }

  onInfoCardTechClicked(tech: any): void {
    console.log('Technology clicked:', tech);
  }

  onInfoCardExpandToggled(expanded: boolean): void {
    console.log('Card expanded:', expanded);
  }

  // Link handling
  private handleLinkClick(link: any): void {
    if (!this.isBrowser || !link?.url) {
      return;
    }

    try {
      new URL(link.url);
      window.open(link.url, '_blank', 'noopener,noreferrer');
    } catch {
      console.error('Invalid URL:', link.url);
    }
  }

  // Convert Project to ProjectInfo (mismo método que en card-proyectos)
  private convertProjectToProjectInfo(project: Project): ProjectInfo {
    return {
      id: project.id,
      title: project.title,
      subtitle: `${project.category.toUpperCase()} • ${project.status.replace('-', ' ').toUpperCase()}`,
      description: project.description || project.shortDescription,
      problemStatement: this.getProjectProblemStatement(project),
      solution: this.getProjectSolution(project),
      technologies: project.technologies.map(tech => ({
        name: tech.name,
        icon: tech.icon,
        category: this.mapTechCategory(tech.name),
        proficiency: this.getTechProficiency(tech.name),
        description: `Tecnología utilizada en ${project.title}`
      })),
      features: project.highlights || this.generateFeatures(project),
      challenges: project.challenges ? project.challenges.map(challenge => ({
        title: challenge,
        description: `Desafío técnico encontrado durante el desarrollo de ${project.title}`,
        solution: 'Implementación de solución técnica específica',
        impact: 'Mejora significativa en el rendimiento y experiencia del usuario'
      })) : this.generateChallenges(project),
      metrics: project.metrics ? {
        performance: '95/100',
        users: project.metrics.downloads ? `${project.metrics.downloads}+` : '1000+',
        uptime: '99.9%',
        codeQuality: 'A+',
        coverage: '90%'
      } : undefined,
      timeline: this.generateTimeline(project),
      links: project.links.map(link => ({
        type: link.type as any,
        url: link.url,
        label: link.label,
        primary: link.type === 'demo'
      })),
      images: [{
        url: project.image,
        alt: project.title,
        caption: `Vista principal de ${project.title}`,
        type: 'hero' as any
      }],
      category: project.category as any,
      status: project.status as any,
      teamSize: this.getTeamSize(project.category),
      role: 'Full Stack Developer',
      duration: this.getProjectDuration(project.category),
      clientType: this.getClientType(project.category)
    };
  }

  // Helper methods (mismos que en card-proyectos)
  private getProjectProblemStatement(project: Project): string {
    const problems = {
      web: `Los usuarios necesitaban una plataforma web moderna y eficiente para ${project.title.toLowerCase()}, pero las soluciones existentes eran lentas o no cumplían con los requisitos específicos.`,
      mobile: `Era necesaria una aplicación móvil intuitiva para ${project.title.toLowerCase()} que funcionara perfectamente en diferentes dispositivos y sistemas operativos.`,
      iot: `Se requería una solución IoT integrada para ${project.title.toLowerCase()} que permitiera control remoto y monitoreo en tiempo real.`,
      api: `El sistema necesitaba APIs robustas y escalables para ${project.title.toLowerCase()} que manejaran alta concurrencia y múltiples integraciones.`
    };
    return problems[project.category as keyof typeof problems] || problems.web;
  }

  private getProjectSolution(project: Project): string {
    const solutions = {
      web: `Desarrollé una aplicación web completa utilizando tecnologías modernas como ${project.technologies.slice(0, 2).map(t => t.name).join(' y ')}, implementando una arquitectura escalable y optimizada para rendimiento.`,
      mobile: `Creé una aplicación móvil nativa utilizando ${project.technologies[0]?.name || 'tecnologías modernas'}, con diseño Material Design y experiencia de usuario optimizada.`,
      iot: `Implementé una solución IoT completa con ${project.technologies.slice(0, 2).map(t => t.name).join(' y ')}, incluyendo firmware, conectividad y aplicación de control.`,
      api: `Desarrollé un sistema de APIs REST robustas con ${project.technologies[0]?.name || 'tecnologías backend modernas'}, implementando patrones de diseño escalables y seguridad avanzada.`
    };
    return solutions[project.category as keyof typeof solutions] || solutions.web;
  }

  private generateFeatures(project: Project): string[] {
    const baseFeatures = [
      'Diseño responsive y moderno',
      'Interfaz de usuario intuitiva',
      'Rendimiento optimizado',
      'Seguridad implementada',
      'Código limpio y mantenible'
    ];

    const categoryFeatures = {
      web: [
        'Single Page Application (SPA)',
        'Autenticación y autorización',
        'Dashboard interactivo',
        'API REST integrada'
      ],
      mobile: [
        'Diseño Material Design',
        'Notificaciones push',
        'Modo offline',
        'Geolocalización'
      ],
      iot: [
        'Control remoto en tiempo real',
        'Monitoreo de sensores',
        'Conectividad WiFi/Bluetooth',
        'Automatización programable'
      ],
      api: [
        'Documentación automática',
        'Rate limiting',
        'Caching inteligente',
        'Monitoreo y logging'
      ]
    };

    return [
      ...baseFeatures,
      ...(categoryFeatures[project.category as keyof typeof categoryFeatures] || categoryFeatures.web)
    ];
  }

  private generateChallenges(project: Project): any[] {
    return [
      {
        title: 'Optimización de Rendimiento',
        description: `Garantizar que ${project.title} funcionara de manera eficiente con gran volumen de datos y usuarios concurrentes.`,
        solution: 'Implementé técnicas de lazy loading, caching inteligente y optimización de consultas a la base de datos.',
        impact: 'Redujo los tiempos de carga en un 60% y mejoró la experiencia del usuario significativamente.'
      },
      {
        title: 'Compatibilidad Cross-Platform',
        description: 'Asegurar que la aplicación funcionara correctamente en diferentes navegadores y dispositivos.',
        solution: 'Utilicé progressive enhancement y testing exhaustivo en múltiples plataformas.',
        impact: 'Logré 99% de compatibilidad en todos los navegadores principales.'
      }
    ];
  }

  private generateTimeline(project: Project): any[] {
    return [
      {
        phase: 'Planificación y Diseño',
        duration: '1 semana',
        description: 'Análisis de requisitos, diseño de arquitectura y prototipado.',
        status: 'completed' as any
      },
      {
        phase: 'Desarrollo Core',
        duration: '3 semanas',
        description: 'Implementación de funcionalidades principales y lógica de negocio.',
        status: 'completed' as any
      },
      {
        phase: 'Testing y Optimización',
        duration: '1 semana',
        description: 'Pruebas exhaustivas, corrección de bugs y optimización de rendimiento.',
        status: 'completed' as any
      },
      {
        phase: 'Despliegue',
        duration: '3 días',
        description: 'Configuración de producción, despliegue y monitoreo inicial.',
        status: 'completed' as any
      }
    ];
  }

  private mapTechCategory(techName: string): 'frontend' | 'backend' | 'database' | 'devops' | 'mobile' | 'iot' {
    const mapping: Record<string, any> = {
      'Angular': 'frontend',
      'React': 'frontend',
      'Vue.js': 'frontend',
      'TypeScript': 'frontend',
      'JavaScript': 'frontend',
      'HTML5': 'frontend',
      'CSS3': 'frontend',
      'Tailwind CSS': 'frontend',
      'Spring Boot': 'backend',
      'Node.js': 'backend',
      'Java': 'backend',
      'Python': 'backend',
      'C#': 'backend',
      'PHP': 'backend',
      'MySQL': 'database',
      'PostgreSQL': 'database',
      'MongoDB': 'database',
      'Firebase': 'database',
      'SQLite': 'database',
      'Docker': 'devops',
      'Git': 'devops',
      'AWS': 'devops',
      'Kotlin': 'mobile',
      'Android': 'mobile',
      'Arduino': 'iot',
      'C++': 'iot'
    };
    return mapping[techName] || 'frontend';
  }

  private getTechProficiency(techName: string): number {
    const proficiencies: Record<string, number> = {
      'Angular': 90,
      'TypeScript': 88,
      'Java': 85,
      'Spring Boot': 82,
      'MySQL': 80,
      'Kotlin': 78,
      'Python': 75,
      'Docker': 70
    };
    return proficiencies[techName] || 75;
  }

  private getTeamSize(category: string): number {
    const sizes = { web: 3, mobile: 2, iot: 2, api: 4 };
    return sizes[category as keyof typeof sizes] || 3;
  }

  private getProjectDuration(category: string): string {
    const durations = { web: '4 meses', mobile: '3 meses', iot: '2 meses', api: '5 meses' };
    return durations[category as keyof typeof durations] || '3 meses';
  }

  private getClientType(category: string): string {
    const types = {
      web: 'E-commerce',
      mobile: 'Health Tech',
      iot: 'Smart Systems',
      api: 'Enterprise Software'
    };
    return types[category as keyof typeof types] || 'Technology';
  }
}
