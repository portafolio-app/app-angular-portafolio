import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
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
export class ProjectFilterComponent implements OnInit {
  @Input() projects: Project[] = [];
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

  onSearchChange(): void {
    this.searchSubject.next(this.searchQuery);
  }

  clearSearch(): void {
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
        ].join(' ').toLowerCase();

        return searchTerms.every(term => searchableText.includes(term));
      });
    }

    this.filteredProjectsChanged.emit(filtered);
  }
}
