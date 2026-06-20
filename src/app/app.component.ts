import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ViewportScroller } from '@angular/common';
import { FlowbiteService } from './flowbite.service';
import { ThemeService } from './core/services/ThemeService';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'portafolio_1.0_jcv';

  constructor(
    private flowbiteService: FlowbiteService,
    @Inject(PLATFORM_ID) private platformId: object,
    public router: Router,
    private themeService: ThemeService,
    private viewportScroller: ViewportScroller
  ) {
    // Scroll al inicio en cada navegación
    if (isPlatformBrowser(this.platformId)) {
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        this.viewportScroller.scrollToPosition([0, 0]);
      });
    }
  }

  async ngOnInit(): Promise<void> {
    // ThemeService es la única fuente de verdad del tema (aplica la clase
    // .dark en el constructor leyendo localStorage / preferencia del sistema).
    await this.flowbiteService.loadFlowbite();
  }
}
