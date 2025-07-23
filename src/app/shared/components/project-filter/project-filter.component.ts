import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Project } from '../../../core/services/projects-data.service';

@Component({
  selector: 'app-project-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-filter.component.html'
})
export class ProjectFilterComponent implements OnInit, OnChanges {
  @Input() projects: Project[] = [];
  @Input() resetTrigger: boolean = false; // NUEVO: Para triggerar reset desde el padre
  @Output() filtersChanged = new EventEmitter<any>();
  @Output() filteredProjectsChanged = new EventEmitter<Project[]>();

  searchQuery: string = '';
  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.applyFilters();
    });
  }

  ngOnInit(): void {
    this.applyFilters();
  }

  // NUEVO: Detectar cambios en los inputs
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projects'] && !changes['projects'].firstChange) {
      // Cuando cambian los proyectos, re-aplicar filtros
      this.applyFilters();
    }

    if (changes['resetTrigger'] && changes['resetTrigger'].currentValue) {
      // Cuando se triggerea el reset, limpiar búsqueda
      this.searchQuery = '';
      this.applyFilters();
    }
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchQuery);
    // Emitir cambios de filtros inmediatamente para el estado
    this.filtersChanged.emit({
      searchQuery: this.searchQuery
    });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.applyFilters();
  }

  // NUEVO: Método público para reset desde el componente padre
  public resetFilters(): void {
    this.searchQuery = '';
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = this.projects;

    // Apply search filter
    if (this.searchQuery.trim()) {
      const searchTerms = this.searchQuery.toLowerCase().trim().split(' ');
      filtered = filtered.filter(project => {
        const searchableText = [
          project.title || '',
          project.shortDescription || '',
          (project as any).description || '',
          (project as any).category || '',
          // NUEVO: También buscar en tecnologías
          project.technologies.map(tech => tech.name).join(' ')
        ].join(' ').toLowerCase();

        return searchTerms.every(term => searchableText.includes(term));
      });
    }

    // Emitir resultados filtrados
    this.filteredProjectsChanged.emit(filtered);

    // Emitir criterios de filtros
    this.filtersChanged.emit({
      searchQuery: this.searchQuery
    });
  }
}
