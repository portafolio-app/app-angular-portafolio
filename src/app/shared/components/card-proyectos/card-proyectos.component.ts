import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectionStrategy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil, catchError, of } from 'rxjs';

import {
  Project,
  ProjectsDataService,
} from '../../../core/services/projects-data.service';
import { ProjectFilterComponent, ProjectFilterCriteria } from '../project-filter/project-filter.component';


@Component({
  selector: 'app-card-proyectos',
  standalone: true,
  imports: [CommonModule, ProjectFilterComponent],
  templateUrl: './card-proyectos.component.html',
  styleUrls: ['./card-proyectos.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardProyectosComponent implements OnInit, OnDestroy {
  // Inputs
  @Input() showFeaturedOnly: boolean = true;
  @Input() sectionTitle: string = 'Mis Proyectos';
  @Input() sectionDescription: string = 'Una colección de proyectos que demuestran mis habilidades y experiencia en desarrollo de software';
  @Input() showFilters: boolean = true; // NUEVO: Controlar visibilidad del filtro

  // Outputs
  @Output() projectClicked = new EventEmitter<Project>();
  @Output() linkClicked = new EventEmitter<{project: Project, link: any}>();

  // State
  allProjects: Project[] = [];
  filteredProjects: Project[] = []; // NUEVO: Proyectos filtrados
  featuredProjects: Project[] = [];
  displayProjects: Project[] = []; // NUEVO: Proyectos a mostrar
  selectedProject: Project | null = null;
  isLoading: boolean = false;
  error: string | null = null;

  // Filter state
  currentFilters: ProjectFilterCriteria = {}; // NUEVO: Filtros actuales
  isFiltering: boolean = false; // NUEVO: Estado de filtrado

  // Private
  private readonly destroy$ = new Subject<void>();
  private isBrowser: boolean;

  constructor(
    private projectsService: ProjectsDataService,
    @Inject(PLATFORM_ID) platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {
    // Verificar si estamos en el navegador
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    // Solo manipular el DOM si estamos en el navegador
    if (this.isBrowser) {
      this.document.body.style.overflow = 'auto';
    }
  }

  // Computed properties actualizadas
  get totalProjects(): number {
    return this.allProjects.length;
  }

  get featuredCount(): number {
    // Si hay filtros activos, contar desde proyectos filtrados
    const projects = this.hasActiveFilters() ? this.filteredProjects : this.allProjects;
    return projects.filter(p => p.featured).length;
  }

  get totalTechnologies(): number {
    // Si hay filtros activos, contar desde proyectos filtrados
    const projects = this.hasActiveFilters() ? this.filteredProjects : this.allProjects;
    const techSet = new Set<string>();
    projects.forEach((project: Project) => {
      project.technologies.forEach((tech: any) => techSet.add(tech.name));
    });
    return techSet.size;
  }

  get visibleProjectsCount(): number {
    return this.displayProjects.length;
  }

  // NUEVO: Métodos para manejar filtros
  onFilteredProjectsChanged(filtered: Project[]): void {
    this.filteredProjects = filtered;
    this.updateDisplayProjects();
  }

  onFiltersChanged(criteria: ProjectFilterCriteria): void {
    this.currentFilters = criteria;
    this.isFiltering = this.hasActiveFilters();
  }

  private hasActiveFilters(): boolean {
    return !!(
      this.currentFilters.searchQuery?.trim() ||
      this.currentFilters.selectedTechnology ||
      this.currentFilters.featuredFilter
    );
  }

  private updateDisplayProjects(): void {
    const sourceProjects = this.hasActiveFilters() ? this.filteredProjects : this.allProjects;

    if (this.showFeaturedOnly && !this.isFiltering) {
      // Modo destacados sin filtros
      this.displayProjects = sourceProjects.filter(p => p.featured);
      this.featuredProjects = this.displayProjects;
    } else {
      // Mostrar todos o filtrados
      this.displayProjects = sourceProjects;
      this.featuredProjects = sourceProjects.filter(p => p.featured);
    }
  }

  // Data loading actualizado
  loadProjects(): void {
    this.isLoading = true;
    this.error = null;

    this.projectsService.getProjects().pipe(
      catchError(error => {
        console.error('Error loading projects:', error);
        this.error = this.getErrorMessage(error);
        this.isLoading = false;
        return of([]);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (projects: Project[]) => {
        this.allProjects = projects;
        this.filteredProjects = projects; // Inicialmente sin filtrar
        this.featuredProjects = projects.filter((p) => p.featured);
        this.updateDisplayProjects();
        this.isLoading = false;
      }
    });
  }

  retryLoadProjects(): void {
    this.loadProjects();
  }

  // View controls actualizados
  showAllProjects(): void {
    this.showFeaturedOnly = false;
    this.updateDisplayProjects();
  }

  showOnlyFeatured(): void {
    this.showFeaturedOnly = true;
    this.updateDisplayProjects();
  }

  // NUEVO: Métodos para gestión de filtros
  clearAllFilters(): void {
    this.currentFilters = {};
    this.isFiltering = false;
    this.filteredProjects = this.allProjects;
    this.updateDisplayProjects();
  }

  toggleFilterVisibility(): void {
    this.showFilters = !this.showFilters;
  }

  // Método helper para mostrar información de filtrado
  getFilterSummary(): string {
    if (!this.hasActiveFilters()) {
      return '';
    }

    const total = this.allProjects.length;
    const filtered = this.filteredProjects.length;
    const percentage = total > 0 ? Math.round((filtered / total) * 100) : 0;

    return `Mostrando ${filtered} de ${total} proyectos (${percentage}%)`;
  }

  // Project interactions
  onProjectClick(project: Project): void {
    this.projectClicked.emit(project);
    this.openModal(project);
  }

  onLinkClick(project: Project, link: any, event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    this.linkClicked.emit({ project, link });
    this.handleLinkClick(link);
  }

  onViewDetails(project: Project, event: Event): void {
    event.stopPropagation();
    this.openModal(project);
  }

  // Modal management - Compatible con SSR
  openModal(project: Project): void {
    this.selectedProject = project;

    // Solo manipular el DOM si estamos en el navegador
    if (this.isBrowser) {
      this.document.body.style.overflow = 'hidden';

      // Agregar listener para cerrar con ESC
      this.document.addEventListener('keydown', this.handleEscapeKey.bind(this));
    }
  }

  closeModal(): void {
    this.selectedProject = null;

    // Solo manipular el DOM si estamos en el navegador
    if (this.isBrowser) {
      this.document.body.style.overflow = 'auto';

      // Remover listener de ESC
      this.document.removeEventListener('keydown', this.handleEscapeKey.bind(this));
    }
  }

  // Manejar tecla ESC para cerrar modal
  private handleEscapeKey(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.selectedProject) {
      this.closeModal();
    }
  }

  // Link handling - Compatible con SSR
  handleLinkClick(link: any): void {
    // Solo abrir enlaces si estamos en el navegador
    if (!this.isBrowser) {
      return;
    }

    if (link?.url) {
      try {
        // Validación de URL solo en el navegador
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

  // Image error handling - Compatible con SSR
  handleImageError(event: any): void {
    // Solo manejar errores de imagen en el navegador
    if (!this.isBrowser || !event?.target) {
      return;
    }

    // Fallback image como data URI
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Qcm95ZWN0bzwvdGV4dD48L3N2Zz4=';
  }

  handleTechIconError(event: any): void {
    // Solo manejar errores de iconos en el navegador
    if (!this.isBrowser || !event?.target) {
      return;
    }

    // Fallback para iconos de tecnología
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjZTVlN2ViIiByeD0iNCIvPgo8cGF0aCBkPSJNMTAgNmMtMS4xIDAtMiAuOS0yIDJzLjkgMiAyIDIgMi0uOSAyLTItLjktMi0yLTJ6IiBmaWxsPSIjOWNhM2FmIi8+Cjwvc3ZnPgo=';
  }

  // Utility methods
  trackByProject(index: number, project: Project): string {
    return project.id;
  }

  // Button styling con tema verde
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
