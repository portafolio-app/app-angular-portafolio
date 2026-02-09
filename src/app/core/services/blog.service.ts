// src/app/core/services/blog.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, delay } from 'rxjs';
import {
  BlogArticle,
  BlogCategory,
  BlogFilters,
  BlogStats,
  BlogTag,
  BlogAuthor,
} from '../models/blog.interface';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private articlesSubject = new BehaviorSubject<BlogArticle[]>([]);
  public articles$ = this.articlesSubject.asObservable();

  private readonly author: BlogAuthor = {
    name: 'Jorge Castillo Vega',
    avatar:
      'https://ui-avatars.com/api/?name=Jorge+Castillo+Vega&size=200&background=10b981&color=fff&bold=true',
    bio: 'Desarrollador Full Stack especializado en Angular y Spring Boot',
    social: {
      github: 'https://github.com/tuusuario',
      linkedin: 'https://linkedin.com/in/tuusuario',
    },
  };

  constructor() {
    this.initializeArticles();
  }

  private initializeArticles(): void {
    const articles: BlogArticle[] = [
      {
        id: 'aws-eks-guide',
        title:
          'Guía Completa AWS EKS | Crear EC2, Configurar IAM y Desplegar Kubernetes',
        slug: 'aws-eks-kubernetes-guide-completo',
        excerpt:
          'Tutorial práctico de 16 minutos donde aprenderás a implementar un clúster de Kubernetes en Amazon EKS desde cero. Incluye configuración de EC2, IAM, kubectl y eksctl con ejemplos reales.',
        content: `
<div class="space-y-3 md:space-y-4">
  <div class="bg-gradient-to-r from-emerald-700 to-emerald-800 text-white rounded-lg p-5 md:p-6">
    <div class="text-center">
      <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Guía Completa AWS EKS</h1>
      <p class="text-base md:text-lg text-emerald-100">Implementa Kubernetes en la nube con Amazon EKS</p>
      <div class="mt-3 inline-flex items-center gap-2 bg-emerald-600 px-3 py-1 rounded text-sm">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        16 minutos
      </div>
    </div>
  </div>

  <div class="bg-white dark:bg-gray-800 rounded-lg p-3 md:p-5 border border-gray-200 dark:border-gray-700">
    <h2 class="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3">¿Qué aprenderás?</h2>

    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
      <div class="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700">
        <h3 class="font-medium text-gray-900 dark:text-white text-sm mb-1">Configuración EC2</h3>
        <p class="text-xs text-gray-600 dark:text-gray-400">Ubuntu en AWS</p>
      </div>

      <div class="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700">
        <h3 class="font-medium text-gray-900 dark:text-white text-sm mb-1">SSH Seguro</h3>
        <p class="text-xs text-gray-600 dark:text-gray-400">Llaves y acceso</p>
      </div>

      <div class="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700">
        <h3 class="font-medium text-gray-900 dark:text-white text-sm mb-1">Herramientas</h3>
        <p class="text-xs text-gray-600 dark:text-gray-400">AWS CLI, kubectl</p>
      </div>

      <div class="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700">
        <h3 class="font-medium text-gray-900 dark:text-white text-sm mb-1">Clúster EKS</h3>
        <p class="text-xs text-gray-600 dark:text-gray-400">Kubernetes en AWS</p>
      </div>
    </div>
  </div>

  <div class="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-700 rounded-lg p-3">
    <h3 class="font-medium text-emerald-900 dark:text-emerald-100 mb-2">Requisitos</h3>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
      <div class="text-emerald-800 dark:text-emerald-200">• Cuenta AWS activa</div>
      <div class="text-emerald-800 dark:text-emerald-200">• Conocimientos Linux</div>
      <div class="text-emerald-800 dark:text-emerald-200">• Conceptos Docker</div>
    </div>
  </div>

  <div class="bg-emerald-100 dark:bg-emerald-900/20 border border-emerald-300 dark:border-emerald-600 rounded-lg p-3">
    <h3 class="font-medium text-emerald-900 dark:text-emerald-100 mb-2 flex items-center gap-2">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
      </svg>
      Repositorio GitHub
    </h3>
    <p class="text-sm text-emerald-800 dark:text-emerald-200 mb-2">
      Comandos y configuraciones completas del tutorial
    </p>
    <a href="https://github.com/VCL-tt/DevOps-Guides/blob/feature/eks-guide/01-EKS-AWS-Command-Guide/Setup-Commands.md"
       class="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
       target="_blank" rel="noopener noreferrer">
      <span>Ver Documentación</span>
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
      </svg>
    </a>
  </div>

  <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-3">
    <div class="flex items-start gap-3">
      <svg class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/>
      </svg>
      <div>
        <h3 class="font-medium text-amber-900 dark:text-amber-100 mb-1">Nota sobre costos</h3>
        <p class="text-sm text-amber-800 dark:text-amber-200">
          Este tutorial usa servicios AWS que pueden generar costos. Elimina los recursos al finalizar.
        </p>
      </div>
    </div>
  </div>
</div>
`,
        category: BlogCategory.DEVOPS,
        tags: [
          { id: 'aws', name: 'AWS' },
          { id: 'kubernetes', name: 'Kubernetes' },
          { id: 'devops', name: 'DevOps' },
          { id: 'eks', name: 'EKS' },
          { id: 'docker', name: 'Docker' },
        ],
        publishedAt: new Date('2024-01-15'),
        readingTime: 15,
        likes: 42,
        views: 1250,
        featured: true,
        published: true,
        coverImage: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=600&fit=crop&q=80',
        videoUrl: 'https://www.youtube.com/watch?v=-vvRvjaecGI&t=4s',
        videoDuration: 16,
        author: this.author,
      },
    ];

    this.articlesSubject.next(articles);
  }

  // Get all articles
  getArticles(): Observable<BlogArticle[]> {
    return this.articles$;
  }

  // Get published articles
  getPublishedArticles(): Observable<BlogArticle[]> {
    return this.articles$.pipe(
      map((articles) => articles.filter((article) => article.published)),
    );
  }

  // Get article by slug
  getBySlug(slug: string): Observable<BlogArticle | undefined> {
    return this.articles$.pipe(
      map((articles) => articles.find((article) => article.slug === slug)),
    );
  }

  // Get article by slug (alias for compatibility)
  getArticleBySlug(slug: string): Observable<BlogArticle | undefined> {
    return this.getBySlug(slug);
  }

  // Get article by ID
  getArticleById(id: string): Observable<BlogArticle | undefined> {
    return this.articles$.pipe(
      map((articles) => articles.find((article) => article.id === id)),
    );
  }

  // Get articles by category
  getArticlesByCategory(category: BlogCategory): Observable<BlogArticle[]> {
    return this.articles$.pipe(
      map((articles) =>
        articles.filter((article) => article.category === category),
      ),
    );
  }

  // Get featured articles
  getFeaturedArticles(): Observable<BlogArticle[]> {
    return this.articles$.pipe(
      map((articles) => articles.filter((article) => article.featured)),
    );
  }

  // Get recent articles
  getRecentArticles(limit: number = 3): Observable<BlogArticle[]> {
    return this.articles$.pipe(
      map((articles) =>
        articles
          .sort(
            (a, b) =>
              new Date(b.publishedAt).getTime() -
              new Date(a.publishedAt).getTime(),
          )
          .slice(0, limit),
      ),
    );
  }

  // Get articles by tag
  getArticlesByTag(tag: string): Observable<BlogArticle[]> {
    return this.articles$.pipe(
      map((articles) =>
        articles.filter((article) => article.tags.some((t) => t.id === tag)),
      ),
    );
  }

  // Search articles
  searchArticles(query: string): Observable<BlogArticle[]> {
    const searchQuery = query.toLowerCase().trim();
    if (!searchQuery) {
      return this.articles$;
    }

    return this.articles$.pipe(
      map((articles) =>
        articles.filter(
          (article) =>
            article.title.toLowerCase().includes(searchQuery) ||
            article.excerpt.toLowerCase().includes(searchQuery) ||
            article.content.toLowerCase().includes(searchQuery) ||
            article.tags.some((tag) =>
              tag.name.toLowerCase().includes(searchQuery),
            ),
        ),
      ),
    );
  }

  // Filter articles
  filterArticles(filters: BlogFilters): Observable<BlogArticle[]> {
    return this.articles$.pipe(
      map((articles) => {
        let filteredArticles = [...articles];

        if (filters.category) {
          filteredArticles = filteredArticles.filter(
            (article) => article.category === filters.category,
          );
        }

        if (filters.tag) {
          filteredArticles = filteredArticles.filter((article) =>
            article.tags.some((tag) => tag.id === filters.tag),
          );
        }

        if (filters.featured !== undefined) {
          filteredArticles = filteredArticles.filter(
            (article) => article.featured === filters.featured,
          );
        }

        return filteredArticles;
      }),
    );
  }

  // Get blog statistics
  getBlogStats(): Observable<BlogStats> {
    return this.articles$.pipe(
      map((articles) => {
        const tagsCount = this.getTagsCount(articles);
        const sortedTags = Object.entries(tagsCount)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10)
          .map(
            ([tagId]) =>
              articles.flatMap((a) => a.tags).find((t) => t.id === tagId)!,
          )
          .filter(Boolean);

        return {
          totalArticles: articles.length,
          totalViews: articles.reduce(
            (sum, article) => sum + (article.views || 0),
            0,
          ),
          totalLikes: articles.reduce(
            (sum, article) => sum + (article.likes || 0),
            0,
          ),
          totalReadingTime: articles.reduce(
            (sum, article) => sum + article.readingTime,
            0,
          ),
          categoriesCount: new Map(
            Object.entries(this.getCategoriesCount(articles)),
          ) as Map<BlogCategory, number>,
          popularTags: sortedTags,
        };
      }),
    );
  }

  // Get all unique categories
  getCategories(): Observable<BlogCategory[]> {
    return this.articles$.pipe(
      map((articles) => {
        const categories = articles.map((article) => article.category);
        return [...new Set(categories)];
      }),
    );
  }

  // Get all unique tags
  getTags(): Observable<string[]> {
    return this.articles$.pipe(
      map((articles) => {
        const allTags = articles.flatMap((article) =>
          article.tags.map((t) => t.id),
        );
        return [...new Set(allTags)];
      }),
    );
  }

  // Toggle like (simulado)
  toggleLike(articleId: string): Observable<number> {
    const articles = this.articlesSubject.value;
    const article = articles.find((a) => a.id === articleId);
    if (article && article.likes !== undefined) {
      article.likes++;
      this.articlesSubject.next([...articles]);
      return of(article.likes).pipe(delay(300));
    }
    return of(0);
  }

  // Increment views
  incrementViews(articleId: string): Observable<number> {
    const articles = this.articlesSubject.value;
    const article = articles.find((a) => a.id === articleId);
    if (article) {
      article.views = (article.views || 0) + 1;
      this.articlesSubject.next([...articles]);
      return of(article.views).pipe(delay(100));
    }
    return of(0);
  }

  // Get related articles
  getRelatedArticles(
    articleId: string,
    limit: number = 3,
  ): Observable<BlogArticle[]> {
    return this.articles$.pipe(
      map((articles) => {
        const currentArticle = articles.find((a) => a.id === articleId);
        if (!currentArticle) return [];

        return articles
          .filter(
            (article) =>
              article.id !== articleId &&
              (article.category === currentArticle.category ||
                article.tags.some((tag) =>
                  currentArticle.tags.some((ct) => ct.id === tag.id),
                )),
          )
          .slice(0, limit);
      }),
    );
  }

  // Category helper
  getCategoryLabel(category: BlogCategory): string {
    const labels: { [key in BlogCategory]: string } = {
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
      [BlogCategory.CASE_STUDY]: 'Case Study',
    };
    return labels[category] || category;
  }

  private getCategoriesCount(articles: BlogArticle[]): {
    [key: string]: number;
  } {
    return articles.reduce((acc: { [key: string]: number }, article) => {
      acc[article.category] = (acc[article.category] || 0) + 1;
      return acc;
    }, {});
  }

  private getTagsCount(articles: BlogArticle[]): { [key: string]: number } {
    return articles.reduce((acc: { [key: string]: number }, article) => {
      article.tags.forEach((tag) => {
        acc[tag.id] = (acc[tag.id] || 0) + 1;
      });
      return acc;
    }, {});
  }
}
