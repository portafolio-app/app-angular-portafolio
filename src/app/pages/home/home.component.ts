import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { NavbardComponent } from '../../shared/components/navbard/navbard.component';
import { ThemeService } from '../../core/services/ThemeService';
import { AboutMeComponent } from '../../shared/components/about-me/about-me.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { StackTecnologicoComponent } from '../../shared/components/stack-tecnologico/stack-tecnologico.component';
import { HeroComponent } from '../../shared/components/hero/hero.component';
import { ExperienciaComponent } from '../../shared/components/experiencia/experiencia.component';
import { CertificacionesComponent } from '../../shared/components/certificaciones/certificaciones.component';

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    NavbardComponent,
    HeroComponent,
    AboutMeComponent,
    CertificacionesComponent,
    FooterComponent,
    StackTecnologicoComponent,
    ExperienciaComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  isDarkMode = false;
  private themeSubscription?: Subscription;

  constructor(
    private themeService: ThemeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.themeSubscription = this.themeService.isDarkMode$.subscribe((isDarkMode) => {
      this.isDarkMode = isDarkMode;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
