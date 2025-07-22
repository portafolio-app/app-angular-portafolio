import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Project } from '../../../core/services/projects-data.service';

export interface ProjectFilterCriteria {
  searchQuery?: string;
  selectedTechnology?: string;
  featuredFilter?: 'featured' | 'regular' | '';
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

  // Outputs
  @Output() filtersChanged = new EventEmitter<ProjectFilterCriteria>();
  @Output() filteredProjectsChanged = new EventEmitter<Project[]>();

  // Filter properties
  searchQuery: string = '';
  selectedTechnology: string = '';
  featuredFilter: 'featured' | 'regular' | '' = '';

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

  ngOnInit(): void {
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
    this.totalCount = this.projects.length;
  }

  // Filter event handlers
  onSearchChange(): void {
    this.searchSubject.next(this.searchQuery);
  }

  onTechnologyChange(): void {
    this.applyFilters();
  }

  onFeaturedChange(): void {
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
    this.applyFilters();
  }

  // Main filter logic
  private applyFilters(): void {
    let filtered = [...this.projects];

    // Apply search filter
    if (this.searchQuery.trim()) {
      const searchTerms = this.searchQuery.toLowerCase().trim().split(' ');
      filtered = filtered.filter(project => {
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

    // Apply technology filter
    if (this.selectedTechnology) {
      filtered = filtered.filter(project =>
        project.technologies && Array.isArray(project.technologies) &&
        project.technologies.some(tech => tech && tech.name === this.selectedTechnology)
      );
    }

    // Apply featured filter
    if (this.featuredFilter === 'featured') {
      filtered = filtered.filter(project => project.featured === true);
    } else if (this.featuredFilter === 'regular') {
      filtered = filtered.filter(project => project.featured !== true);
    }

    this.filteredCount = filtered.length;

    // Emit results
    const criteria: ProjectFilterCriteria = {
      searchQuery: this.searchQuery,
      selectedTechnology: this.selectedTechnology,
      featuredFilter: this.featuredFilter
    };

    this.filtersChanged.emit(criteria);
    this.filteredProjectsChanged.emit(filtered);
  }

  // Computed properties
  get hasActiveFilters(): boolean {
    return !!(
      this.searchQuery.trim() ||
      this.selectedTechnology ||
      this.featuredFilter
    );
  }
}
