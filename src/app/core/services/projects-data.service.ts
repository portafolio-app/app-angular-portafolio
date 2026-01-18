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
        title: 'GigaShop - Plataforma E-commerce de productos electrónicos',
        description:
          'En el comercio de productos electrónicos, muchos negocios carecen de una plataforma unificada que les permita vender online con seguridad, mantener inventarios actualizados y procesar pagos de forma confiable. Esto limita sus ventas y reduce la confianza del cliente. GigaShop resuelve este problema con una solución e-commerce full-stack desarrollada en Angular (con Tailwind CSS) y Spring Boot (con Spring Security y JWT). El sistema incluye un área de usuario con autenticación segura, carrito persistente y pagos online mediante Stripe; y un panel administrativo para la gestión de productos, inventario y métricas en tiempo real, respaldado por MySQL. Su arquitectura sigue principios de Clean Code y está desplegado con Docker, asegurando escalabilidad y mantenibilidad.',
        shortDescription:
          'E-commerce seguro con pagos online, gestión en tiempo real y panel administrativo para productos electrónicos.',
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
          },
        ],
        category: 'freelance',
        status: 'completed',
        featured: true,
        createdAt: new Date('2024-03-15'),
        highlights: [
          'Identificación y solución de un problema real en e-commerce',
          'Autenticación segura con JWT y Spring Security',
          'Carrito persistente con Redis',
          'Pagos online con Stripe',
          'Panel administrativo con métricas en tiempo real',
          'Gestión de productos e inventario',
          'Arquitectura hexagonal y principios Clean Code',
          'Documentación API con Swagger',
          'Despliegue con Docker',
        ],
        metrics: {
          stars: 28,
          forks: 12,
          downloads: 180,
        },
      },
      {
        id: '7',
        title: 'UBICATE - Gestión de Transporte y Geolocalización en Tiempo Real',
        description:
          'UBICATE es una plataforma que permite a usuarios y conductores visualizar en tiempo real la ubicación de los buses, consultar ETA y rutas sobre mapas interactivos. El backend implementa Spring Security con JWT para autenticación/roles y persiste datos operativos en MySQL (conductores, buses, rutas, empresas). Las ubicaciones se publican y consumen en tiempo real desde Firebase/Firestore para baja latencia en el tracking. La solución integra Google Maps para trazado de rutas y geocercas, y notificaciones push para avisos críticos.',
        shortDescription:
          'Plataforma Angular + Firebase para tracking de buses y gestión de transporte.',
        image: '../assets/ubicate-v4.png',
        technologies: [
          { name: 'Angular', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg' },
          { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
          { name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
          { name: 'Spring Boot', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg' },
          { name: 'Spring Security', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg' },
          { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
          { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-plain-wordmark.svg' },
          { name: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' },
          { name: 'Google Maps API', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg' },
        ],
        links: [
          {
            type: 'demo',
            url: 'https://ubicatee.netlify.app/landing',
            label: 'Ver Demo',
          },
        ],
        category: 'freelance',
        status: 'completed',
        featured: true,
        createdAt: new Date('2024-09-10'),
        highlights: [
          'Backend Spring Boot con Spring Security (JWT, roles y permisos)',
          'Persistencia operativa en MySQL (conductores, buses, rutas, empresas)',
          'Seguimiento en tiempo real de buses con Firebase/Firestore',
          'Panel empresarial para gestión de conductores, rutas y flota',
          'Mapas interactivos con Google Maps y geocercas',
          'Notificaciones push para eventos y avisos a usuarios',
          'Frontend Angular responsivo y accesible',
        ],
        challenges: [
          'Optimización de rendimiento con gran volumen de ubicaciones',
          'Consistencia de datos en tiempo real entre perfiles',
          'Definición de reglas de seguridad en Firebase',
        ],
        metrics: {
          stars: 30,
          forks: 10,
          downloads: 500,
        },
      },
      {
        id: '8',
        title: 'Polule Ice - Sistema de Ventas e Inventario',
        description:
          'Sistema integral de gestión de ventas e inventario desarrollado como proyecto freelance. La aplicación implementa autenticación segura con JWT y Spring Security, permitiendo la administración de dos roles distintos: Administrador y Vendedor. El sistema ofrece un panel administrativo completo para la gestión de inventario en tiempo real, control de ventas, y generación de reportes diarios, semanales y mensuales. Desarrollado con Angular en el frontend y Spring Boot en el backend, utiliza MySQL como base de datos para garantizar la persistencia y confiabilidad de la información. La arquitectura permite escalar el negocio con funcionalidades como control de stock, alertas de inventario bajo, historial de transacciones y análisis de ventas.',
        shortDescription:
          'Sistema completo de ventas e inventario con autenticación JWT, reportes automáticos y gestión de roles.',
        image: '../assets/polule-ice.png',
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
            name: 'Spring Security',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg',
          },
          {
            name: 'TypeScript',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
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
            type: 'demo',
            url: 'https://polule-ice.netlify.app',
            label: 'Ver Demo',
          },
        ],
        category: 'freelance',
        status: 'completed',
        featured: true,
        createdAt: new Date('2025-01-17'),
        highlights: [
          'Autenticación segura con JWT y Spring Security',
          'Gestión de roles: Administrador y Vendedor',
          'Sistema de inventario en tiempo real',
          'Reportes diarios, semanales y mensuales',
          'Control de ventas y transacciones',
          'Alertas de stock bajo automáticas',
          'Panel administrativo intuitivo',
          'Historial completo de operaciones',
          'Análisis de ventas con gráficos',
        ],
        challenges: [
          'Implementación de sistema de permisos granular',
          'Optimización de consultas para reportes en tiempo real',
          'Sincronización de inventario entre múltiples usuarios',
        ],
        metrics: {
          stars: 20,
          forks: 8,
          downloads: 120,
        },
      },
      {
        id: '2',
        title: 'FinanceTracker - Gestión Inteligente de Deudas y Préstamos',
        description:
          'Muchas personas no llevan un control preciso de sus deudas y préstamos, lo que dificulta planificar pagos y calcular el impacto de intereses e impuestos a lo largo del tiempo. FinanceTracker resuelve este problema con una aplicación web desarrollada en React + Vite, Tailwind CSS y Firebase, que permite registrar deudas, calcular cuotas considerando tasas de interés e IGV, y recibir recordatorios automáticos de vencimientos. Ofrece autenticación segura con Google, almacenamiento y sincronización en tiempo real mediante Firestore, así como categorización automática de gastos para un mejor análisis financiero.',
        shortDescription:
          'Controla deudas y préstamos con cálculos automáticos, recordatorios y sincronización en tiempo real.',
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
          'Cálculo automático de cuotas con interés e impuestos',
          'Registro y visualización de deudas en tiempo real',
          'Recordatorios push personalizables',
          'Autenticación segura con Google',
          'Sincronización multi-dispositivo con Firestore',
          'Categorización automática de gastos',
        ],
        metrics: {
          stars: 15,
          forks: 6,
          downloads: 150,
        },
      },

      {
        id: '3',
        title: 'Ubícate - Tracking GPS de Transporte Público',
        description:
          'Aplicación móvil nativa Android desarrollada para mejorar la experiencia de los usuarios del transporte público mediante geolocalización en tiempo real. Ubícate permite visualizar la ubicación de los buses en un mapa interactivo, estimar el tiempo y la distancia hacia una parada seleccionada, y trazar rutas a pie para llegar al punto más cercano. La solución integra Google Maps API para el cálculo de rutas, Firebase para la sincronización en tiempo real y gestión de datos, y notificaciones push para avisos importantes.',
        shortDescription:
          'App Android para ver buses en tiempo real, calcular tiempos de llegada y rutas hacia paraderos cercanos.',
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
          'Ubicación de buses en tiempo real con alta precisión',
          'Cálculo de tiempo y distancia hacia paradas seleccionadas',
          'Rutas a pie hacia paraderos cercanos',
          'Notificaciones push para avisos relevantes',
          'Interfaz basada en Material Design 3',
          'Visualización de recorridos en Google Maps',
        ],
        metrics: {
          downloads: 750,
          stars: 22,
          forks: 8,
        },
      },
      {
        id: '4',
        title: 'ProDent - Agenda Médica y Gestión de Citas',
        description:
          'Aplicación móvil nativa Android para facilitar la gestión de citas médicas tanto para pacientes como doctores. Resuelve el problema de coordinación y seguimiento de citas, permitiendo a los pacientes registrar, visualizar y administrar sus reservas, consultar su historial médico, calificar doctores y dejar comentarios. Los doctores pueden registrar sus horarios disponibles, confirmar o rechazar citas y visualizar su agenda en un calendario interactivo. Incluye notificaciones push para recordar citas próximas y está totalmente sincronizada con Firebase para autenticación y almacenamiento de datos en la nube.',
        shortDescription:
          'App Android para gestión de citas médicas con historial, calificaciones y recordatorios automáticos.',
        image: '../assets/banner-prodent.png',
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
            name: 'Firebase',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
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
          'Registro y gestión de citas médicas',
          'Calendario interactivo con disponibilidad de doctores',
          'Notificaciones push para recordatorios',
          'Historial médico con detalles y documentos adjuntos',
          'Calificación y comentarios para doctores',
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
          'Sistema de autenticación que implementa múltiples factores de autenticación (MFA), Single Sign-On (SSO), y gestión granular de permisos. Desarrollado con Spring Security, incluye protección contra ataques modernos, auditoría completa, y integración con servicios de identidad corporativos.',
        shortDescription:
          'Sistema de autenticación MFA con SSO, auditoría y protección avanzada.',
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
            name: 'MySQL',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-plain-wordmark.svg',
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
            url: 'https://auth-jcvcode.netlify.app',
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
