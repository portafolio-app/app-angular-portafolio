import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbardComponent } from '../../shared/components/navbard/navbard.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { CardProyectosComponent } from '../../shared/components/Proyectos/card-proyectos/card-proyectos.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbardComponent, FooterComponent, CardProyectosComponent],
  template: `
    <app-navbard></app-navbard>
    <main class="pt-20 min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <app-card-proyectos 
          [showFilters]="true" 
          [projectsPerPage]="12"
          sectionTitle="Todos mis Proyectos"
          sectionDescription="Explora mi portafolio completo de soluciones digitales, desde aplicaciones web hasta sistemas IoT."
        ></app-card-proyectos>
      </div>
    </main>
    <app-footer></app-footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsPageComponent {}
