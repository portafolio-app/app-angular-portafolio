import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbard',
  standalone: true,
  imports: [CommonModule, RouterModule,],
  templateUrl: './navbard.component.html'
})
export class NavbardComponent  {

  isMenuOpen: boolean = false;
  showContent: boolean = false;

  @Input() isDarkMode!: boolean;
  @Output() themeToggle = new EventEmitter<void>();

  toggleTheme() {
    this.themeToggle.emit();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  }

