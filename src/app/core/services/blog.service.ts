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
  BlogAuthor
} from '../models/blog.interface';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private articlesSubject = new BehaviorSubject<BlogArticle[]>([]);
  public articles$ = this.articlesSubject.asObservable();

  private readonly author: BlogAuthor = {
    name: 'Juan Carlos Vega', // Cambia esto por tu nombre
    avatar: 'https://ui-avatars.com/api/?name=Juan+Carlos+Vega&size=200&background=10b981&color=fff&bold=true', // Añade tu foto
    bio: 'Desarrollador Full Stack especializado en Angular y Spring Boot',
    social: {
      github: 'https://github.com/tuusuario',
      linkedin: 'https://linkedin.com/in/tuusuario'
    }
  };

  constructor() {
    this.initializeArticles();
  }

  private initializeArticles(): void {
    const articles: BlogArticle[] = [
      {
        id: '1',
        title: 'Arquitectura Limpia en Angular 19: Guía Completa',
        slug: 'arquitectura-limpia-angular-19',
        excerpt: 'Aprende a estructurar aplicaciones Angular escalables usando Clean Architecture, standalone components y las nuevas features de Angular 19.',
        content: `
# Arquitectura Limpia en Angular 19: Guía Completa

## Introducción

La arquitectura limpia (Clean Architecture) es fundamental para crear aplicaciones mantenibles y escalables. En este artículo, exploraremos cómo implementarla en Angular 19 usando standalone components.

## ¿Qué es Clean Architecture?

Clean Architecture, propuesta por Robert C. Martin, separa las preocupaciones en capas concéntricas:

1. **Entities**: Modelos de negocio
2. **Use Cases**: Lógica de negocio
3. **Interface Adapters**: Controladores y presentadores
4. **Frameworks**: UI y herramientas externas

## Estructura de Carpetas Recomendada

\`\`\`
src/app/
├── core/
│   ├── models/          # Entities
│   ├── services/        # Use Cases
│   ├── guards/
│   └── interceptors/
├── shared/
│   ├── components/
│   ├── directives/
│   └── pipes/
├── pages/               # Smart Components
└── modules/             # Feature Modules
\`\`\`

## Implementación con Standalone Components

\`\`\`typescript
// Smart Component
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  template: \`
    <div class="grid">
      @for (product of products$ | async; track product.id) {
        <app-product-card [product]="product" />
      }
    </div>
  \`
})
export class ProductsComponent {
  products$ = inject(ProductService).getProducts();
}
\`\`\`

## Ventajas

- ✅ Separación de responsabilidades
- ✅ Testeable
- ✅ Independiente del framework
- ✅ Escalable

## Conclusión

Implementar Clean Architecture en Angular 19 nos permite crear aplicaciones robustas y mantenibles a largo plazo.
        `,
        coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop',
        author: this.author,
        tags: [
          { id: 'angular', name: 'Angular', color: '#dd0031' },
          { id: 'arquitectura', name: 'Arquitectura', color: '#4a5568' },
          { id: 'clean-code', name: 'Clean Code', color: '#38a169' }
        ],
        category: BlogCategory.ANGULAR,
        publishedAt: new Date('2024-12-15'),
        readingTime: 8,
        views: 1250,
        likes: 89,
        featured: true,
        published: true,
        seoMetadata: {
          metaTitle: 'Arquitectura Limpia en Angular 19 - Guía Completa',
          metaDescription: 'Aprende a implementar Clean Architecture en Angular 19 con standalone components',
          keywords: ['angular', 'clean architecture', 'arquitectura', 'standalone components']
        }
      },
      {
        id: '2',
        title: 'Spring Boot 3 y JWT: Autenticación Segura',
        slug: 'spring-boot-jwt-authentication',
        excerpt: 'Implementa autenticación JWT robusta en Spring Boot 3 con Spring Security 6, refresh tokens y buenas prácticas de seguridad.',
        content: `
# Spring Boot 3 y JWT: Autenticación Segura

## Introducción

La autenticación con JWT (JSON Web Tokens) es el estándar de facto para APIs REST. En este tutorial, implementaremos un sistema completo y seguro.

## Dependencias Necesarias

\`\`\`xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.3</version>
</dependency>
\`\`\`

## Configuración de Security

\`\`\`java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) {
        return http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session ->
                session.sessionCreationPolicy(STATELESS)
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}
\`\`\`

## Generación de JWT

\`\`\`java
public String generateToken(UserDetails userDetails) {
    return Jwts.builder()
        .setSubject(userDetails.getUsername())
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + 86400000))
        .signWith(getSigningKey())
        .compact();
}
\`\`\`

## Buenas Prácticas

1. ✅ Usar HTTPS en producción
2. ✅ Implementar refresh tokens
3. ✅ Validar tokens en cada request
4. ✅ Usar secretos seguros (256 bits mínimo)
5. ✅ Implementar blacklist de tokens

## Conclusión

JWT es una solución robusta para autenticación en APIs REST cuando se implementa correctamente siguiendo las mejores prácticas de seguridad.
        `,
        coverImage: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1200&h=630&fit=crop',
        author: this.author,
        tags: [
          { id: 'spring-boot', name: 'Spring Boot', color: '#6db33f' },
          { id: 'jwt', name: 'JWT', color: '#000000' },
          { id: 'security', name: 'Security', color: '#e53e3e' }
        ],
        category: BlogCategory.SPRING_BOOT,
        publishedAt: new Date('2024-12-01'),
        readingTime: 12,
        views: 2100,
        likes: 156,
        featured: true,
        published: true
      },
      {
        id: '3',
        title: 'TypeScript Avanzado: Generics y Utility Types',
        slug: 'typescript-generics-utility-types',
        excerpt: 'Domina los conceptos avanzados de TypeScript incluyendo Generics, Utility Types, Type Guards y más para escribir código más robusto.',
        content: `
# TypeScript Avanzado: Generics y Utility Types

## Introducción

TypeScript ofrece características avanzadas que nos permiten escribir código más type-safe y reutilizable.

## Generics Básicos

\`\`\`typescript
function identity<T>(arg: T): T {
    return arg;
}

// Uso
const output = identity<string>("Hello");
const number = identity<number>(42);
\`\`\`

## Generics con Constraints

\`\`\`typescript
interface HasLength {
    length: number;
}

function logLength<T extends HasLength>(arg: T): T {
    console.log(arg.length);
    return arg;
}

logLength("Hello"); // ✅ OK
logLength([1, 2, 3]); // ✅ OK
logLength(123); // ❌ Error
\`\`\`

## Utility Types Útiles

### Partial<T>
\`\`\`typescript
interface User {
    id: number;
    name: string;
    email: string;
}

// Todas las propiedades opcionales
type PartialUser = Partial<User>;

function updateUser(user: User, updates: Partial<User>) {
    return { ...user, ...updates };
}
\`\`\`

### Pick<T, K>
\`\`\`typescript
type UserPreview = Pick<User, 'id' | 'name'>;
\`\`\`

### Omit<T, K>
\`\`\`typescript
type UserWithoutEmail = Omit<User, 'email'>;
\`\`\`

## Type Guards

\`\`\`typescript
function isString(value: unknown): value is string {
    return typeof value === 'string';
}

function processValue(value: string | number) {
    if (isString(value)) {
        console.log(value.toUpperCase());
    } else {
        console.log(value.toFixed(2));
    }
}
\`\`\`

## Conclusión

Dominar estos conceptos avanzados de TypeScript te permitirá escribir código más seguro, mantenible y elegante.
        `,
        coverImage: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=1200&h=630&fit=crop',
        author: this.author,
        tags: [
          { id: 'typescript', name: 'TypeScript', color: '#3178c6' },
          { id: 'generics', name: 'Generics', color: '#805ad5' },
          { id: 'advanced', name: 'Advanced', color: '#d69e2e' }
        ],
        category: BlogCategory.TYPESCRIPT,
        publishedAt: new Date('2024-11-20'),
        readingTime: 10,
        views: 890,
        likes: 67,
        featured: false,
        published: true
      },
      {
        id: '4',
        title: 'Docker Multi-Stage Builds para Angular + Spring Boot',
        slug: 'docker-multistage-angular-spring',
        excerpt: 'Optimiza tus imágenes Docker usando multi-stage builds para aplicaciones Angular y Spring Boot, reduciendo el tamaño hasta un 80%.',
        content: `
# Docker Multi-Stage Builds para Angular + Spring Boot

## Introducción

Las builds multi-stage nos permiten crear imágenes Docker optimizadas, reduciendo significativamente su tamaño.

## Dockerfile para Angular

\`\`\`dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Stage 2: Production
FROM nginx:alpine
COPY --from=builder /app/dist/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
\`\`\`

**Resultado**: De 1.2GB a 25MB 🎉

## Dockerfile para Spring Boot

\`\`\`dockerfile
# Stage 1: Build
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Production
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
\`\`\`

**Resultado**: De 850MB a 200MB 🚀

## Docker Compose Completo

\`\`\`yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
\`\`\`

## Mejores Prácticas

1. ✅ Usar imágenes alpine cuando sea posible
2. ✅ Aprovechar el caché de capas
3. ✅ Copiar solo lo necesario
4. ✅ Multi-stage builds siempre
5. ✅ .dockerignore configurado

## Conclusión

Multi-stage builds son esenciales para imágenes Docker eficientes en producción.
        `,
        coverImage: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1200&h=630&fit=crop',
        author: this.author,
        tags: [
          { id: 'docker', name: 'Docker', color: '#2496ed' },
          { id: 'devops', name: 'DevOps', color: '#ff6b6b' },
          { id: 'optimization', name: 'Optimization', color: '#38a169' }
        ],
        category: BlogCategory.DEVOPS,
        publishedAt: new Date('2024-11-05'),
        readingTime: 7,
        views: 1450,
        likes: 112,
        featured: true,
        published: true
      },
      {
        id: '5',
        title: 'RxJS: Operadores que Debes Dominar en 2024',
        slug: 'rxjs-operators-2024',
        excerpt: 'Los operadores RxJS más importantes para desarrollo Angular moderno: switchMap, combineLatest, debounceTime y más con ejemplos prácticos.',
        content: `
# RxJS: Operadores que Debes Dominar en 2024

## Introducción

RxJS es el corazón de la programación reactiva en Angular. Estos operadores son esenciales.

## switchMap

Cancela la suscripción anterior y cambia a una nueva.

\`\`\`typescript
searchInput$.pipe(
  debounceTime(300),
  switchMap(query => this.searchService.search(query))
).subscribe(results => console.log(results));
\`\`\`

## combineLatest

Combina múltiples observables y emite cuando cualquiera cambia.

\`\`\`typescript
combineLatest([
  this.user$,
  this.settings$,
  this.permissions$
]).pipe(
  map(([user, settings, permissions]) => ({
    user, settings, permissions
  }))
).subscribe(data => console.log(data));
\`\`\`

## debounceTime & distinctUntilChanged

Perfecto para búsquedas en tiempo real.

\`\`\`typescript
this.searchControl.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(term => this.api.search(term))
).subscribe(results => this.results = results);
\`\`\`

## catchError

Manejo elegante de errores.

\`\`\`typescript
this.http.get('/api/data').pipe(
  catchError(error => {
    console.error('Error:', error);
    return of([]);
  })
).subscribe(data => console.log(data));
\`\`\`

## takeUntil

Previene memory leaks.

\`\`\`typescript
private destroy$ = new Subject<void>();

ngOnInit() {
  this.data$.pipe(
    takeUntil(this.destroy$)
  ).subscribe(data => this.data = data);
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
\`\`\`

## Conclusión

Dominar estos operadores RxJS te convertirá en un desarrollador Angular más eficiente.
        `,
        coverImage: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=1200&h=630&fit=crop',
        author: this.author,
        tags: [
          { id: 'rxjs', name: 'RxJS', color: '#b7178c' },
          { id: 'angular', name: 'Angular', color: '#dd0031' },
          { id: 'reactive', name: 'Reactive', color: '#9f7aea' }
        ],
        category: BlogCategory.ANGULAR,
        publishedAt: new Date('2024-10-15'),
        readingTime: 9,
        views: 1780,
        likes: 134,
        featured: false,
        published: true
      }
    ];

    this.articlesSubject.next(articles);
  }

  // Obtener todos los artículos
  getAllArticles(): Observable<BlogArticle[]> {
    return this.articles$;
  }

  // Obtener artículos publicados
  getPublishedArticles(): Observable<BlogArticle[]> {
    return this.articles$.pipe(
      map(articles => articles.filter(article => article.published))
    );
  }

  // Obtener artículo por ID
  getArticleById(id: string): Observable<BlogArticle | undefined> {
    return this.articles$.pipe(
      map(articles => articles.find(article => article.id === id))
    );
  }

  // Obtener artículo por slug
  getArticleBySlug(slug: string): Observable<BlogArticle | undefined> {
    return this.articles$.pipe(
      map(articles => articles.find(article => article.slug === slug))
    );
  }

  // Obtener artículos destacados
  getFeaturedArticles(limit?: number): Observable<BlogArticle[]> {
    return this.articles$.pipe(
      map(articles => {
        const featured = articles.filter(article => article.featured && article.published);
        return limit ? featured.slice(0, limit) : featured;
      })
    );
  }

  // Filtrar artículos
  filterArticles(filters: BlogFilters): Observable<BlogArticle[]> {
    return this.articles$.pipe(
      map(articles => {
        let filtered = articles.filter(article => article.published);

        if (filters.category) {
          filtered = filtered.filter(article => article.category === filters.category);
        }

        if (filters.tag) {
          filtered = filtered.filter(article =>
            article.tags.some(tag => tag.id === filters.tag)
          );
        }

        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          filtered = filtered.filter(article =>
            article.title.toLowerCase().includes(query) ||
            article.excerpt.toLowerCase().includes(query) ||
            article.tags.some(tag => tag.name.toLowerCase().includes(query))
          );
        }

        if (filters.featured !== undefined) {
          filtered = filtered.filter(article => article.featured === filters.featured);
        }

        return filtered;
      })
    );
  }

  // Obtener artículos por categoría
  getArticlesByCategory(category: BlogCategory): Observable<BlogArticle[]> {
    return this.articles$.pipe(
      map(articles => articles.filter(article =>
        article.category === category && article.published
      ))
    );
  }

  // Obtener estadísticas
  getStats(): Observable<BlogStats> {
    return this.articles$.pipe(
      map(articles => {
        const published = articles.filter(a => a.published);
        const categoriesCount = new Map<BlogCategory, number>();
        const tagMap = new Map<string, BlogTag>();

        published.forEach(article => {
          // Contar categorías
          const count = categoriesCount.get(article.category) || 0;
          categoriesCount.set(article.category, count + 1);

          // Recolectar tags
          article.tags.forEach(tag => {
            if (!tagMap.has(tag.id)) {
              tagMap.set(tag.id, tag);
            }
          });
        });

        const totalViews = published.reduce((sum, a) => sum + (a.views || 0), 0);
        const popularTags = Array.from(tagMap.values()).slice(0, 10);

        return {
          totalArticles: published.length,
          totalViews,
          categoriesCount,
          popularTags
        };
      })
    );
  }

  // Obtener artículos relacionados
  getRelatedArticles(articleId: string, limit: number = 3): Observable<BlogArticle[]> {
    return this.getArticleById(articleId).pipe(
      map(article => {
        if (!article) return [];

        return this.articlesSubject.value
          .filter(a =>
            a.id !== articleId &&
            a.published &&
            (a.category === article.category ||
             a.tags.some(tag => article.tags.some(t => t.id === tag.id)))
          )
          .slice(0, limit);
      })
    );
  }

  // Incrementar vistas (simulado)
  incrementViews(articleId: string): void {
    const articles = this.articlesSubject.value;
    const article = articles.find(a => a.id === articleId);
    if (article && article.views !== undefined) {
      article.views++;
      this.articlesSubject.next([...articles]);
    }
  }

  // Toggle like (simulado)
  toggleLike(articleId: string): Observable<number> {
    const articles = this.articlesSubject.value;
    const article = articles.find(a => a.id === articleId);
    if (article && article.likes !== undefined) {
      article.likes++;
      this.articlesSubject.next([...articles]);
      return of(article.likes).pipe(delay(300));
    }
    return of(0);
  }
}
