import { Component, EventEmitter, Inject, Input, Output, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/ThemeService';
@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.component.html'
})
export class FooterComponent {

  @Input() isDarkMode: boolean = false;
  @Output() themeToggle = new EventEmitter<void>();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private themeService: ThemeService
  ) {}

ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((isDarkMode) => {
      this.isDarkMode = isDarkMode;
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
