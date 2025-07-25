import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlertConfig } from '../../shared/components/alert/alert.component';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private currentAlertSubject = new BehaviorSubject<AlertConfig | null>(null);
  private isVisibleSubject = new BehaviorSubject<boolean>(false);

  public currentAlert$ = this.currentAlertSubject.asObservable();
  public isVisible$ = this.isVisibleSubject.asObservable();

  constructor() {}

  showAlert(config: AlertConfig): void {
    const optimizedConfig = this.optimizeConfigForViewport(config);
    this.currentAlertSubject.next(optimizedConfig);
    this.isVisibleSubject.next(true);
  }

  showDevelopmentAlert(): void {
    const developmentConfig: AlertConfig = {
      type: 'development',
      title: '👨‍💻 Disponible para Oportunidades',
      message: `¡Hola! 👋 Soy Jorge, desarrollador de software en búsqueda activa de oportunidades laborales y prácticas profesionales.

Este portafolio está en constante desarrollo. Algunas secciones pueden estar incompletas mientras añado nuevos proyectos y funcionalidades.

¿Tienes una oportunidad que podría encajar conmigo? ¡Me encantaría conocer más!`,
      showIcon: true,
      dismissible: true,
      autoClose: 0,
      showProgress: false,
      size: this.getOptimalSize(),
      position: 'center',
      actions: [
        {
          label: 'Ver Proyectos',
          action: 'view_available',
          style: 'primary',
          icon: 'fas fa-code'
        },
        {
          label: 'LinkedIn',
          action: 'linkedin',
          style: 'primary',
          icon: 'fab fa-linkedin'
        },
        {
          label: 'GitHub',
          action: 'github',
          style: 'secondary',
          icon: 'fab fa-github'
        }
      ]
    };

    this.showAlert(developmentConfig);
  }

  hideAlert(): void {
    this.isVisibleSubject.next(false);
    setTimeout(() => {
      this.currentAlertSubject.next(null);
    }, 100);
  }

  hasActiveAlert(): boolean {
    const hasAlert = this.currentAlertSubject.value !== null;
    const isVisible = this.isVisibleSubject.value;
    return hasAlert || isVisible;
  }

  forceReset(): void {
    this.isVisibleSubject.next(false);
    this.currentAlertSubject.next(null);
  }

  private optimizeConfigForViewport(config: AlertConfig): AlertConfig {
    const optimizedConfig = { ...config };

    if (!config.size) {
      optimizedConfig.size = this.getOptimalSize();
    }

    if (!config.position) {
      optimizedConfig.position = this.getOptimalPosition();
    }

    if (config.actions) {
      optimizedConfig.actions = this.optimizeActionsForViewport(config.actions);
    }

    return optimizedConfig;
  }

  private getOptimalSize(): 'sm' | 'md' | 'lg' | 'xl' {
    if (typeof window === 'undefined') return 'md';

    const width = window.innerWidth;

    if (width < 375) return 'sm';
    if (width < 640) return 'sm';
    if (width < 768) return 'md';
    if (width < 1024) return 'md';
    if (width < 1280) return 'lg';
    if (width < 1536) return 'lg';

    return 'xl';
  }

  private getOptimalPosition(): 'top' | 'center' | 'bottom' {
    if (typeof window === 'undefined') return 'center';

    const height = window.innerHeight;
    const width = window.innerWidth;

    if (height < 600 && width > height) {
      return 'center';
    }

    if (height < 500) {
      return 'center';
    }

    if (width < 640) {
      return 'center';
    }

    return 'center';
  }

  private optimizeActionsForViewport(actions: any[]): any[] {
    if (typeof window === 'undefined') return actions;

    const width = window.innerWidth;

    if (width < 375 && actions.length > 3) {
      return actions.slice(0, 3).concat([
        {
          label: 'Más...',
          action: 'show_more',
          style: 'secondary',
          icon: 'fas fa-ellipsis-h'
        }
      ]);
    }

    if (width < 640 && actions.length > 4) {
      return actions.slice(0, 4);
    }

    return actions;
  }

  showSuccess(title: string, message: string, autoClose: number = 5000): void {
    this.showAlert({
      type: 'success',
      title,
      message,
      autoClose,
      showProgress: true,
      dismissible: true
    });
  }

  showError(title: string, message: string): void {
    this.showAlert({
      type: 'error',
      title,
      message,
      dismissible: true,
      autoClose: 0
    });
  }

  showWarning(title: string, message: string, autoClose: number = 7000): void {
    this.showAlert({
      type: 'warning',
      title,
      message,
      autoClose,
      showProgress: true,
      dismissible: true
    });
  }

  showInfo(title: string, message: string, autoClose: number = 5000): void {
    this.showAlert({
      type: 'info',
      title,
      message,
      autoClose,
      showProgress: true,
      dismissible: true
    });
  }

  showConfirmation(
    title: string,
    message: string,
    confirmAction: string = 'confirm',
    cancelAction: string = 'cancel'
  ): void {
    this.showAlert({
      type: 'warning',
      title,
      message,
      dismissible: true,
      autoClose: 0,
      actions: [
        {
          label: 'Confirmar',
          action: confirmAction,
          style: 'danger',
          icon: 'fas fa-check'
        },
        {
          label: 'Cancelar',
          action: cancelAction,
          style: 'secondary',
          icon: 'fas fa-times'
        }
      ]
    });
  }

  private isMobile(): boolean {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  }

  private isTablet(): boolean {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= 768 && window.innerWidth < 1024;
  }

  private isMobileLandscape(): boolean {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 1024 && window.innerWidth > window.innerHeight;
  }
}
