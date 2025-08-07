// info-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export interface Technology {
  name: string;
  icon: string;
}

export interface ProjectLink {
  type: 'github' | 'demo' | 'documentation' | 'download' | 'video';
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
  image: string;
  technologies: Technology[];
  links: ProjectLink[];
  category: string;
  status: string;
  featured: boolean;
  createdAt: Date;
  highlights?: string[];
  metrics?: ProjectMetrics;
  videoUrl?: string; // Campo simple para video
}

@Component({
  selector: 'app-info-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.css'],
})
export class InfoCardComponent {
  @Input() project!: Project;

  @Output() linkClicked = new EventEmitter<ProjectLink>();
  @Output() techClicked = new EventEmitter<Technology>();

  constructor(private sanitizer: DomSanitizer) {}

  hasProjectVideo(): boolean {
    return !!this.project.videoUrl;
  }

  hasVideoInLinks(): boolean {
    return this.project.links?.some((link) => link.type === 'video') || false;
  }

  getVideoEmbedUrl(url: string): SafeResourceUrl {
    if (!url) return this.sanitizer.bypassSecurityTrustResourceUrl('');

    try {
      let embedUrl = '';

      // YouTube URLs
      if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1].split('&')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
      } else if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1].split('?')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
      }
      // Vimeo URLs
      else if (url.includes('vimeo.com/')) {
        const videoId = url.split('vimeo.com/')[1].split('?')[0];
        embedUrl = `https://player.vimeo.com/video/${videoId}`;
      }
      // URL directa
      else {
        embedUrl = url;
      }

      return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    } catch (error) {
      console.error('Error processing video URL:', error);
      return this.sanitizer.bypassSecurityTrustResourceUrl('');
    }
  }

  openVideo(url: string): void {
    window.open(url, '_blank', 'noopener noreferrer');
  }

  // ======== EVENTOS ========

  onLinkClick(link: ProjectLink): void {
    this.linkClicked.emit(link);
    window.open(link.url, '_blank', 'noopener noreferrer');
  }

  onTechClick(tech: Technology): void {
    this.techClicked.emit(tech);
  }

  // ======== UTILIDADES DE ESTILO ========

  getStatusColor(small: boolean = false): string {
    const baseClasses = small ? 'text-xs' : 'text-sm';

    switch (this.project.status) {
      case 'completed':
        return `bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 ${baseClasses}`;
      case 'in-progress':
        return `bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 ${baseClasses}`;
      case 'maintenance':
        return `bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 ${baseClasses}`;
      case 'archived':
        return `bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 ${baseClasses}`;
      default:
        return `bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400 ${baseClasses}`;
    }
  }

  getCategoryIcon(): string {
    switch (this.project.category) {
      case 'web':
        return 'fas fa-globe';
      case 'mobile':
        return 'fas fa-mobile-alt';
      case 'desktop':
        return 'fas fa-desktop';
      case 'iot':
        return 'fas fa-microchip';
      case 'api':
        return 'fas fa-cogs';
      case 'system':
        return 'fas fa-server';
      default:
        return 'fas fa-code';
    }
  }

  getLinkIcon(type: string): string {
    switch (type) {
      case 'github':
        return 'fab fa-github';
      case 'demo':
        return 'fas fa-external-link-alt';
      case 'documentation':
        return 'fas fa-book';
      case 'download':
        return 'fas fa-download';
      case 'video':
        return 'fab fa-youtube';
      default:
        return 'fas fa-link';
    }
  }

  getLinkButtonClass(link: ProjectLink): string {
    const baseClasses = 'transition-all duration-200';

    switch (link.type) {
      case 'github':
        return `${baseClasses} text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:ring-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600`;
      case 'demo':
        return `${baseClasses} text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600`;
      case 'video':
        return `${baseClasses} text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600`;
      case 'documentation':
        return `${baseClasses} text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-300 dark:bg-emerald-500 dark:hover:bg-emerald-600`;
      case 'download':
        return `${baseClasses} text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 dark:bg-purple-500 dark:hover:bg-purple-600`;
      default:
        return `${baseClasses} text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700`;
    }
  }

  // ======== ERROR HANDLERS ========

  handleImageError(event: any): void {
    // Imagen placeholder SVG
    event.target.src =
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZW4gbm8gZGlzcG9uaWJsZTwvdGV4dD48L3N2Zz4=';
  }

  handleTechIconError(event: any): void {
    // Icono placeholder para tecnologías
    event.target.src =
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjZTVlN2ViIiByeD0iNiIvPgo8cGF0aCBkPSJNMTYgMTBjLTEuNjU3IDAtMyAxLjM0My0zIDNzMS4zNDMgMyAzIDMgMy0xLjM0MyAzLTMtMS4zNDMtMy0zLTN6IiBmaWxsPSIjOWNhM2FmIi8+CjxwYXRoIGQ9Ik0xNiA4Yy0yLjIxIDAtNCAxLjc5LTQgNHMxLjc5IDQgNCA0IDQtMS43OSA0LTQtMS43OS00LTQtNHptMCA2Yy0xLjEgMC0yLS45LTItMnMuOS0yIDItMiAyIC45IDIgMi0uOSAyLTIgMnoiIGZpbGw9IiM2Yjcy4GmIi8+Cjwvc3ZnPgo=';
  }

  // ======== MÉTODOS AUXILIARES ========

  /**
   * Verifica si el proyecto está completado
   */
  isCompleted(): boolean {
    return this.project.status === 'completed';
  }

  /**
   * Obtiene el número total de tecnologías
   */
  getTechCount(): number {
    return this.project.technologies?.length || 0;
  }

  /**
   * Obtiene el número total de enlaces
   */
  getLinkCount(): number {
    return this.project.links?.length || 0;
  }

  /**
   * Verifica si el proyecto tiene métricas disponibles
   */
  hasMetrics(): boolean {
    return !!(
      this.project.metrics &&
      (this.project.metrics.stars ||
        this.project.metrics.forks ||
        this.project.metrics.downloads)
    );
  }

  /**
   * Obtiene el año del proyecto
   */
  getProjectYear(): number {
    return this.project.createdAt.getFullYear();
  }
}
