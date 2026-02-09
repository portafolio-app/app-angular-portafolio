// src/app/core/models/blog.interface.ts
export interface BlogAuthor {
  name: string;
  avatar?: string;
  bio?: string;
  social?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export interface BlogTag {
  id: string;
  name: string;
  color?: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: BlogAuthor;
  tags: BlogTag[];
  category: BlogCategory;
  publishedAt: Date;
  updatedAt?: Date;
  readingTime: number; // en minutos
  views?: number;
  likes?: number;
  featured: boolean;
  published: boolean;
  videoUrl?: string; // URL del video de YouTube/Vimeo
  videoType?: 'youtube' | 'vimeo' | 'direct';
  videoDuration?: number; // duración en minutos
  seoMetadata?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

export enum BlogCategory {
  ANGULAR = 'angular',
  SPRING_BOOT = 'spring-boot',
  TYPESCRIPT = 'typescript',
  JAVA = 'java',
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  DEVOPS = 'devops',
  ARQUITECTURA = 'arquitectura',
  BEST_PRACTICES = 'best-practices',
  TUTORIAL = 'tutorial',
  CASE_STUDY = 'case-study'
}

export interface BlogFilters {
  category?: BlogCategory;
  tag?: string;
  searchQuery?: string;
  featured?: boolean;
}

export interface BlogStats {
  totalArticles: number;
  totalViews: number;
  categoriesCount: Map<BlogCategory, number>;
  popularTags: BlogTag[];
}
