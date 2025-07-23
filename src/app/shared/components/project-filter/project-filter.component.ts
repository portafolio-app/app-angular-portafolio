import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Project } from '../../../core/services/projects-data.service';

export interface ProjectFilterCriteria {
  searchQuery?: string;
  selectedTechnology?: string;
  featuredFilter?: 'featured' | 'regular' | '';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  quickFilters?: string[];
}

@Component({
  selector: 'app-project-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-filter.component.html',
  styleUrls: ['./project-filter.component.css']
})
export class ProjectFilterComponent implements OnInit, OnChanges {
  // Inputs
  @Input() projects: Project[] = [];
  @Input() initialFilters: ProjectFilterCriteria = {};

  // Outputs
  @Output() filtersChanged = new EventEmitter<ProjectFilterCriteria>();
  @Output() filteredProjectsChanged = new EventEmitter<Project[]>();

  // Filter properties
  searchQuery: string = '';
  selectedTechnology: string = '';
  featuredFilter: 'featured' | 'regular' | '' = '';
  sortBy: string = 'title';
  sortOrder: 'asc' | 'desc' = 'asc';

  // Quick filters
  quickFilterTechs: string[] = [];
  activeQuickFilters: string[] = [];

  // Available options
  availableTechnologies: string[] = [];

  // Computed properties
  filteredCount: number = 0;
  totalCount: number = 0;

  // Search debounce
  private searchSubject = new Subject<string>();

  constructor() {
    // Setup search debounce
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.applyFilters();
    });
  }

  // Computed property to check if projects have date fields
  get hasDateField(): boolean {
    return this.projects.some(project =>
      (project as any).date || (project as any).createdAt
    );
  }

  ngOnInit(): void {
    this.initializeFilters();
    this.extractAvailableOptions();
    this.applyFilters();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projects'] && this.projects) {
      this.extractAvailableOptions();
      this.totalCount = this.projects.length;
      this.applyFilters();
    }
  }

  private initializeFilters(): void {
    if (this.initialFilters) {
      this.searchQuery = this.initialFilters.searchQuery || '';
      this.selectedTechnology = this.initialFilters.selectedTechnology || '';
      this.featuredFilter = this.initialFilters.featuredFilter || '';
      this.sortBy = this.initialFilters.sortBy || 'title';
      this.sortOrder = this.initialFilters.sortOrder || 'asc';
      this.activeQuickFilters = this.initialFilters.quickFilters || [];
    }
  }

  private extractAvailableOptions(): void {
    if (!this.projects || this.projects.length === 0) {
      return;
    }

    // Extract all technologies
    const techSet = new Set<string>();
    this.projects.forEach(project => {
      if (project.technologies && Array.isArray(project.technologies)) {
        project.technologies.forEach(tech => {
          if (tech && typeof tech === 'object' && tech.name) {
            techSet.add(tech.name);
          }
        });
      }
    });

    this.availableTechnologies = Array.from(techSet).sort();

    // Set quick filter technologies (most common ones)
    const techCount = new Map<string, number>();
    this.availableTechnologies.forEach(tech => {
      const count = this.projects.filter(p =>
        p.technologies && Array.isArray(p.technologies) &&
        p.technologies.some(t => t && t.name === tech)
      ).length;
      techCount.set(tech, count);
    });

    // Get top 6 most used technologies for quick filters
    this.quickFilterTechs = Array.from(techCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([tech]) => tech);

    this.totalCount = this.projects.length;
  }

  // Filter event handlers
  onSearchChange(): void {
    this.searchSubject.next(this.searchQuery);
  }

  onTechnologyChange(): void {
    // Remove from quick filters if selected via dropdown
    this.activeQuickFilters = this.activeQuickFilters.filter(
      filter => filter !== this.selectedTechnology
    );
    this.applyFilters();
  }

  onFeaturedChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  // Quick filter methods
  toggleQuickFilter(tech: string): void {
    const index = this.activeQuickFilters.indexOf(tech);
    if (index > -1) {
      this.activeQuickFilters.splice(index, 1);
      // Clear dropdown if it was the same tech
      if (this.selectedTechnology === tech) {
        this.selectedTechnology = '';
      }
    } else {
      this.activeQuickFilters.push(tech);
      // Clear dropdown to avoid conflicts
      this.selectedTechnology = '';
    }
    this.applyFilters();
  }

  isQuickFilterActive(tech: string): boolean {
    return this.activeQuickFilters.includes(tech);
  }

  toggleFeaturedQuick(): void {
    this.featuredFilter = this.featuredFilter === 'featured' ? '' : 'featured';
    this.applyFilters();
  }

  // Clear methods
  clearSearch(): void {
    this.searchQuery = '';
    this.applyFilters();
  }

  clearAllFilters(): void {
    this.searchQuery = '';
    this.selectedTechnology = '';
    this.featuredFilter = '';
    this.activeQuickFilters = [];
    this.sortBy = 'title';
    this.sortOrder = 'asc';
    this.applyFilters();
  }

  // Main filter logic
  private applyFilters(): void {
    let filtered = [...this.projects];

    // Apply search filter
    if (this.searchQuery.trim()) {
      const searchTerms = this.searchQuery.toLowerCase().trim().split(' ');
      filtered = filtered.filter(project => {
        // Crear texto de búsqueda de forma segura
        const searchableText = [
          project.title || '',
          project.shortDescription || '',
          (project as any).description || '',
          (project as any).category || '',
          ...(project.technologies?.map(tech => tech.name) || []),
        ].join(' ').toLowerCase();

        return searchTerms.every(term => searchableText.includes(term));
      });
    }

    // Apply technology filter (dropdown)
    if (this.selectedTechnology) {
      filtered = filtered.filter(project =>
        project.technologies && Array.isArray(project.technologies) &&
        project.technologies.some(tech => tech && tech.name === this.selectedTechnology)
      );
    }

    // Apply quick technology filters
    if (this.activeQuickFilters.length > 0) {
      filtered = filtered.filter(project =>
        this.activeQuickFilters.some(filterTech =>
          project.technologies && Array.isArray(project.technologies) &&
          project.technologies.some(tech => tech && tech.name === filterTech)
        )
      );
    }

    // Apply featured filter
    if (this.featuredFilter === 'featured') {
      filtered = filtered.filter(project => project.featured === true);
    } else if (this.featuredFilter === 'regular') {
      filtered = filtered.filter(project => project.featured !== true);
    }

    // Apply sorting
    filtered = this.sortProjects(filtered);

    this.filteredCount = filtered.length;

    // Emit results
    const criteria: ProjectFilterCriteria = {
      searchQuery: this.searchQuery,
      selectedTechnology: this.selectedTechnology,
      featuredFilter: this.featuredFilter,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      quickFilters: this.activeQuickFilters
    };

    this.filtersChanged.emit(criteria);
    this.filteredProjectsChanged.emit(filtered);
  }

  private sortProjects(projects: Project[]): Project[] {
    return projects.sort((a, b) => {
      let comparison = 0;

      switch (this.sortBy) {
        case 'title':
          comparison = (a.title || '').localeCompare(b.title || '');
          break;

        case 'date':
          // Usar indexación de propiedades para acceder a 'date' de forma segura
          const dateA = (a as any).date ? new Date((a as any).date).getTime() :
                       (a as any).createdAt ? new Date((a as any).createdAt).getTime() : 0;
          const dateB = (b as any).date ? new Date((b as any).date).getTime() :
                       (b as any).createdAt ? new Date((b as any).createdAt).getTime() : 0;
          comparison = dateA - dateB;
          break;

        case 'featured':
          comparison = (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
          break;

        case 'tech-count':
          const techCountA = a.technologies?.length || 0;
          const techCountB = b.technologies?.length || 0;
          comparison = techCountA - techCountB;
          break;

        default:
          comparison = 0;
      }

      return this.sortOrder === 'desc' ? -comparison : comparison;
    });
  }

  // Computed properties
  get hasActiveFilters(): boolean {
    return !!(
      this.searchQuery.trim() ||
      this.selectedTechnology ||
      this.featuredFilter ||
      this.activeQuickFilters.length > 0 ||
      this.sortBy !== 'title' ||
      this.sortOrder !== 'asc'
    );
  }

  getActiveFiltersText(): string {
    const filters = [];

    if (this.searchQuery.trim()) {
      filters.push(`Búsqueda: "${this.searchQuery}"`);
    }

    if (this.selectedTechnology) {
      filters.push(`Tecnología: ${this.selectedTechnology}`);
    }

    if (this.activeQuickFilters.length > 0) {
      filters.push(`Filtros: ${this.activeQuickFilters.join(', ')}`);
    }

    if (this.featuredFilter === 'featured') {
      filters.push('Solo destacados');
    } else if (this.featuredFilter === 'regular') {
      filters.push('Solo regulares');
    }

    if (this.sortBy !== 'title' || this.sortOrder !== 'asc') {
      const sortText = this.sortBy === 'title' ? 'Nombre' :
                      this.sortBy === 'date' ? 'Fecha' :
                      this.sortBy === 'featured' ? 'Destacados' : 'Tecnologías';
      filters.push(`Orden: ${sortText} ${this.sortOrder === 'asc' ? '↑' : '↓'}`);
    }

    return filters.join(' • ');
  }

  // Export/Import filter configuration
  exportFilters(): ProjectFilterCriteria {
    return {
      searchQuery: this.searchQuery,
      selectedTechnology: this.selectedTechnology,
      featuredFilter: this.featuredFilter,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      quickFilters: this.activeQuickFilters
    };
  }

  importFilters(criteria: ProjectFilterCriteria): void {
    this.searchQuery = criteria.searchQuery || '';
    this.selectedTechnology = criteria.selectedTechnology || '';
    this.featuredFilter = criteria.featuredFilter || '';
    this.sortBy = criteria.sortBy || 'title';
    this.sortOrder = criteria.sortOrder || 'asc';
    this.activeQuickFilters = criteria.quickFilters || [];
    this.applyFilters();
  }
}
