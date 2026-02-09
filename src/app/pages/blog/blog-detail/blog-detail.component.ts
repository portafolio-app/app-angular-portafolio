import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil, catchError, of, take } from 'rxjs';
import {
  Meta,
  Title,
  DomSanitizer,
  SafeResourceUrl,
} from '@angular/platform-browser';
import {
  LucideAngularModule,
  Calendar,
  Clock,
  Eye,
  Heart,
  Play,
  Info,
  Share2,
  ArrowLeft,
  Twitter,
  Linkedin,
  Facebook,
  MessageCircle,
  X,
  CheckCircle,
  AlertTriangle,
  Settings,
  Cloud,
  Terminal,
  Package,
  Shield,
  Globe,
  Cpu,
  Database,
  Lock,
  Users,
  Zap,
  BookOpen,
  ExternalLink,
  Monitor,
  Copy,
} from 'lucide-angular';

import { BlogService } from '../../../core/services/blog.service';
import { BlogArticle } from '../../../core/models/blog.interface';
import { ThemeService } from '../../../core/services/ThemeService';
import { BlogNavbarComponent } from '../components/blog-navbar/blog-navbar.component';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule,
    BlogNavbarComponent,
  ],
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css'],
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

  // Lucide Icons
  readonly Calendar = Calendar;
  readonly Clock = Clock;
  readonly Eye = Eye;
  readonly Heart = Heart;
  readonly Play = Play;
  readonly Info = Info;
  readonly Share2 = Share2;
  readonly ArrowLeft = ArrowLeft;
  readonly Twitter = Twitter;
  readonly Linkedin = Linkedin;
  readonly Facebook = Facebook;
  readonly MessageCircle = MessageCircle;
  readonly X = X;
  readonly CheckCircle = CheckCircle;
  readonly AlertTriangle = AlertTriangle;
  readonly BookOpen = BookOpen;
  readonly Monitor = Monitor;
  readonly Copy = Copy;
  readonly ExternalLink = ExternalLink;

  // Tutorial progress tracking
  tutorialProgress = {
    step1: false,
    step2: false,
    step3: false,
    step4: false,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private themeService: ThemeService,
    private meta: Meta,
    private title: Title,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.themeService.isDarkMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isDarkMode) => {
        this.isDarkMode = isDarkMode;
        this.cdr.detectChanges();
      });

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const slug = params['slug'];
      if (slug) {
        this.loadArticle(slug);
        // Load tutorial progress if this is the AWS EKS tutorial
        if (slug === 'aws-eks-kubernetes-guide-completo') {
          this.loadTutorialProgress();
        }
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

    this.blogService
      .getArticleBySlug(slug)
      .pipe(
        take(1), // Take only the first emission to prevent infinite loop
        catchError((error: any) => {
          console.error('Error loading article:', error);
          this.error = 'Error al cargar el artículo';
          this.isLoading = false;
          return of(undefined);
        }),
      )
      .subscribe((article: BlogArticle | undefined) => {
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
    this.blogService
      .getRelatedArticles(articleId, 3)
      .pipe(takeUntil(this.destroy$))
      .subscribe((articles: BlogArticle[]) => {
        this.relatedArticles = articles;
        this.cdr.detectChanges();
      });
  }

  private setMetaTags(article: BlogArticle): void {
    const metaTitle =
      article.seoMetadata?.metaTitle || `${article.title} | Blog`;
    const metaDescription =
      article.seoMetadata?.metaDescription || article.excerpt;

    this.title.setTitle(metaTitle);
    this.meta.updateTag({ name: 'description', content: metaDescription });

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: metaTitle });
    this.meta.updateTag({
      property: 'og:description',
      content: metaDescription,
    });
    this.meta.updateTag({ property: 'og:image', content: article.coverImage });
    this.meta.updateTag({ property: 'og:type', content: 'article' });

    // Twitter Card
    this.meta.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    this.meta.updateTag({ name: 'twitter:title', content: metaTitle });
    this.meta.updateTag({
      name: 'twitter:description',
      content: metaDescription,
    });
    this.meta.updateTag({ name: 'twitter:image', content: article.coverImage });

    // Keywords
    if (article.seoMetadata?.keywords) {
      this.meta.updateTag({
        name: 'keywords',
        content: article.seoMetadata.keywords.join(', '),
      });
    }
  }

  toggleLike(): void {
    if (!this.article) return;

    this.isLiked = !this.isLiked;
    this.blogService
      .toggleLike(this.article.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((likes) => {
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

  copyCommand(command: string): void {
    if (this.isBrowser && navigator.clipboard) {
      navigator.clipboard
        .writeText(command)
        .then(() => {
          // Show success feedback (you could add a toast here)
          console.log('Command copied to clipboard');
        })
        .catch((err) => {
          console.error('Failed to copy command: ', err);
        });
    }
  }

  markStepComplete(step: number): void {
    switch (step) {
      case 1:
        this.tutorialProgress.step1 = true;
        break;
      case 2:
        this.tutorialProgress.step2 = true;
        break;
      case 3:
        this.tutorialProgress.step3 = true;
        break;
      case 4:
        this.tutorialProgress.step4 = true;
        break;
    }

    // Save progress to localStorage
    if (this.isBrowser) {
      localStorage.setItem(
        'aws-eks-tutorial-progress',
        JSON.stringify(this.tutorialProgress),
      );
    }
  }

  getProgressPercentage(): number {
    const completedSteps = Object.values(this.tutorialProgress).filter(
      Boolean,
    ).length;
    return Math.round((completedSteps / 4) * 100);
  }

  loadTutorialProgress(): void {
    if (this.isBrowser) {
      const saved = localStorage.getItem('aws-eks-tutorial-progress');
      if (saved) {
        this.tutorialProgress = {
          ...this.tutorialProgress,
          ...JSON.parse(saved),
        };
      }
    }
  }

  copyToClipboard(): void {
    if (this.isBrowser && navigator.clipboard) {
      const url = window.location.href;
      navigator.clipboard
        .writeText(url)
        .then(() => {
          // You could add a toast notification here
          console.log('URL copied to clipboard');
        })
        .catch((err) => {
          console.error('Failed to copy URL: ', err);
        });
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
      day: 'numeric',
    }).format(date);
  }

  getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      angular: 'Angular',
      'spring-boot': 'Spring Boot',
      typescript: 'TypeScript',
      java: 'Java',
      frontend: 'Frontend',
      backend: 'Backend',
      devops: 'DevOps',
      arquitectura: 'Arquitectura',
      'best-practices': 'Best Practices',
      tutorial: 'Tutorial',
      'case-study': 'Case Study',
    };
    return labels[category] || category;
  }

  /**
   * Convierte URL de YouTube/Vimeo a URL embebida segura
   */
  getVideoEmbedUrl(url: string): SafeResourceUrl {
    if (!url) return this.sanitizer.bypassSecurityTrustResourceUrl('');

    try {
      let embedUrl = '';

      // YouTube URLs
      if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1].split('&')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0`;
      } else if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1].split('?')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0`;
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
}
