import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule, ArrowLeft, Menu, X, Sun, Moon } from 'lucide-angular';
import { ThemeService } from '../../../../core/services/ThemeService';

@Component({
  selector: 'app-blog-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './blog-navbar.component.html',
  styleUrls: ['./blog-navbar.component.css']
})
export class BlogNavbarComponent {
  isMobileMenuOpen = false;
  isDarkMode = false;

  // Lucide Icons
  readonly ArrowLeft = ArrowLeft;
  readonly Menu = Menu;
  readonly X = X;
  readonly Sun = Sun;
  readonly Moon = Moon;

  @Output() backClicked = new EventEmitter<void>();

  constructor(
    private location: Location,
    private router: Router,
    private themeService: ThemeService
  ) {
    // Subscribe to theme changes
    this.themeService.isDarkMode$.subscribe(
      isDark => this.isDarkMode = isDark
    );
  }

  goBack(): void {
    this.backClicked.emit();
    // Si estamos en una página de detalle de blog, volver al blog
    // Si estamos en el blog principal, volver al home
    if (this.router.url.includes('/blog/') && !this.router.url.endsWith('/blog')) {
      this.router.navigate(['/blog']);
    } else {
      this.location.back();
    }
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  navigateHome(): void {
    this.router.navigate(['/']);
    this.closeMobileMenu();
  }

  navigateToBlog(): void {
    this.router.navigate(['/blog']);
    this.closeMobileMenu();
  }

  navigateToProjects(): void {
    this.router.navigate(['/'], { fragment: 'proyectos' });
    this.closeMobileMenu();
  }
}
