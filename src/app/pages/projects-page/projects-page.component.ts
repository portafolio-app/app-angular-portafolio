import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbardComponent } from '../../shared/components/navbard/navbard.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { CardProyectosComponent } from '../../shared/components/Proyectos/card-proyectos/card-proyectos.component';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../core/services/ThemeService';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbardComponent, FooterComponent, CardProyectosComponent],
  template: `
    <app-navbard [isDarkMode]="isDarkMode" (themeToggle)="toggleTheme()"></app-navbard>
    <div class="lg:pl-60">
    <main class="container-ed pt-20 lg:pt-12 pb-16 min-h-screen">
      <header class="mb-8">
        <a routerLink="/" class="inline-flex items-center gap-2 text-[0.82rem] link-ed mb-5">
          <i class="fas fa-arrow-left text-xs"></i> Inicio
        </a>
        <h1 style="font-size: clamp(1.9rem, 4vw, 2.75rem);">Todos mis proyectos</h1>
        <p class="mt-3 text-[0.95rem]" style="color: var(--text-muted); max-width: 42rem;">
          Portafolio completo de soluciones: aplicaciones web, móviles, sistemas backend e IoT.
        </p>
      </header>
      <app-card-proyectos
        [showFilters]="true"
        [projectsPerPage]="12"
        sectionTitle="Todos mis Proyectos"
        sectionDescription="Explora mi portafolio completo de soluciones digitales, desde aplicaciones web hasta sistemas IoT."
      ></app-card-proyectos>
    </main>
    <div class="container-ed pb-16">
      <app-footer></app-footer>
    </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsPageComponent implements OnInit {
  isDarkMode: boolean = false;

  constructor(
    private themeService: ThemeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((isDarkMode) => {
      this.isDarkMode = isDarkMode;
      this.cdr.detectChanges();
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
