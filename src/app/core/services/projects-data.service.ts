// src/app/core/services/projects-data.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';

export interface Technology {
  name: string;
  icon: string;
}

export interface ProjectLink {
  type: 'github' | 'demo' | 'documentation' | 'download';
  url: string;
  label: string;
}

export interface ProjectMetrics {
  stars?: number;
  forks?: number;
  downloads?: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  image: string;
  technologies: Technology[];
  links: ProjectLink[];
  category: string;
  status: string;
  featured: boolean;
  createdAt: Date;
  highlights?: string[];
  challenges?: string[];
  metrics?: ProjectMetrics;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectsDataService {
  private projectsSubject = new BehaviorSubject<Project[]>([]);
  public projects$ = this.projectsSubject.asObservable();

  constructor() {
    this.initializeProjects();
  }

  private initializeProjects(): void {
    const projects: Project[] = [
      {
        id: '1',
        title: 'Sistema de Ventas de Productos Electrónicos',
        description:
          'Plataforma completa para gestionar ventas y productos electrónicos en línea, con carrito de compras inteligente, múltiples métodos de pago, gestión de inventario en tiempo real y panel de administración avanzado.',
        shortDescription:
          'Plataforma e-commerce completa para productos electrónicos con gestión de inventario y pagos.',
        image: '../assets/jwt-autenticator.png',
        technologies: [
          {
            name: 'Angular',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
          },
          {
            name: 'TypeScript',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
          },
          {
            name: 'Tailwind CSS',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
          },
          {
            name: 'Firebase',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
          },
        ],
        links: [
          {
            type: 'github',
            url: 'https://github.com/VCL-tt/sistema-ventas-electronicos',
            label: 'Código Fuente',
          },
          {
            type: 'demo',
            url: 'https://ventas-demo.vercel.app',
            label: 'Demo en Vivo',
          },
        ],
        category: 'web',
        status: 'completed',
        featured: true,
        createdAt: new Date('2024-03-15'),
        highlights: [
          'Sistema de autenticación completo con JWT',
          'Carrito de compras persistente',
          'Panel de administración con métricas',
          'Integración con pasarelas de pago',
          'Responsive design optimizado',
        ],
        metrics: {
          stars: 24,
          forks: 8,
          downloads: 150,
        },
      },
      {
        id: '2',
        title: 'Aplicación de Seguimiento en Tiempo Real de Buses',
        description:
          'Aplicación móvil innovadora para el seguimiento en tiempo real de buses urbanos, utilizando Google Maps API para geolocalización precisa, notificaciones push para alertas de llegada, y sistema de rutas optimizadas con Firebase como backend.',
        shortDescription:
          'App móvil para seguimiento GPS de transporte público con notificaciones en tiempo real.',
        image: '../assets/Ubicate.png',
        technologies: [
          {
            name: 'Kotlin',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg',
          },
          {
            name: 'Android',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg',
          },
          {
            name: 'Google Maps API',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg',
          },
          {
            name: 'Firebase',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
          },
        ],
        links: [
          {
            type: 'github',
            url: 'https://github.com/ubicate-app/app-ubicate-android.git',
            label: 'Ver Repositorio',
          },
        ],
        category: 'mobile',
        status: 'completed',
        featured: true,
        createdAt: new Date('2024-01-20'),
        highlights: [
          'Tracking GPS en tiempo real',
          'Notificaciones push inteligentes',
          'Interfaz Material Design',
          'Optimización de batería',
          'Soporte offline básico',
        ],
        metrics: {
          downloads: 500,
          stars: 18,
          forks: 5,
        },
      },
      {
        id: '3',
        title: 'Aplicación Móvil Prodent - Citas Médicas',
        description:
          'Sistema integral de gestión de citas médicas para múltiples especialidades, que permite agendar citas, recibir recordatorios automatizados, mantener historial médico digital, y comunicación directa con profesionales de salud a través de chat integrado.',
        shortDescription:
          'Sistema de gestión de citas médicas con recordatorios y comunicación con doctores.',
        image: '../assets/banner-prodent.png',
        technologies: [
          {
            name: 'Kotlin',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg',
          },
          {
            name: 'Android',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg',
          },
          {
            name: 'Firebase',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
          },
        ],
        links: [
          {
            type: 'github',
            url: 'https://github.com/App-Android-Prodent/App-Prodent.git',
            label: 'Código Fuente',
          },
        ],
        category: 'mobile',
        status: 'completed',
        featured: false,
        createdAt: new Date('2023-11-10'),
        highlights: [
          'Gestión completa de citas',
          'Recordatorios automáticos',
          'Chat con profesionales',
          'Historial médico digital',
          'Múltiples especialidades',
        ],
        metrics: {
          downloads: 500,
          stars: 18,
          forks: 5,
        },
      },
      {
        id: '4',
        title: 'Control de Dispositivos IoT con Arduino y Bluetooth',
        description:
          'Sistema completo de domótica para controlar dispositivos IoT como carritos robóticos, sistemas de iluminación inteligente, sensores ambientales y más, utilizando comunicación Bluetooth, programación en Arduino y aplicación Android para control remoto.',
        shortDescription:
          'Sistema de domótica para control remoto de dispositivos IoT via Bluetooth.',
        image: '../assets/jwt-autenticator.png',
        technologies: [
          {
            name: 'Arduino',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg',
          },
          {
            name: 'Kotlin',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg',
          },
          {
            name: 'Android',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg',
          },
          {
            name: 'C++',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
          },
        ],
        links: [
          {
            type: 'github',
            url: 'https://github.com/VCL-tt/control-iot-arduino',
            label: 'Ver Código',
          },
          {
            type: 'demo',
            url: 'https://demo-control-iot.vercel.app',
            label: 'Demo Interactiva',
          },
        ],
        category: 'iot',
        status: 'in-progress',
        featured: true,
        createdAt: new Date('2024-02-05'),
        highlights: [
          'Control remoto via Bluetooth',
          'Múltiples dispositivos IoT',
          'Interfaz Android intuitiva',
          'Programación Arduino optimizada',
          'Comunicación bidireccional',
        ],
        metrics: {
          downloads: 500,
          stars: 18,
          forks: 5,
        },
      },
      {
        id: '5',
        title: 'Sistema de Autenticación JWT con MFA',
        description:
          'Sistema de seguridad robusto que implementa autenticación con JSON Web Tokens y autenticación multifactor usando Google Authenticator, incluyendo gestión de roles, sesiones seguras, y protección contra ataques comunes como CSRF y XSS.',
        shortDescription:
          'Sistema de login seguro con JWT y autenticación de dos factores.',
        image: '../assets/jwt-autenticator.png',
        technologies: [
          {
            name: 'Angular',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
          },
          {
            name: 'Spring Boot',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg',
          },
          {
            name: 'Java',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
          },
          { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-plain-wordmark.svg' }

        ],
        links: [
          {
            type: 'github',
            url: 'https://github.com/orgs/App-Authenticator/repositories',
            label: 'Ver Código',
          },
          {
            type: 'demo',
            url: 'https://auth-jcvcode.netlify.app/auth',
            label: 'Demo en Vivo',
          },
        ],
        category: 'web',
        status: 'completed',
        featured: true,
        createdAt: new Date('2024-04-12'),
        highlights: [
          'Autenticación JWT segura',
          'MFA con Google Authenticator',
          'Gestión avanzada de roles',
          'Protección CSRF y XSS',
          'Sesiones con refresh tokens',
        ],
        metrics: {
          stars: 32,
          forks: 12,
        },
      },
    ];

    this.projectsSubject.next(projects);
  }

  getProjects(): Observable<Project[]> {
    return this.projects$;
  }

  getProjectById(id: string): Observable<Project | undefined> {
    const projects = this.projectsSubject.value;
    const project = projects.find((p) => p.id === id);
    return of(project);
  }

  getFeaturedProjects(): Observable<Project[]> {
    const projects = this.projectsSubject.value;
    const featured = projects.filter((p) => p.featured);
    return of(featured);
  }
}
