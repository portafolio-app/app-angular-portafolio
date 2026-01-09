import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { BlogService } from '../../../core/services/blog.service';
import { BlogArticle, BlogCategory, BlogFilters } from '../../../core/models/blog.interface';
import { ThemeService } from '../../../core/services/ThemeService';
import { NavbardComponent } from '../../../shared/components/navbard/navbard.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbardComponent, FooterComponent],
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit, OnDestroy {
  articles: BlogArticle[] = [];
  filteredArticles: BlogArticle[] = [];
  featuredArticles: BlogArticle[] = [];
  isLoading: boolean = true;
  isDarkMode: boolean = false;

  // Filtros
  searchQuery: string = '';
  selectedCategory: BlogCategory | '' = '';
  selectedTag: string = '';

  // Categorías disponibles
  categories = Object.values(BlogCategory);

  // Paginación
  currentPage: number = 1;
  articlesPerPage: number = 6;
  totalPages: number = 1;

  private destroy$ = new Subject<void>();

  constructor(
    private blogService: BlogService,
    private themeService: ThemeService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.themeService.isDarkMode$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(isDarkMode => {
      this.isDarkMode = isDarkMode;
      this.cdr.detectChanges();
    });

    this.loadArticles();
    this.loadFeaturedArticles();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadArticles(): void {
    this.isLoading = true;
    this.blogService.getPublishedArticles().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (articles) => {
        this.articles = articles.sort((a, b) =>
          b.publishedAt.getTime() - a.publishedAt.getTime()
        );
        this.applyFilters();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading articles:', error);
        this.isLoading = false;
      }
    });
  }

  private loadFeaturedArticles(): void {
    this.blogService.getFeaturedArticles(3).pipe(
      takeUntil(this.destroy$)
    ).subscribe(articles => {
      this.featuredArticles = articles;
      this.cdr.detectChanges();
    });
  }

  applyFilters(): void {
    const filters: BlogFilters = {
      searchQuery: this.searchQuery || undefined,
      category: this.selectedCategory || undefined,
      tag: this.selectedTag || undefined
    };

    this.blogService.filterArticles(filters).pipe(
      takeUntil(this.destroy$)
    ).subscribe(articles => {
      this.filteredArticles = articles.sort((a, b) =>
        b.publishedAt.getTime() - a.publishedAt.getTime()
      );
      this.totalPages = Math.ceil(this.filteredArticles.length / this.articlesPerPage);
      this.currentPage = 1;
      this.cdr.detectChanges();
    });
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.selectedTag = '';
    this.applyFilters();
  }

  get paginatedArticles(): BlogArticle[] {
    const start = (this.currentPage - 1) * this.articlesPerPage;
    const end = start + this.articlesPerPage;
    return this.filteredArticles.slice(start, end);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  viewArticle(article: BlogArticle): void {
    this.router.navigate(['/blog', article.slug]);
  }

  getCategoryLabel(category: BlogCategory): string {
    const labels: Record<BlogCategory, string> = {
      [BlogCategory.ANGULAR]: 'Angular',
      [BlogCategory.SPRING_BOOT]: 'Spring Boot',
      [BlogCategory.TYPESCRIPT]: 'TypeScript',
      [BlogCategory.JAVA]: 'Java',
      [BlogCategory.FRONTEND]: 'Frontend',
      [BlogCategory.BACKEND]: 'Backend',
      [BlogCategory.DEVOPS]: 'DevOps',
      [BlogCategory.ARQUITECTURA]: 'Arquitectura',
      [BlogCategory.BEST_PRACTICES]: 'Best Practices',
      [BlogCategory.TUTORIAL]: 'Tutorial',
      [BlogCategory.CASE_STUDY]: 'Case Study'
    };
    return labels[category] || category;
  }

  getCategoryColor(category: BlogCategory): string {
    const colors: Record<BlogCategory, string> = {
      [BlogCategory.ANGULAR]: 'bg-red-500',
      [BlogCategory.SPRING_BOOT]: 'bg-green-500',
      [BlogCategory.TYPESCRIPT]: 'bg-blue-500',
      [BlogCategory.JAVA]: 'bg-orange-500',
      [BlogCategory.FRONTEND]: 'bg-purple-500',
      [BlogCategory.BACKEND]: 'bg-indigo-500',
      [BlogCategory.DEVOPS]: 'bg-pink-500',
      [BlogCategory.ARQUITECTURA]: 'bg-gray-500',
      [BlogCategory.BEST_PRACTICES]: 'bg-teal-500',
      [BlogCategory.TUTORIAL]: 'bg-yellow-500',
      [BlogCategory.CASE_STUDY]: 'bg-cyan-500'
    };
    return colors[category] || 'bg-gray-500';
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }
}
