// src/app/core/services/projects-data.service.ts - MEJORADO
import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';

export interface Technology {
  name: string;
  icon: string;
}

export interface ProjectLink {
  type: 'github' | 'demo' | 'documentation' | 'download' | 'video';
  url: string;
  label: string;
  platform?: 'youtube' | 'vimeo' | 'loom' | 'direct';
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
  videoUrl?: string;
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
        title: 'GigaShop - E-commerce de Electrónicos',
        description:
          'Plataforma e-commerce full-stack especializada en productos electrónicos, desarrollada con Angular y Spring Boot. Implementa funcionalidades avanzadas como carrito persistente, procesamiento de pagos seguro, gestión de inventario en tiempo real, panel de administración con analytics, y sistema de autenticación JWT robusto.',
        shortDescription:
          'E-commerce full-stack para electrónicos con carrito inteligente, pagos seguros y panel admin.',
        image: '../assets/banner-ventaas.png',
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
            name: 'TypeScript',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
          },
          {
            name: 'Tailwind CSS',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
          },
          {
            name: 'MySQL',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-plain-wordmark.svg',
          },
          {
            name: 'Java',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
          },
        ],
        links: [
          {
            type: 'github',
            url: 'https://github.com/App-GigaShop/aapp-Gigashop-Back.git',
            label: 'Repositorio Backend',
          }
        ],
        category: 'web',
        status: 'completed',
        featured: true,
        createdAt: new Date('2024-03-15'),
        highlights: [
          'Arquitectura hexagonal con Clean Code',
          'Autenticación JWT + Refresh Tokens',
          'Carrito persistente con Redis cache',
          'Integración con pasarelas de pago (Stripe)',
          'Panel admin con métricas en tiempo real',
          'API REST documentada con Swagger',
          'Tests unitarios y de integración',
          'Despliegue con Docker y CI/CD',
        ],
        metrics: {
          stars: 28,
          forks: 12,
          downloads: 180,
        },
      },
      {
        id: '2',
        title: 'FinanceTracker - Gestión de Deudas Inteligente',
        description:
          'Aplicación web progresiva (PWA) desarrollada con React + Vite para gestión financiera personal. Permite tracking de deudas, recordatorios automatizados, análisis de gastos con gráficos interactivos, y sincronización multi-dispositivo. Utiliza Firebase para autenticación, Firestore para datos en tiempo real, y notificaciones push.',
        shortDescription:
          'PWA para gestión financiera personal con recordatorios inteligentes y análisis de gastos.',
        image: '../assets/gestor-deudas.png',
        technologies: [
          {
            name: 'React',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
          },
          {
            name: 'Vite',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vite/vite-original.svg',
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
            url: 'https://github.com/VCL-tt/finance-organizer',
            label: 'Ver Código',
          },
          {
            type: 'demo',
            url: 'https://jcv-code.netlify.app',
            label: 'Demo en Vivo',
          },
        ],
        category: 'web',
        status: 'completed',
        featured: true,
        createdAt: new Date('2024-07-29'),
        highlights: [
          'PWA con funcionalidad offline',
          'Dashboard con gráficos interactivos (Chart.js)',
          'Recordatorios push personalizables',
          'Autenticación social (Google, GitHub)',
          'Sincronización en tiempo real multi-dispositivo',
          'Export de datos a Excel/PDF',
          'Categorización automática de gastos',
          'Modo oscuro y preferencias de usuario',
        ],
        videoUrl: 'https://www.youtube.com/watch?v=demo-finance-tracker',
        metrics: {
          stars: 15,
          forks: 6,
          downloads: 150,
        },
      },
      {
        id: '3',
        title: 'UbicaTe - Tracking GPS de Transporte Público',
        description:
          'Aplicación móvil nativa Android que revoluciona el transporte público mediante tracking GPS en tiempo real. Integra Google Maps API, algoritmos de predicción de llegadas, notificaciones push contextuales, y gamificación para mejorar la experiencia del usuario. Incluye modo offline y optimización de batería.',
        shortDescription:
          'App nativa Android para tracking GPS de buses con predicciones inteligentes y gamificación.',
        image: '../assets/Ubicate.png',
        technologies: [
          {
            name: 'Kotlin',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg',
          },
          {
            name: 'Android SDK',
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
          {
            name: 'Room Database',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg',
          },
        ],
        links: [
          {
            type: 'github',
            url: 'https://github.com/ubicate-app/app-ubicate-android.git',
            label: 'Código Fuente',
          },
          {
            type: 'video',
            url: 'https://www.youtube.com/watch?v=ubicate-demo',
            label: 'Demo Funcional',
            platform: 'youtube',
          },
        ],
        category: 'mobile',
        status: 'completed',
        featured: true,
        createdAt: new Date('2024-01-20'),
        highlights: [
          'Tracking GPS con precisión sub-métrica',
          'Algoritmos ML para predicción de llegadas',
          'Notificaciones push inteligentes por contexto',
          'UI/UX con Material Design 3',
          'Gamificación con sistema de puntos',
          'Modo offline con caché inteligente',
          'Optimización de batería (Doze mode)',
          'Analytics de rutas más utilizadas',
        ],
        metrics: {
          downloads: 750,
          stars: 22,
          forks: 8,
        },
      },
      {
        id: '4',
        title: 'ProDent - Gestión Médica Digital',
        description:
          'Sistema integral de gestión médica especializado en odontología, desarrollado con arquitectura MVVM y Jetpack Compose. Facilita agendamiento de citas, historial clínico digital, comunicación paciente-doctor, recordatorios automatizados, y gestión de tratamientos. Incluye sincronización cloud y modo offline.',
        shortDescription:
          'Sistema médico digital con Jetpack Compose para gestión de citas y comunicación doctor-paciente.',
        image: '../assets/banner-prodent.png',
        technologies: [
          {
            name: 'Kotlin',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg',
          },
          {
            name: 'Jetpack Compose',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg',
          },
          {
            name: 'Firebase',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
          },
          {
            name: 'Room Database',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg',
          },
        ],
        links: [
          {
            type: 'github',
            url: 'https://github.com/App-Android-Prodent/App-Prodent.git',
            label: 'Repositorio Principal',
          },

        ],
        category: 'mobile',
        status: 'completed',
        featured: true,
        createdAt: new Date('2023-11-10'),
        highlights: [
          'Arquitectura MVVM con Clean Architecture',
          'UI moderna 100% Jetpack Compose',
          'Chat en tiempo real con cifrado E2E',
          'Historial clínico con fotos y documentos',
          'Calendario interactivo con disponibilidad',
          'Notificaciones push personalizadas',
          'Generación de reportes PDF',
          'Integración con calendarios del sistema',
        ],
        metrics: {
          downloads: 320,
          stars: 18,
          forks: 5,
        },
      },
      {
        id: '5',
        title: 'SecureAuth - Sistema MFA Enterprise',
        description:
          'Sistema de autenticación empresarial de alto nivel que implementa múltiples factores de autenticación (MFA), Single Sign-On (SSO), y gestión granular de permisos. Desarrollado con Spring Security avanzado, incluye protección contra ataques modernos, auditoría completa, y integración con servicios de identidad corporativos.',
        shortDescription:
          'Sistema enterprise de autenticación MFA con SSO, auditoría y protección avanzada.',
        image: '../assets/jwt-autenticator.png',
        technologies: [
          {
            name: 'Angular',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
          },
          {
            name: 'Spring Security',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg',
          },
          {
            name: 'Java',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
          },
          {
            name: 'PostgreSQL',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
          },
          {
            name: 'Redis',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg',
          },
        ],
        links: [
          {
            type: 'github',
            url: 'https://github.com/App-Authenticator/App-JWT-Auth-Backend.git',
            label: 'Backend Security',
          },
          {
            type: 'github',
            url: 'https://github.com/App-Authenticator/App-JWT-Auth-FrontEnd.git',
            label: 'Frontend Angular',
          },
          {
            type: 'demo',
            url: 'https://secure-auth-demo.netlify.app',
            label: 'Demo Segura',
          },
        ],
        category: 'web',
        status: 'completed',
        featured: true,
        createdAt: new Date('2024-04-12'),
        highlights: [
          'MFA con TOTP, SMS y biometría',
          'Single Sign-On (SSO) con SAML/OAuth2',
          'Rate limiting y protección DDoS',
          'Auditoría completa con logs inmutables',
          'Gestión de roles RBAC granular',
          'Detección de anomalías con ML',
          'Cumplimiento GDPR y SOC2',
          'APIs para integración empresarial',
        ],
        metrics: {
          stars: 45,
          forks: 18,
          downloads: 85,
        },
      },
      {
        id: '6',
        title: 'RoboControl - Sistema IoT Inteligente',
        description:
          'Plataforma IoT completa que combina hardware Arduino personalizado con aplicación Android avanzada. El robot incluye sensores inteligentes, actuadores programables, visión artificial básica, y conectividad dual (WiFi/Bluetooth). La app utiliza Jetpack Compose con arquitectura reactiva para control en tiempo real y programación de rutinas.',
        shortDescription:
          'Plataforma IoT con robot inteligente, sensores avanzados y app Android con Jetpack Compose.',
        image: '../assets/banner-iot.png',
        technologies: [
          {
            name: 'Kotlin',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg',
          },
          {
            name: 'Jetpack Compose',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg',
          },
          {
            name: 'Arduino',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg',
          },
          {
            name: 'C++',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
          },
          {
            name: 'ESP32',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg',
          },
        ],
        links: [
          {
            type: 'github',
            url: 'https://github.com/app-carroControl/app-control-IoT.git',
            label: 'App Android',
          },
         
        ],
        category: 'iot',
        status: 'completed',
        featured: true,
        createdAt: new Date('2025-01-15'),
        highlights: [
          'Firmware custom con FreeRTOS para multitasking',
          'Sensores: ultrasónico, giroscopio, cámara básica',
          'Control dual: WiFi (TCP) y Bluetooth (BLE)',
          'App con arquitectura MVI + Coroutines',
          'UI reactiva con animaciones Compose',
          'Programación de rutinas automatizadas',
          'Telemetría en tiempo real con gráficos',
          'OTA updates para firmware remoto',
        ],
        challenges: [
          'Optimización de latencia en comunicación inalámbrica',
          'Gestión eficiente de energía en ESP32',
          'Sincronización estado app-hardware',
          'Implementación de protocolos de comunicación robustos',
        ],
        metrics: {
          stars: 32,
          forks: 14,
          downloads: 95,
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
