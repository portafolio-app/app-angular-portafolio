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
        title: 'PROJECTS.ITEMS.1.TITLE',
        description: 'PROJECTS.ITEMS.1.DESC',
        shortDescription: 'PROJECTS.ITEMS.1.SHORT_DESC',
        image: '../assets/banner-ventaas.webp',
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
            label: 'PROJECTS.ITEMS.1.LINKS.BACKEND_REPO',
          },
        ],
        category: 'freelance',
        status: 'completed',
        featured: true,
        createdAt: new Date('2024-03-15'),
        highlights: [
          'PROJECTS.ITEMS.1.HIGHLIGHTS.0',
          'PROJECTS.ITEMS.1.HIGHLIGHTS.1',
          'PROJECTS.ITEMS.1.HIGHLIGHTS.2',
          'PROJECTS.ITEMS.1.HIGHLIGHTS.3',
          'PROJECTS.ITEMS.1.HIGHLIGHTS.4',
          'PROJECTS.ITEMS.1.HIGHLIGHTS.5',
          'PROJECTS.ITEMS.1.HIGHLIGHTS.6',
          'PROJECTS.ITEMS.1.HIGHLIGHTS.7',
          'PROJECTS.ITEMS.1.HIGHLIGHTS.8',
        ],
        metrics: {
          stars: 28,
          forks: 12,
          downloads: 180,
        },
      },
      {
        id: '7',
        title: 'PROJECTS.ITEMS.7.TITLE',
        description: 'PROJECTS.ITEMS.7.DESC',
        shortDescription: 'PROJECTS.ITEMS.7.SHORT_DESC',
        image: '../assets/ubicate-v4.webp',
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
            label: 'PROJECTS.ITEMS.7.LINKS.VIEW_DEMO',
          },
        ],
        category: 'freelance',
        status: 'completed',
        featured: true,
        createdAt: new Date('2024-09-10'),
        highlights: [
          'PROJECTS.ITEMS.7.HIGHLIGHTS.0',
          'PROJECTS.ITEMS.7.HIGHLIGHTS.1',
          'PROJECTS.ITEMS.7.HIGHLIGHTS.2',
          'PROJECTS.ITEMS.7.HIGHLIGHTS.3',
          'PROJECTS.ITEMS.7.HIGHLIGHTS.4',
          'PROJECTS.ITEMS.7.HIGHLIGHTS.5',
          'PROJECTS.ITEMS.7.HIGHLIGHTS.6'
        ],
        challenges: [
          'PROJECTS.ITEMS.7.CHALLENGES.0',
          'PROJECTS.ITEMS.7.CHALLENGES.1',
          'PROJECTS.ITEMS.7.CHALLENGES.2',
        ],
        metrics: {
          stars: 30,
          forks: 10,
          downloads: 500,
        },
      },
      {
        id: '8',
        title: 'PROJECTS.ITEMS.8.TITLE',
        description: 'PROJECTS.ITEMS.8.DESC',
        shortDescription: 'PROJECTS.ITEMS.8.SHORT_DESC',
        image: '../assets/polule-ice.webp',
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
            label: 'PROJECTS.ITEMS.8.LINKS.VIEW_DEMO',
          },
        ],
        category: 'freelance',
        status: 'completed',
        featured: true,
        createdAt: new Date('2025-01-17'),
        highlights: [
          'PROJECTS.ITEMS.8.HIGHLIGHTS.0',
          'PROJECTS.ITEMS.8.HIGHLIGHTS.1',
          'PROJECTS.ITEMS.8.HIGHLIGHTS.2',
          'PROJECTS.ITEMS.8.HIGHLIGHTS.3',
          'PROJECTS.ITEMS.8.HIGHLIGHTS.4',
          'PROJECTS.ITEMS.8.HIGHLIGHTS.5',
          'PROJECTS.ITEMS.8.HIGHLIGHTS.6',
          'PROJECTS.ITEMS.8.HIGHLIGHTS.7',
          'PROJECTS.ITEMS.8.HIGHLIGHTS.8',
        ],
        challenges: [
          'PROJECTS.ITEMS.8.CHALLENGES.0',
          'PROJECTS.ITEMS.8.CHALLENGES.1',
          'PROJECTS.ITEMS.8.CHALLENGES.2',
        ],
        metrics: {
          stars: 20,
          forks: 8,
          downloads: 120,
        },
      },
      {
        id: '2',
        title: 'PROJECTS.ITEMS.2.TITLE',
        description: 'PROJECTS.ITEMS.2.DESC',
        shortDescription: 'PROJECTS.ITEMS.2.SHORT_DESC',
        image: '../assets/gestor-deudas.webp',
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
            label: 'PROJECTS.ITEMS.2.LINKS.VIEW_CODE',
          },
          {
            type: 'demo',
            url: 'https://jcv-code.netlify.app',
            label: 'PROJECTS.ITEMS.2.LINKS.LIVE_DEMO',
          },
        ],
        category: 'web',
        status: 'completed',
        featured: true,
        createdAt: new Date('2024-07-29'),
        highlights: [
          'PROJECTS.ITEMS.2.HIGHLIGHTS.0',
          'PROJECTS.ITEMS.2.HIGHLIGHTS.1',
          'PROJECTS.ITEMS.2.HIGHLIGHTS.2',
          'PROJECTS.ITEMS.2.HIGHLIGHTS.3',
          'PROJECTS.ITEMS.2.HIGHLIGHTS.4',
          'PROJECTS.ITEMS.2.HIGHLIGHTS.5'
        ],
        metrics: {
          stars: 15,
          forks: 6,
          downloads: 150,
        },
      },

      {
        id: '3',
        title: 'PROJECTS.ITEMS.3.TITLE',
        description: 'PROJECTS.ITEMS.3.DESC',
        shortDescription: 'PROJECTS.ITEMS.3.SHORT_DESC',
        image: '../assets/Ubicate.webp',
        technologies: [
          {
            name: 'Android',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg',
          },
          {
            name: 'Java',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
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
            name: 'GPS',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg',
          },
        ],
        links: [
          {
            type: 'github',
            url: 'https://github.com/ubicate-app/app-ubicate-android.git',
            label: 'PROJECTS.ITEMS.3.LINKS.SOURCE_CODE',
          },
          {
            type: 'video',
            url: 'https://www.youtube.com/watch?v=32kQkyNtmbU',
            label: 'PROJECTS.ITEMS.3.LINKS.FUNC_DEMO',
            platform: 'youtube',
          },
        ],
        category: 'mobile',
        status: 'completed',
        featured: true,
        createdAt: new Date('2024-01-20'),
        highlights: [
          'PROJECTS.ITEMS.3.HIGHLIGHTS.0',
          'PROJECTS.ITEMS.3.HIGHLIGHTS.1',
          'PROJECTS.ITEMS.3.HIGHLIGHTS.2',
          'PROJECTS.ITEMS.3.HIGHLIGHTS.3',
          'PROJECTS.ITEMS.3.HIGHLIGHTS.4',
          'PROJECTS.ITEMS.3.HIGHLIGHTS.5',
          'PROJECTS.ITEMS.3.HIGHLIGHTS.6',
          'PROJECTS.ITEMS.3.HIGHLIGHTS.7',
          'PROJECTS.ITEMS.3.HIGHLIGHTS.8',
        ],
        challenges: [
          'PROJECTS.ITEMS.3.CHALLENGES.0',
          'PROJECTS.ITEMS.3.CHALLENGES.1',
          'PROJECTS.ITEMS.3.CHALLENGES.2',
          'PROJECTS.ITEMS.3.CHALLENGES.3',
        ],
        metrics: {
          downloads: 750,
          stars: 22,
          forks: 8,
        },
      },
      {
        id: '4',
        title: 'PROJECTS.ITEMS.4.TITLE',
        description: 'PROJECTS.ITEMS.4.DESC',
        shortDescription: 'PROJECTS.ITEMS.4.SHORT_DESC',
        image: '../assets/banner-prodent.webp',
        technologies: [
          {
            name: 'Android',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg',
          },
          {
            name: 'Java',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
          },
          {
            name: 'Firebase',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
          },
          {
            name: 'Material Design',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg',
          },
        ],
        links: [
          {
            type: 'github',
            url: 'https://github.com/App-GigaShop/app-ProDent.git',
            label: 'PROJECTS.ITEMS.4.LINKS.MAIN_REPO',
          },
        ],
        category: 'mobile',
        status: 'completed',
        featured: false,
        createdAt: new Date('2023-11-15'),
        highlights: [
          'PROJECTS.ITEMS.4.HIGHLIGHTS.0',
          'PROJECTS.ITEMS.4.HIGHLIGHTS.1',
          'PROJECTS.ITEMS.4.HIGHLIGHTS.2',
          'PROJECTS.ITEMS.4.HIGHLIGHTS.3',
          'PROJECTS.ITEMS.4.HIGHLIGHTS.4',
          'PROJECTS.ITEMS.4.HIGHLIGHTS.5',
        ],
        metrics: {
          downloads: 300,
          stars: 18,
          forks: 5,
        },
      },
      {
        id: '5',
        title: 'PROJECTS.ITEMS.5.TITLE',
        description: 'PROJECTS.ITEMS.5.DESC',
        shortDescription: 'PROJECTS.ITEMS.5.SHORT_DESC',
        image: '../assets/jwt-autenticator.webp',
        technologies: [
          {
            name: 'Spring Security',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg',
          },
          {
            name: 'Java',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
          },
          {
            name: 'JWT',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg',
          },
          {
            name: 'Angular',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
          },
        ],
        links: [
          {
            type: 'github',
            url: '#',
            label: 'PROJECTS.ITEMS.5.LINKS.BACKEND_SEC',
          },
          {
            type: 'github',
            url: '#',
            label: 'PROJECTS.ITEMS.5.LINKS.FRONTEND_ANG',
          },
          {
            type: 'demo',
            url: '#',
            label: 'PROJECTS.ITEMS.5.LINKS.SECURE_DEMO',
          },
        ],
        category: 'web',
        status: 'in-progress',
        featured: false,
        createdAt: new Date('2024-11-20'),
        highlights: [
          'PROJECTS.ITEMS.5.HIGHLIGHTS.0',
          'PROJECTS.ITEMS.5.HIGHLIGHTS.1',
          'PROJECTS.ITEMS.5.HIGHLIGHTS.2',
          'PROJECTS.ITEMS.5.HIGHLIGHTS.3',
          'PROJECTS.ITEMS.5.HIGHLIGHTS.4',
          'PROJECTS.ITEMS.5.HIGHLIGHTS.5',
          'PROJECTS.ITEMS.5.HIGHLIGHTS.6',
          'PROJECTS.ITEMS.5.HIGHLIGHTS.7',
        ],
        metrics: {
          stars: 45,
          forks: 15,
          downloads: 1200,
        },
      },
      {
        id: '6',
        title: 'PROJECTS.ITEMS.6.TITLE',
        description: 'PROJECTS.ITEMS.6.DESC',
        shortDescription: 'PROJECTS.ITEMS.6.SHORT_DESC',
        image: '../assets/robot-control.webp',
        technologies: [
          {
            name: 'Arduino',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg',
          },
          {
            name: 'C++',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
          },
          {
            name: 'Android',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg',
          },
          {
            name: 'Jetpack Compose',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg',
          },
        ],
        links: [
          {
            type: 'github',
            url: '#',
            label: 'PROJECTS.ITEMS.6.LINKS.ANDROID_APP',
          },
        ],
        category: 'iot',
        status: 'maintenance',
        featured: false,
        createdAt: new Date('2024-05-12'),
        highlights: [
          'PROJECTS.ITEMS.6.HIGHLIGHTS.0',
          'PROJECTS.ITEMS.6.HIGHLIGHTS.1',
          'PROJECTS.ITEMS.6.HIGHLIGHTS.2',
          'PROJECTS.ITEMS.6.HIGHLIGHTS.3',
          'PROJECTS.ITEMS.6.HIGHLIGHTS.4',
          'PROJECTS.ITEMS.6.HIGHLIGHTS.5',
          'PROJECTS.ITEMS.6.HIGHLIGHTS.6',
          'PROJECTS.ITEMS.6.HIGHLIGHTS.7',
        ],
        metrics: {
          stars: 52,
          forks: 20,
          downloads: 850,
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
