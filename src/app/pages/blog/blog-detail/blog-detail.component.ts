import { Component, OnInit, OnDestroy, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil, catchError, of, take } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';

import { BlogService } from '../../../core/services/blog.service';
import { BlogArticle } from '../../../core/models/blog.interface';
import { ThemeService } from '../../../core/services/ThemeService';
import { NavbardComponent } from '../../../shared/components/navbard/navbard.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbardComponent, FooterComponent],
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css']
})
export class BlogDetailComponent implements OnInit, OnDestroy {
  article: BlogArticle | null = null;
  relatedArticles: BlogArticle[] = [];
  isLoading: boolean = true;
  isDarkMode: boolean = false;
  error: string | null = null;
  isLiked: boolean = false;

  private destroy$ = new Subject<void>();
  private isBrowser: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private themeService: ThemeService,
    private meta: Meta,
    private title: Title,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.themeService.isDarkMode$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(isDarkMode => {
      this.isDarkMode = isDarkMode;
      this.cdr.detectChanges();
    });

    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const slug = params['slug'];
      if (slug) {
        this.loadArticle(slug);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadArticle(slug: string): void {
    this.isLoading = true;
    this.error = null;

    this.blogService.getArticleBySlug(slug).pipe(
      take(1), // Take only the first emission to prevent infinite loop
      catchError(error => {
        console.error('Error loading article:', error);
        this.error = 'Error al cargar el artículo';
        this.isLoading = false;
        return of(undefined);
      })
    ).subscribe(article => {
      if (article) {
        this.article = article;
        this.setMetaTags(article);
        this.loadRelatedArticles(article.id);

        // Incrementar vistas
        if (this.isBrowser) {
          this.blogService.incrementViews(article.id);
        }
      } else {
        this.error = 'Artículo no encontrado';
      }
      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }

  private loadRelatedArticles(articleId: string): void {
    this.blogService.getRelatedArticles(articleId, 3).pipe(
      takeUntil(this.destroy$)
    ).subscribe(articles => {
      this.relatedArticles = articles;
      this.cdr.detectChanges();
    });
  }

  private setMetaTags(article: BlogArticle): void {
    const metaTitle = article.seoMetadata?.metaTitle || `${article.title} | Blog`;
    const metaDescription = article.seoMetadata?.metaDescription || article.excerpt;

    this.title.setTitle(metaTitle);
    this.meta.updateTag({ name: 'description', content: metaDescription });

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: metaTitle });
    this.meta.updateTag({ property: 'og:description', content: metaDescription });
    this.meta.updateTag({ property: 'og:image', content: article.coverImage });
    this.meta.updateTag({ property: 'og:type', content: 'article' });

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: metaTitle });
    this.meta.updateTag({ name: 'twitter:description', content: metaDescription });
    this.meta.updateTag({ name: 'twitter:image', content: article.coverImage });

    // Keywords
    if (article.seoMetadata?.keywords) {
      this.meta.updateTag({
        name: 'keywords',
        content: article.seoMetadata.keywords.join(', ')
      });
    }
  }

  toggleLike(): void {
    if (!this.article) return;

    this.isLiked = !this.isLiked;
    this.blogService.toggleLike(this.article.id).pipe(
      takeUntil(this.destroy$)
    ).subscribe(likes => {
      if (this.article) {
        this.article.likes = likes;
        this.cdr.detectChanges();
      }
    });
  }

  shareArticle(platform: string): void {
    if (!this.article || !this.isBrowser) return;

    const url = window.location.href;
    const text = this.article.title;

    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  }

  goBack(): void {
    this.router.navigate(['/blog']);
  }

  viewRelatedArticle(article: BlogArticle): void {
    this.router.navigate(['/blog', article.slug]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }

  getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      'angular': 'Angular',
      'spring-boot': 'Spring Boot',
      'typescript': 'TypeScript',
      'java': 'Java',
      'frontend': 'Frontend',
      'backend': 'Backend',
      'devops': 'DevOps',
      'arquitectura': 'Arquitectura',
      'best-practices': 'Best Practices',
      'tutorial': 'Tutorial',
      'case-study': 'Case Study'
    };
    return labels[category] || category;
  }
}
