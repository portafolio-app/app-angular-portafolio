import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-promo-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './promo-popup.component.html',
  styleUrls: ['./promo-popup.component.css']
})
export class PromoPopupComponent implements OnInit {
  isVisible = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Always show on every page load after a short delay
      setTimeout(() => {
        this.isVisible = true;
        this.cdr.detectChanges();
      }, 800);
    }
  }

  dismiss(): void {
    this.isVisible = false;
    this.cdr.detectChanges();
  }

  openApp(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.open('http://app.167.86.80.167.sslip.io', '_blank');
    }
    this.dismiss();
  }
}
