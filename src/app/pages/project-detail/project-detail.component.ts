// src/app/pages/project-detail/project-detail.component.ts - CORREGIDO FINAL
import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, catchError, of } from 'rxjs';

import {
  Project,
  ProjectsDataService,
} from '../../core/services/projects-data.service';
import { NavbardComponent } from '../../shared/components/navbard/navbard.component';
import {
  InfoCardComponent,
  ProjectLink,
  Technology,
} from '../../shared/components/Proyectos/info-card/info-card.component';
import { ThemeService } from '../../core/services/ThemeService';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, InfoCardComponent, NavbardComponent],
templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css',
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  project: Project | null = null;
  isLoading: boolean = true;
  error: string | null = null;
  isDarkMode: boolean = false;

  private readonly destroy$ = new Subject<void>();
  private isBrowser: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private projectsService: ProjectsDataService,
    private themeService: ThemeService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {

   this.themeService.isDarkMode$.subscribe((isDarkMode)=>{
    this.isDarkMode = isDarkMode;
   });

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const projectId = params['id'];
      if (projectId) {
        this.loadProject(projectId);
      } else {
        this.router.navigate(['/projects']);
      }
    });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadProject(id: string): void {
    this.isLoading = true;
    this.error = null;

    this.projectsService
      .getProjectById(id)
      .pipe(
        catchError((error) => {
          console.error('Error loading project:', error);
          this.error = 'Error al cargar el proyecto';
          this.isLoading = false;
          return of(undefined);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((project) => {
        if (project) {
          this.project = project;
        } else {
          this.error = 'Proyecto no encontrado';
        }
        this.isLoading = false;
      });
  }

  // ======== NAVEGACIÓN ========

  goBack(): void {
    this.location.back();
  }

  goToProjects(): void {
    this.router.navigate(['/projects']);
  }

  // ======== EVENT HANDLERS DEL INFO CARD ========

  onInfoCardLinkClicked(link: ProjectLink): void {
    this.handleLinkClick(link);
  }

  onInfoCardTechClicked(tech: Technology): void {
    console.log('Technology clicked:', tech);
  }

  private handleLinkClick(link: ProjectLink): void {
    if (!this.isBrowser || !link?.url) {
      return;
    }

    try {
      new URL(link.url);
      window.open(link.url, '_blank', 'noopener,noreferrer');
    } catch {
      console.error('Invalid URL:', link.url);
    }
  }
    toggleTheme():void{
    this.themeService.toggleTheme();
  }
}
