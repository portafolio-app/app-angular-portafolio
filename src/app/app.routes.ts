// src/app/app.routes.ts - ARREGLADO
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/start/start.component').then((m) => m.StartComponent),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },

  {
    path: 'project/:id',
    loadComponent: () =>
      import('./pages/project-detail/project-detail.component').then(
        (m) => m.ProjectDetailComponent
      ),
    title: 'Detalles del Proyecto',
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
