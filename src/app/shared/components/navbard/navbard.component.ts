import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-navbard',
  standalone: true,
  imports: [CommonModule, RouterModule,],
  templateUrl: './navbard.component.html',
  styleUrls: ['./navbard.component.css'],
})
export class NavbardComponent  {
 
  isMenuOpen: boolean = false;
  showContent: boolean = false;  // Variable para controlar la visibilidad del contenido

  @Input() isDarkMode!: boolean;
  @Output() themeToggle = new EventEmitter<void>();

  // Método para cambiar el tema (oscuro/claro)
  toggleTheme() {
    this.themeToggle.emit();
  }

  // Método para abrir/cerrar el menú
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  }

