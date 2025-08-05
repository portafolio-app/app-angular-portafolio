import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectionStrategy, Inject, PLATFORM_ID, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Router } from '@angular/router'; // AGREGADO
import { Subject } from 'rxjs';
import { takeUntil, catchError, of } from 'rxjs';

import {
  Project,
  ProjectsDataService,
} from '../../../core/services/projects-data.service';
import { ProjectFilterComponent } from '../project-filter/project-filter.component';

@Component({
  selector: 'app-card-proyectos',
  standalone: true,
  imports: [CommonModule, ProjectFilterComponent], // REMOVIDO InfoCardComponent
  templateUrl: './card-proyectos.component.html',
  styleUrls: ['./card-proyectos.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardProyectosComponent implements OnInit, OnDestroy {
  @ViewChild(ProjectFilterComponent) filterComponent!: ProjectFilterComponent;

  // Inputs
  @Input() showFeaturedOnly: boolean = true;
  @Input() sectionTitle: string = 'Mis Proyectos';
  @Input() sectionDescription: string = 'Una colección de proyectos que demuestran mis habilidades y experiencia en desarrollo de software';
  @Input() showFilters: boolean = true;
  @Input() projectsPerPage: number = 10;

  // Outputs
  @Output() projectClicked = new EventEmitter<Project>();
  @Output() linkClicked = new EventEmitter<{project: Project, link: any}>();

  // State
  allProjects: Project[] = [];
  filteredProjects: Project[] = [];
  displayProjects: Project[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  // Filter and pagination state
  hasActiveSearch: boolean = false;
  currentPage: number = 1;
  showingAll: boolean = false;

  // Private
  private readonly destroy$ = new Subject<void>();
  private isBrowser: boolean;

  constructor(
    private projectsService: ProjectsDataService,
    private cdr: ChangeDetectorRef,
    private router: Router, // AGREGADO
    @Inject(PLATFORM_ID) platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Computed properties
  get totalProjects(): number {
    return this.allProjects.length;
  }

  get featuredCount(): number {
    const projects = this.hasActiveSearch ? this.filteredProjects : this.allProjects;
    return projects.filter(p => p.featured).length;
  }

  get totalTechnologies(): number {
    const projects = this.hasActiveSearch ? this.filteredProjects : this.allProjects;
    const techSet = new Set<string>();
    projects.forEach((project: Project) => {
      project.technologies.forEach((tech: any) => techSet.add(tech.name));
    });
    return techSet.size;
  }

  get availableProjects(): Project[] {
    const baseProjects = this.hasActiveSearch ? this.filteredProjects : this.allProjects;

    if (this.showFeaturedOnly && !this.hasActiveSearch) {
      return baseProjects.filter(p => p.featured);
    }

    return baseProjects;
  }

  get hasMoreProjects(): boolean {
    return this.availableProjects.length > this.displayProjects.length;
  }

  get remainingProjectsCount(): number {
    return Math.max(0, this.availableProjects.length - this.displayProjects.length);
  }

  // Data loading
  loadProjects(): void {
    this.isLoading = true;
    this.error = null;

    this.projectsService.getProjects().pipe(
      catchError(error => {
        console.error('Error loading projects:', error);
        this.error = this.getErrorMessage(error);
        this.isLoading = false;
        this.cdr.markForCheck();
        return of([]);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (projects: Project[]) => {
        this.allProjects = projects;
        this.filteredProjects = projects;
        this.currentPage = 1;
        this.showingAll = false;
        this.updateDisplayProjects();
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  retryLoadProjects(): void {
    this.loadProjects();
  }

  // Filter methods
  onFilteredProjectsChanged(filtered: Project[]): void {
    this.filteredProjects = filtered;
    this.hasActiveSearch = filtered.length !== this.allProjects.length;
    this.currentPage = 1;
    this.showingAll = false;
    this.updateDisplayProjects();
    this.cdr.markForCheck();
  }

  onFiltersChanged(criteria: any): void {
    const hasSearch = !!(criteria?.searchQuery?.trim());
    if (hasSearch !== this.hasActiveSearch) {
      this.currentPage = 1;
      this.showingAll = false;
    }
  }

  clearAllFilters(): void {
    this.hasActiveSearch = false;
    this.filteredProjects = this.allProjects;
    this.currentPage = 1;
    this.showingAll = false;
    this.updateDisplayProjects();

    if (this.filterComponent) {
      this.filterComponent.resetFilters();
    }

    this.cdr.markForCheck();
  }

  // Pagination methods
  loadMoreProjects(): void {
    this.showingAll = true;
    this.updateDisplayProjects();
    this.cdr.markForCheck();
  }

  showLessProjects(): void {
    this.showingAll = false;
    this.currentPage = 1;
    this.updateDisplayProjects();
    this.cdr.markForCheck();
  }

  // View controls
  showAllProjects(): void {
    this.showFeaturedOnly = false;
    this.currentPage = 1;
    this.showingAll = false;
    this.updateDisplayProjects();
    this.cdr.markForCheck();
  }

  showOnlyFeatured(): void {
    this.showFeaturedOnly = true;
    this.currentPage = 1;
    this.showingAll = false;
    this.updateDisplayProjects();
    this.cdr.markForCheck();
  }

  private updateDisplayProjects(): void {
    const available = this.availableProjects;

    if (this.showingAll) {
      this.displayProjects = available;
    } else {
      this.displayProjects = available.slice(0, this.projectsPerPage);
    }
  }

  // Helper methods
  getSectionTitle(): string {
    if (this.hasActiveSearch) {
      return `Resultados de búsqueda`;
    }
    return this.showFeaturedOnly ? 'Proyectos Destacados' : 'Todos los Proyectos';
  }

  getPaginationInfo(): string {
    if (this.showingAll) {
      return `Mostrando todos los ${this.availableProjects.length} proyectos`;
    }
    const showing = Math.min(this.projectsPerPage, this.availableProjects.length);
    return `Mostrando ${showing} de ${this.availableProjects.length} proyectos`;
  }

  getFilterSummary(): string {
    if (!this.hasActiveSearch) {
      return '';
    }

    const total = this.allProjects.length;
    const filtered = this.filteredProjects.length;
    const percentage = total > 0 ? Math.round((filtered / total) * 100) : 0;

    return `Mostrando ${filtered} de ${total} proyectos (${percentage}%)`;
  }

  // Project interactions - MODIFICADO PARA NAVEGACIÓN
  onProjectClick(project: Project): void {
    this.projectClicked.emit(project);
    this.router.navigate(['/project', project.id]);
  }

  onLinkClick(project: Project, link: any, event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    this.linkClicked.emit({ project, link });
    this.handleLinkClick(link);
  }

  onViewDetails(project: Project, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/project', project.id]);
  }

  // Link handling
  handleLinkClick(link: any): void {
    if (!this.isBrowser) {
      return;
    }

    if (link?.url) {
      try {
        new URL(link.url);
        window.open(link.url, '_blank', 'noopener,noreferrer');
      } catch {
        console.error('Invalid URL:', link.url);
      }
    }
  }

  // Error handling
  private getErrorMessage(error: any): string {
    if (error?.status === 0) {
      return 'Sin conexión a internet. Verifica tu conexión.';
    }
    if (error?.status >= 500) {
      return 'Error del servidor. Intenta más tarde.';
    }
    if (error?.status === 404) {
      return 'No se encontraron proyectos.';
    }
    return 'Error al cargar los proyectos.';
  }

  // Image error handling
  handleImageError(event: any): void {
    if (!this.isBrowser || !event?.target) {
      return;
    }

    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Qcm95ZWN0bzwvdGV4dD48L3N2Zz4=';
  }

  handleTechIconError(event: any): void {
    if (!this.isBrowser || !event?.target) {
      return;
    }

    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjZTVlN2ViIiByeD0iNCIvPgo8cGF0aCBkPSJNMTAgNmMtMS4xIDAtMiAuOS0yIDJzLjkgMiAyIDIgMi0uOSAyLTItLjktMi0yLTJ6IiBmaWxsPSIjOWNhM2FmIi8+Cjwvc3ZnPgo=';
  }

  // Utility methods
  trackByProject(index: number, project: Project): string {
    return project.id;
  }

  getShortButtonText(type: string, originalLabel: string): string {
    switch (type) {
      case 'github':
        return 'Código';
      case 'demo':
        return 'Demo';
      case 'documentation':
        return 'Docs';
      case 'download':
        return 'Descargar';
      case 'website':
        return 'Web';
      case 'repository':
        return 'Repo';
      default:
        if (originalLabel.toLowerCase().includes('repositorio')) {
          return 'Repositorio';
        }
        if (originalLabel.toLowerCase().includes('código')) {
          return 'Código';
        }
        return originalLabel.length > 8 ? originalLabel.substring(0, 8) + '...' : originalLabel;
    }
  }

  getMicroButtonText(type: string): string {
    switch (type) {
      case 'github':
        return 'Código';
      case 'demo':
        return 'Demo';
      case 'documentation':
        return 'Docs';
      case 'download':
        return 'DL';
      case 'website':
        return 'Web';
      case 'repository':
        return 'Repo';
      default:
        return '';
    }
  }

  // Button styling
  getLinkButtonClass(type: string): string {
    const baseClasses = 'font-medium transition-all duration-200';

    switch (type) {
      case 'github':
        return `${baseClasses} text-white bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 dark:from-gray-600 dark:to-gray-700 shadow-md`;
      case 'demo':
        return `${baseClasses} text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 dark:from-emerald-600 dark:to-emerald-700 shadow-md`;
      case 'documentation':
        return `${baseClasses} text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 dark:from-teal-600 dark:to-teal-700 shadow-md`;
      case 'download':
        return `${baseClasses} text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 dark:from-green-600 dark:to-green-700 shadow-md`;
      case 'website':
        return `${baseClasses} text-white bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 dark:from-cyan-600 dark:to-cyan-700 shadow-md`;
      default:
        return `${baseClasses} text-white bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 dark:from-slate-600 dark:to-slate-700 shadow-md`;
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
      case 'website':
        return 'fas fa-globe';
      default:
        return 'fas fa-link';
    }
  }
}
