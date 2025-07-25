// src/app/core/services/alert.service.ts - OPTIMIZADO PARA RESPONSIVE
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

  // Método principal para mostrar alertas con detección automática de tamaño
  showAlert(config: AlertConfig): void {
    // Detectar el mejor tamaño basado en el contenido y viewport
    const optimizedConfig = this.optimizeConfigForViewport(config);

    this.currentAlertSubject.next(optimizedConfig);
    this.isVisibleSubject.next(true);
  }

  // Método específico para el modal de desarrollo
  showDevelopmentAlert(): void {
    const developmentConfig: AlertConfig = {
      type: 'development',
      title: '👨‍💻 Disponible para Oportunidades',
      message: `¡Hola! 👋 Soy Jorge, desarrollador de software en búsqueda activa de oportunidades laborales y prácticas profesionales.

Este portafolio está en constante desarrollo. Algunas secciones pueden estar incompletas mientras añado nuevos proyectos y funcionalidades.

¿Tienes una oportunidad que podría encajar conmigo? ¡Me encantaría conocer más!`,
      showIcon: true,
      dismissible: true,
      autoClose: 0, // No auto-cerrar
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

  // Ocultar alerta
  hideAlert(): void {
    this.isVisibleSubject.next(false);
    // Limpiar después de la animación
    setTimeout(() => {
      this.currentAlertSubject.next(null);
    }, 500);
  }

  // Verificar si hay una alerta activa
  hasActiveAlert(): boolean {
    return this.isVisibleSubject.value && this.currentAlertSubject.value !== null;
  }

  // MÉTODO PRIVADO: Optimizar configuración según viewport
  private optimizeConfigForViewport(config: AlertConfig): AlertConfig {
    const optimizedConfig = { ...config };

    // Si no se especifica tamaño, detectar automáticamente
    if (!config.size) {
      optimizedConfig.size = this.getOptimalSize();
    }

    // Si no se especifica posición, detectar automáticamente
    if (!config.position) {
      optimizedConfig.position = this.getOptimalPosition();
    }

    // Optimizar acciones según el espacio disponible
    if (config.actions) {
      optimizedConfig.actions = this.optimizeActionsForViewport(config.actions);
    }

    return optimizedConfig;
  }

  // MÉTODO PRIVADO: Determinar tamaño óptimo según viewport
  private getOptimalSize(): 'sm' | 'md' | 'lg' | 'xl' {
    if (typeof window === 'undefined') return 'md';

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Móviles pequeños
    if (width < 375) return 'sm';

    // Móviles estándar
    if (width < 640) return 'sm';

    // Tablets portrait
    if (width < 768) return 'md';

    // Tablets landscape y pantallas medianas
    if (width < 1024) return 'md';

    // Laptops
    if (width < 1280) return 'lg';

    // Pantallas grandes
    if (width < 1536) return 'lg';

    // Pantallas extra grandes
    return 'xl';
  }

  // MÉTODO PRIVADO: Determinar posición óptima según viewport
  private getOptimalPosition(): 'top' | 'center' | 'bottom' {
    if (typeof window === 'undefined') return 'center';

    const height = window.innerHeight;
    const width = window.innerWidth;

    // En landscape mobile, usar center para mejor visibilidad
    if (height < 600 && width > height) {
      return 'center';
    }

    // En pantallas muy bajas, usar center
    if (height < 500) {
      return 'center';
    }

    // Para móviles portrait, center es mejor
    if (width < 640) {
      return 'center';
    }

    // Para pantallas más grandes, center sigue siendo óptimo
    return 'center';
  }

  // MÉTODO PRIVADO: Optimizar acciones según viewport
  private optimizeActionsForViewport(actions: any[]): any[] {
    if (typeof window === 'undefined') return actions;

    const width = window.innerWidth;

    // En móviles muy pequeños, limitar número de acciones visibles
    if (width < 375 && actions.length > 3) {
      // Mantener las 3 acciones más importantes
      return actions.slice(0, 3).concat([
        {
          label: 'Más...',
          action: 'show_more',
          style: 'secondary',
          icon: 'fas fa-ellipsis-h'
        }
      ]);
    }

    // En móviles estándar, máximo 4 acciones
    if (width < 640 && actions.length > 4) {
      return actions.slice(0, 4);
    }

    return actions;
  }

  // Métodos de conveniencia para diferentes tipos de alertas
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

  // Método para confirmar acciones críticas
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

  // Utilidad para detectar si es dispositivo móvil
  private isMobile(): boolean {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  }

  // Utilidad para detectar si es tablet
  private isTablet(): boolean {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= 768 && window.innerWidth < 1024;
  }

  // Utilidad para detectar orientación landscape en móvil
  private isMobileLandscape(): boolean {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 1024 && window.innerWidth > window.innerHeight;
  }
}
