// CREAR: src/app/shared/components/info-card/info-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ProjectVideo {
  url: string;
  title?: string;
  description?: string;
  aspectRatio?: string; // Por ejemplo: "56.25%" para 16:9
  platform?: 'youtube' | 'vimeo' | 'direct';
}
export interface ProjectInfo {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  problemStatement: string;
  solution: string;
  technologies: Technology[];
  features: string[];
  challenges: Challenge[];
  metrics?: ProjectMetrics;
  timeline: TimelineItem[];
  links: ProjectLink[];
  images: ProjectImage[];
  category: ProjectCategory;
  status: ProjectStatus;
  teamSize?: number;
  role: string;
  duration: string;
  clientType?: string;
  video?: ProjectVideo;
}

export interface Technology {
  name: string;
  icon: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'mobile' | 'iot';
  proficiency?: number;
  description?: string;
}

export interface Challenge {
  title: string;
  description: string;
  solution: string;
  impact?: string;
}

export interface ProjectMetrics {
  performance?: string;
  users?: string;
  uptime?: string;
  codeQuality?: string;
  coverage?: string;
}

export interface TimelineItem {
  phase: string;
  duration: string;
  description: string;
  status: 'completed' | 'in-progress' | 'planned';
}

export interface ProjectLink {
  type: 'github' | 'demo' | 'documentation' | 'case-study' | 'download';
  url: string;
  label: string;
  primary?: boolean;
}

export interface ProjectImage {
  url: string;
  alt: string;
  caption?: string;
  type: 'hero' | 'screenshot' | 'diagram' | 'mobile';
}

export enum ProjectCategory {
  WEB = 'web',
  MOBILE = 'mobile',
  DESKTOP = 'desktop',
  IOT = 'iot',
  API = 'api',
  SYSTEM = 'system'
}

export enum ProjectStatus {
  COMPLETED = 'completed',
  IN_PROGRESS = 'in-progress',
  MAINTENANCE = 'maintenance',
  ARCHIVED = 'archived'
}

@Component({
  selector: 'app-info-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-card.component.html',
  styleUrl: './info-card.component.css'
})
export class InfoCardComponent {
  @Input() project!: ProjectInfo;
  @Input() showFullDetails: boolean = false;
  @Input() compact: boolean = false;

  @Output() linkClicked = new EventEmitter<ProjectLink>();
  @Output() imageClicked = new EventEmitter<ProjectImage>();
  @Output() techClicked = new EventEmitter<Technology>();
  @Output() expandToggled = new EventEmitter<boolean>();

  activeImageIndex: number = 0;
  expandedSections: Set<string> = new Set(['problem-solution', 'technologies']);

  constructor() {}

  // Toggle de secciones expandibles
  toggleSection(section: string): void {
    if (this.expandedSections.has(section)) {
      this.expandedSections.delete(section);
    } else {
      this.expandedSections.add(section);
    }
  }

  isSectionExpanded(section: string): boolean {
    return this.expandedSections.has(section);
  }

  // Gestión de imágenes
  selectImage(index: number): void {
    this.activeImageIndex = index;
  }

  nextImage(): void {
    this.activeImageIndex = (this.activeImageIndex + 1) % this.project.images.length;
  }

  previousImage(): void {
    this.activeImageIndex = this.activeImageIndex === 0
      ? this.project.images.length - 1
      : this.activeImageIndex - 1;
  }

  // Eventos
  onLinkClick(link: ProjectLink): void {
    this.linkClicked.emit(link);
    // Abrir en nueva pestaña
    if (link.url) {
      window.open(link.url, '_blank', 'noopener noreferrer');
    }
  }

  onImageClick(image: ProjectImage): void {
    this.imageClicked.emit(image);
  }

  onTechClick(tech: Technology): void {
    this.techClicked.emit(tech);
  }

  onExpandToggle(): void {
    this.showFullDetails = !this.showFullDetails;
    this.expandToggled.emit(this.showFullDetails);
  }

  // Utilidades
  getStatusColor(): string {
    switch (this.project.status) {
      case ProjectStatus.COMPLETED:
        return 'text-green-600 bg-green-100 border-green-200 dark:text-green-400 dark:bg-green-900/30 dark:border-green-800';
      case ProjectStatus.IN_PROGRESS:
        return 'text-blue-600 bg-blue-100 border-blue-200 dark:text-blue-400 dark:bg-blue-900/30 dark:border-blue-800';
      case ProjectStatus.MAINTENANCE:
        return 'text-yellow-600 bg-yellow-100 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/30 dark:border-yellow-800';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200 dark:text-gray-400 dark:bg-gray-900/30 dark:border-gray-800';
    }
  }

  getCategoryIcon(): string {
    switch (this.project.category) {
      case ProjectCategory.WEB:
        return 'fas fa-globe';
      case ProjectCategory.MOBILE:
        return 'fas fa-mobile-alt';
      case ProjectCategory.DESKTOP:
        return 'fas fa-desktop';
      case ProjectCategory.IOT:
        return 'fas fa-microchip';
      case ProjectCategory.API:
        return 'fas fa-cogs';
      default:
        return 'fas fa-code';
    }
  }

  getTechnologiesByCategory(category: string): Technology[] {
    return this.project.technologies.filter(tech => tech.category === category);
  }

  getTimelineProgress(): number {
    const completed = this.project.timeline.filter(item => item.status === 'completed').length;
    return (completed / this.project.timeline.length) * 100;
  }

  getLinkIcon(type: string): string {
    switch (type) {
      case 'github':
        return 'fab fa-github';
      case 'demo':
        return 'fas fa-external-link-alt';
      case 'documentation':
        return 'fas fa-book';
      case 'case-study':
        return 'fas fa-file-alt';
      case 'download':
        return 'fas fa-download';
      default:
        return 'fas fa-link';
    }
  }

  getLinkButtonClass(link: ProjectLink): string {
    const baseClasses = 'inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg focus:ring-4 focus:outline-none transition-all duration-300 hover:scale-105';

    if (link.primary) {
      return `${baseClasses} text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:ring-emerald-300 dark:focus:ring-emerald-800`;
    }

    switch (link.type) {
      case 'github':
        return `${baseClasses} text-white bg-gray-800 hover:bg-gray-900 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800`;
      case 'demo':
        return `${baseClasses} text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`;
      default:
        return `${baseClasses} text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700`;
    }
  }

  // Error handlers
  handleImageError(event: any): void {
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZW48L3RleHQ+PC9zdmc+';
  }

  handleTechIconError(event: any): void {
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjZTVlN2ViIiByeD0iNCIvPgo8cGF0aCBkPSJNMTAgNmMtMS4xIDAtMiAuOS0yIDJzLjkgMiAyIDIgMi0uOSAyLTItLjktMi0yLTJ6IiBmaWxsPSIjOWNhM2FmIi8+Cjwvc3ZnPgo=';
  }

  // TrackBy functions para optimización
  trackByTech(index: number, tech: Technology): string {
    return tech.name;
  }

  trackByChallenge(index: number, challenge: Challenge): string {
    return challenge.title;
  }

  trackByTimeline(index: number, item: TimelineItem): string {
    return item.phase;
  }

  trackByLink(index: number, link: ProjectLink): string {
    return link.type + link.url;
  }

  trackByImage(index: number, image: ProjectImage): string {
    return image.url;
  }

  getVideoEmbedUrl(url: string): string {
    if (!url) return '';

    try {
      // YouTube
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = '';
        if (url.includes('youtube.com/watch?v=')) {
          videoId = url.split('v=')[1]?.split('&')[0];
        } else if (url.includes('youtu.be/')) {
          videoId = url.split('youtu.be/')[1]?.split('?')[0];
        }
        return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
      }

      // Vimeo
      if (url.includes('vimeo.com')) {
        const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
        return `https://player.vimeo.com/video/${videoId}`;
      }

      // URL directa
      return url;
    } catch (error) {
      console.error('Error processing video URL:', error);
      return '';
    }
  }

  // Método para determinar si un proyecto tiene video
  hasVideo(): boolean {
    return !!(this.project.video && this.project.video.url);
  }



}
