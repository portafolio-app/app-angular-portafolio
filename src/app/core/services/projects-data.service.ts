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
  techFocus?: string; // Nuevo: Para resaltar el enfoque (p.ej. "Backend Architecture")
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
    const compugamerMockupSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 720" role="img" aria-label="CompuGamer redesign mockup">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#f7f9ff" />
            <stop offset="100%" stop-color="#dbe7ff" />
          </linearGradient>
          <linearGradient id="hero" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#1f6bff" />
            <stop offset="100%" stop-color="#0f44bf" />
          </linearGradient>
          <linearGradient id="cta" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#ff9a1f" />
            <stop offset="100%" stop-color="#ff612e" />
          </linearGradient>
        </defs>
        <rect width="1200" height="720" fill="url(#bg)" />
        <circle cx="1080" cy="140" r="180" fill="#d8e3ff" opacity="0.55" />
        <circle cx="240" cy="580" r="210" fill="#c6d6ff" opacity="0.4" />
        <text x="86" y="150" fill="#3668ff" font-size="34" font-family="Arial, Helvetica, sans-serif">PORTFOLIO CASE</text>
        <text x="86" y="240" fill="#0f1733" font-size="78" font-weight="700" font-family="Arial, Helvetica, sans-serif">CompuGamer</text>
        <text x="86" y="320" fill="#0f1733" font-size="74" font-weight="700" font-family="Arial, Helvetica, sans-serif">E-commerce</text>
        <text x="86" y="400" fill="#4d6cff" font-size="74" font-weight="700" font-family="Arial, Helvetica, sans-serif">Redesign</text>
        <rect x="86" y="438" width="110" height="8" rx="4" fill="#4d6cff" />
        <text x="86" y="505" fill="#4a556f" font-size="30" font-family="Arial, Helvetica, sans-serif">Angular, Spring Boot and PostgreSQL proposal</text>
        <rect x="86" y="560" width="246" height="68" rx="34" fill="url(#cta)" />
        <text x="129" y="604" fill="#ffffff" font-size="29" font-weight="700" font-family="Arial, Helvetica, sans-serif">View project</text>
        <g transform="translate(560 42)">
          <rect x="0" y="0" width="578" height="636" rx="28" fill="#ffffff" opacity="0.96" />
          <rect x="0" y="0" width="578" height="56" rx="28" fill="#ffffff" />
          <circle cx="38" cy="29" r="7" fill="#ffb2b2" />
          <circle cx="62" cy="29" r="7" fill="#ffd27f" />
          <circle cx="86" cy="29" r="7" fill="#91e8aa" />
          <rect x="28" y="74" width="522" height="286" rx="28" fill="url(#hero)" />
          <text x="58" y="120" fill="#87a8ff" font-size="16" letter-spacing="2" font-family="Arial, Helvetica, sans-serif">TECHNOLOGY  .  PERFORMANCE  .  TRUST</text>
          <text x="58" y="178" fill="#ffffff" font-size="54" font-weight="700" font-family="Arial, Helvetica, sans-serif">Boost your play.</text>
          <text x="58" y="238" fill="#ffffff" font-size="54" font-weight="700" font-family="Arial, Helvetica, sans-serif">Elevate your setup.</text>
          <rect x="58" y="272" width="154" height="44" rx="22" fill="#ff8d1a" />
          <rect x="224" y="272" width="154" height="44" rx="22" fill="#ffffff" opacity="0.95" />
          <text x="91" y="300" fill="#182033" font-size="18" font-weight="700" font-family="Arial, Helvetica, sans-serif">Products</text>
          <text x="257" y="300" fill="#2754d6" font-size="18" font-weight="700" font-family="Arial, Helvetica, sans-serif">Offers</text>
          <rect x="420" y="92" width="110" height="226" rx="18" fill="#0e1224" opacity="0.88" />
          <rect x="441" y="118" width="68" height="170" rx="10" fill="#162548" />
          <circle cx="475" cy="152" r="18" fill="#2b8fff" />
          <circle cx="475" cy="216" r="18" fill="#2b8fff" />
          <circle cx="475" cy="280" r="18" fill="#2b8fff" />
          <rect x="28" y="388" width="160" height="108" rx="22" fill="#ffffff" stroke="#dfe7ff" />
          <rect x="208" y="388" width="160" height="108" rx="22" fill="#ffffff" stroke="#dfe7ff" />
          <rect x="388" y="388" width="160" height="108" rx="22" fill="#ffffff" stroke="#dfe7ff" />
          <text x="28" y="540" fill="#1c2640" font-size="34" font-weight="700" font-family="Arial, Helvetica, sans-serif">Main categories</text>
          <rect x="28" y="562" width="72" height="44" rx="14" fill="#f4f7ff" stroke="#dfe7ff" />
          <rect x="114" y="562" width="72" height="44" rx="14" fill="#f4f7ff" stroke="#dfe7ff" />
          <rect x="200" y="562" width="72" height="44" rx="14" fill="#f4f7ff" stroke="#dfe7ff" />
          <rect x="286" y="562" width="72" height="44" rx="14" fill="#f4f7ff" stroke="#dfe7ff" />
          <rect x="372" y="562" width="72" height="44" rx="14" fill="#f4f7ff" stroke="#dfe7ff" />
          <rect x="458" y="562" width="72" height="44" rx="14" fill="#f4f7ff" stroke="#dfe7ff" />
        </g>
      </svg>
    `.trim();
    const compugamerMockup = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(compugamerMockupSvg)}`;

    const projects: Project[] = [
      {
        id: 'controlate',
        title: 'PROJECTS.ITEMS.controlate.TITLE',
        description: 'PROJECTS.ITEMS.controlate.DESC',
        shortDescription: 'PROJECTS.ITEMS.controlate.SHORT_DESC',
        image: '../assets/controlate-mockup.png',
        technologies: [
          { name: 'Angular 20', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg' },
          { name: '.NET Core 9', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg' },
          { name: 'Gemini AI', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg' },
          { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
          { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
          { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
          { name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
          { name: 'Chart.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chartjs/chartjs-original.svg' },
        ],
        links: [
          {
            type: 'demo',
            url: 'https://controlate.codlyp.website',
            label: 'PROJECTS.BUTTONS.WEB',
          },
          {
            type: 'video',
            url: 'https://www.youtube.com/watch?v=nDltqDPXCXQ',
            label: 'PROJECTS.ITEMS.controlate.LINKS.VIEW_DEMO',
          },
        ],
        category: 'web',
        status: 'completed',
        featured: true,
        createdAt: new Date('2026-04-15'),
        videoUrl: 'https://www.youtube.com/watch?v=nDltqDPXCXQ',
        techFocus: 'AI & Task Management',
        highlights: [
          'PROJECTS.ITEMS.controlate.HIGHLIGHTS.0',
          'PROJECTS.ITEMS.controlate.HIGHLIGHTS.1',
          'PROJECTS.ITEMS.controlate.HIGHLIGHTS.2',
          'PROJECTS.ITEMS.controlate.HIGHLIGHTS.3',
          'PROJECTS.ITEMS.controlate.HIGHLIGHTS.4',
          'PROJECTS.ITEMS.controlate.HIGHLIGHTS.5',
          'PROJECTS.ITEMS.controlate.HIGHLIGHTS.6',
        ],
        challenges: [
          'PROJECTS.ITEMS.controlate.CHALLENGES.0',
          'PROJECTS.ITEMS.controlate.CHALLENGES.1',
          'PROJECTS.ITEMS.controlate.CHALLENGES.2',
        ],
      },
      {
        id: 'lumina',
        title: 'PROJECTS.ITEMS.lumina.TITLE',
        description: 'PROJECTS.ITEMS.lumina.DESC',
        shortDescription: 'PROJECTS.ITEMS.lumina.SHORT_DESC',
        image: '../assets/lumina-mockup.png',
        technologies: [
          { name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
          { name: 'Dart', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg' },
          { name: 'SQLite', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg' },
          { name: 'Provider', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
          { name: 'Clean Architecture', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg' },
        ],
        links: [
          {
            type: 'video',
            url: 'https://www.youtube.com/watch?v=VsraYqsseXM',
            label: 'PROJECTS.ITEMS.lumina.LINKS.VIEW_DEMO',
            platform: 'youtube',
          },
          {
            type: 'github',
            url: 'https://github.com/VCL-tt/lumina-pill-tracker',
            label: 'PROJECTS.ITEMS.lumina.LINKS.SOURCE_CODE',
          },
        ],
        category: 'mobile',
        status: 'completed',
        featured: true,
        createdAt: new Date('2024-04-16'), // Set to today
        videoUrl: 'https://www.youtube.com/watch?v=VsraYqsseXM',
        techFocus: 'Clean Architecture & Native Integration',
        highlights: [
          'PROJECTS.ITEMS.lumina.HIGHLIGHTS.0',
          'PROJECTS.ITEMS.lumina.HIGHLIGHTS.1',
          'PROJECTS.ITEMS.lumina.HIGHLIGHTS.2',
          'PROJECTS.ITEMS.lumina.HIGHLIGHTS.3',
          'PROJECTS.ITEMS.lumina.HIGHLIGHTS.4',
          'PROJECTS.ITEMS.lumina.HIGHLIGHTS.5',
        ],
        challenges: [
          'PROJECTS.ITEMS.lumina.CHALLENGES.0',
          'PROJECTS.ITEMS.lumina.CHALLENGES.1',
          'PROJECTS.ITEMS.lumina.CHALLENGES.2',
        ],
      },

      {
        id: 'codlix',
        title: 'PROJECTS.ITEMS.codlix.TITLE',
        description: 'PROJECTS.ITEMS.codlix.DESC',
        shortDescription: 'PROJECTS.ITEMS.codlix.SHORT_DESC',
        image: '../assets/resto-dev.png',
        technologies: [
          { name: 'Java 21', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
          { name: 'Spring Boot', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg' },
          { name: 'Angular', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg' },
          { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
          { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
          { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
          { name: 'Kafka', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachekafka/apachekafka-original.svg' },
          { name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
        ],
        links: [
          {
            type: 'demo',
            url: 'https://app.codlyp.website',
            label: 'PROJECTS.ITEMS.codlix.LINKS.LIVE_DEMO',
          },
          {
            type: 'video',
            url: 'https://www.youtube.com/watch?v=h26117Mdwno',
            label: 'PROJECTS.ITEMS.codlix.LINKS.VIEW_DEMO',
          },
        ],
        category: 'freelance',
        status: 'in-progress',
        featured: true,
        createdAt: new Date('2025-01-01'),
        videoUrl: 'https://www.youtube.com/watch?v=h26117Mdwno',
        techFocus: 'Hexagonal Architecture & SaaS',
        highlights: [
          'PROJECTS.ITEMS.codlix.HIGHLIGHTS.0',
          'PROJECTS.ITEMS.codlix.HIGHLIGHTS.1',
          'PROJECTS.ITEMS.codlix.HIGHLIGHTS.2',
          'PROJECTS.ITEMS.codlix.HIGHLIGHTS.3',
          'PROJECTS.ITEMS.codlix.HIGHLIGHTS.4',
          'PROJECTS.ITEMS.codlix.HIGHLIGHTS.5',
          'PROJECTS.ITEMS.codlix.HIGHLIGHTS.6',
        ],
        challenges: [
          'PROJECTS.ITEMS.codlix.CHALLENGES.0',
          'PROJECTS.ITEMS.codlix.CHALLENGES.1',
          'PROJECTS.ITEMS.codlix.CHALLENGES.2',
        ],
        metrics: {
          stars: 35,
          forks: 12,
          downloads: 200,
        },
      },
      {
        id: 'compugamer',
        title: 'PROJECTS.ITEMS.compugamer.TITLE',
        description: 'PROJECTS.ITEMS.compugamer.DESC',
        shortDescription: 'PROJECTS.ITEMS.compugamer.SHORT_DESC',
        image: compugamerMockup,
        technologies: [
          { name: 'Angular', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg' },
          { name: 'Spring Boot', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg' },
          { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
          { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
          { name: 'Spring Security', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg' },
          { name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
        ],
        links: [
          {
            type: 'demo',
            url: 'https://compugamertrujillo.catalogst.com/#/place-detail-page',
            label: 'PROJECTS.ITEMS.compugamer.LINKS.CURRENT_STORE',
          },
        ],
        category: 'freelance',
        status: 'prototype',
        featured: true,
        createdAt: new Date('2026-04-27'),
        techFocus: 'E-commerce Redesign & UX',
        highlights: [
          'PROJECTS.ITEMS.compugamer.HIGHLIGHTS.0',
          'PROJECTS.ITEMS.compugamer.HIGHLIGHTS.1',
          'PROJECTS.ITEMS.compugamer.HIGHLIGHTS.2',
          'PROJECTS.ITEMS.compugamer.HIGHLIGHTS.3',
          'PROJECTS.ITEMS.compugamer.HIGHLIGHTS.4',
          'PROJECTS.ITEMS.compugamer.HIGHLIGHTS.5',
        ],
        challenges: [
          'PROJECTS.ITEMS.compugamer.CHALLENGES.0',
          'PROJECTS.ITEMS.compugamer.CHALLENGES.1',
          'PROJECTS.ITEMS.compugamer.CHALLENGES.2',
        ],
      },
      {
        id: '9',
        title: 'PROJECTS.ITEMS.9.TITLE',
        description: 'PROJECTS.ITEMS.9.DESC',
        shortDescription: 'PROJECTS.ITEMS.9.SHORT_DESC',
        image: '../assets/msg-service-banner.png',
        technologies: [
          { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
          { name: 'Spring Boot', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg' },
          { name: 'RabbitMQ', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rabbitmq/rabbitmq-original.svg' },
          { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
          { name: 'Maven', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/maven/maven-original.svg' },
        ],
        links: [
          {
            type: 'github',
            url: 'https://github.com/VCL-tt/msg-messenger-service.git',
            label: 'PROJECTS.ITEMS.9.LINKS.REPO',
          },
        ],
        category: 'web',
        status: 'completed',
        featured: true,
        createdAt: new Date('2024-11-25'),
        techFocus: 'Backend Architecture & EDA',
        highlights: [
          'PROJECTS.ITEMS.9.HIGHLIGHTS.0',
          'PROJECTS.ITEMS.9.HIGHLIGHTS.1',
          'PROJECTS.ITEMS.9.HIGHLIGHTS.2',
          'PROJECTS.ITEMS.9.HIGHLIGHTS.3',
          'PROJECTS.ITEMS.9.HIGHLIGHTS.4',
          'PROJECTS.ITEMS.9.HIGHLIGHTS.5',
          'PROJECTS.ITEMS.9.HIGHLIGHTS.6',
        ],
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
        techFocus: 'Enterprise Logic & Security',
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
        techFocus: 'Scalable Fullstack System',
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
        techFocus: 'E-commerce Engine Logic',
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
            url: 'https://github.com/App-Android-Prodent/App-Prodent.git',
            label: 'PROJECTS.ITEMS.4.LINKS.MAIN_REPO',
          },
        ],
        category: 'mobile',
        status: 'completed',
        featured: true,
        createdAt: new Date('2023-11-15'),
        techFocus: 'Mobile Healthcare Logic',
        highlights: [
          'PROJECTS.ITEMS.4.HIGHLIGHTS.0',
          'PROJECTS.ITEMS.4.HIGHLIGHTS.1',
          'PROJECTS.ITEMS.4.HIGHLIGHTS.2',
          'PROJECTS.ITEMS.4.HIGHLIGHTS.3',
          'PROJECTS.ITEMS.4.HIGHLIGHTS.4',
          'PROJECTS.ITEMS.4.HIGHLIGHTS.5',
          'PROJECTS.ITEMS.4.HIGHLIGHTS.6',
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
        ],
        links: [
          {
            type: 'github',
            url: 'https://github.com/App-Authenticator/App-JWT-Auth-Backend',
            label: 'PROJECTS.ITEMS.5.LINKS.BACKEND_SEC',
          },
          {
            type: 'github',
            url: 'https://github.com/App-Authenticator/App-JWT-Auth-FrontEnd',
            label: 'PROJECTS.ITEMS.5.LINKS.FRONTEND_ANG',
          },
        ],
        category: 'web',
        status: 'completed',
        featured: true,
        createdAt: new Date('2024-11-20'),
        techFocus: 'Enterprise Security & JWT',
        highlights: [
          'PROJECTS.ITEMS.5.HIGHLIGHTS.0',
          'PROJECTS.ITEMS.5.HIGHLIGHTS.1',
          'PROJECTS.ITEMS.5.HIGHLIGHTS.2',
          'PROJECTS.ITEMS.5.HIGHLIGHTS.3',
          'PROJECTS.ITEMS.5.HIGHLIGHTS.4',
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
        ],
        links: [
          {
            type: 'github',
            url: 'https://github.com/app-carroControl/app-control-IoT.git',
            label: 'PROJECTS.ITEMS.6.LINKS.ANDROID_APP',
          },
        ],
        category: 'iot',
        status: 'completed',
        featured: true,
        createdAt: new Date('2024-05-12'),
        techFocus: 'IoT Systems & Hardware Interface',
        highlights: [
          'PROJECTS.ITEMS.6.HIGHLIGHTS.0',
          'PROJECTS.ITEMS.6.HIGHLIGHTS.1',
          'PROJECTS.ITEMS.6.HIGHLIGHTS.2',
          'PROJECTS.ITEMS.6.HIGHLIGHTS.3',
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
