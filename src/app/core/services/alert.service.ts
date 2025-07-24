// src/app/core/services/alert.service.ts - CORREGIDO
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlertConfig, AlertAction } from '../../shared/components/alert/alert.component';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new BehaviorSubject<AlertConfig | null>(null);
  private isVisibleSubject = new BehaviorSubject<boolean>(false);

  constructor() {}

  // Observable para la alerta actual
  get currentAlert$(): Observable<AlertConfig | null> {
    return this.alertSubject.asObservable();
  }

  // Observable para la visibilidad
  get isVisible$(): Observable<boolean> {
    return this.isVisibleSubject.asObservable();
  }

  /**
   * Muestra una alerta específica para proyectos en desarrollo
   */
  showDevelopmentAlert(): void {
    const actions: AlertAction[] = [
      {
        label: 'Ver Proyectos',
        action: 'view_available',
        style: 'primary',
        icon: 'fas fa-folder-open'
      },
      {
        label: 'Sobre Mí',
        action: 'about',
        style: 'secondary',
        icon: 'fas fa-user'
      },
      {
        label: 'Contactar',
        action: 'contact',
        style: 'secondary',
        icon: 'fas fa-envelope'
      }
    ];

    this.showAlert({
      type: 'development',
      title: 'Portafolio en Evolución',
      message: `
        ¡Hola! 👋 Este portafolio está en <strong>constante desarrollo</strong> y mejora continua.

        🔧 <strong>Tecnologías utilizadas:</strong>
        <br>• Angular 18 + TypeScript
        <br>• Tailwind CSS + Responsive Design
        <br>• Componentes modulares y reutilizables
        <br>• Animaciones y transiciones fluidas

        ✨ <strong>Características destacadas:</strong>
        <br>• Modo oscuro/claro dinámico
        <br>• Optimizado para móviles y desktop
        <br>• Código limpio y escalable
        <br>• Experiencia de usuario moderna

        💡 ¿Te interesa colaborar o tienes alguna sugerencia?
        <br>¡Me encantaría conocer tu opinión!
      `,
      icon: 'fas fa-rocket',
      size: 'lg',
      actions,
      showProgress: false,
      dismissible: true
    });
  }

  /**
   * Muestra una alerta personalizada
   */
  showAlert(config: AlertConfig): void {
    console.log('🎯 AlertService: Showing alert', config);

    // Si ya hay una alerta visible, no mostrar otra
    if (this.isVisibleSubject.value) {
      console.log('⚠️ AlertService: Alert already visible, ignoring new request');
      return;
    }

    // Configuración por defecto
    const defaultConfig: Partial<AlertConfig> = {
      showIcon: true,
      dismissible: true,
      size: 'md',
      position: 'center',
      showProgress: false
    };

    const finalConfig = { ...defaultConfig, ...config };

    // Configurar la alerta
    this.alertSubject.next(finalConfig as AlertConfig);

    // Mostrar después de un pequeño delay
    setTimeout(() => {
      this.isVisibleSubject.next(true);
      console.log('✅ AlertService: Alert is now visible');
    }, 50);
  }

  /**
   * Oculta la alerta actual
   */
  hideAlert(): void {
    console.log('🔒 AlertService: Hiding alert');

    // Ocultar primero
    this.isVisibleSubject.next(false);

    // Limpiar la configuración después de la animación
    setTimeout(() => {
      this.alertSubject.next(null);
      console.log('✅ AlertService: Alert cleaned up');
    }, 300);
  }

  /**
   * Verifica si hay una alerta activa
   */
  hasActiveAlert(): boolean {
    return this.isVisibleSubject.value;
  }

  // Métodos de utilidad adicionales
  showInfo(title: string, message: string, options?: Partial<AlertConfig>): void {
    this.showAlert({
      type: 'info',
      title,
      message,
      icon: 'fas fa-info-circle',
      ...options
    });
  }

  showSuccess(title: string, message: string, options?: Partial<AlertConfig>): void {
    this.showAlert({
      type: 'success',
      title,
      message,
      icon: 'fas fa-check-circle',
      autoClose: 5000,
      showProgress: true,
      ...options
    });
  }

  showWarning(title: string, message: string, options?: Partial<AlertConfig>): void {
    this.showAlert({
      type: 'warning',
      title,
      message,
      icon: 'fas fa-exclamation-triangle',
      ...options
    });
  }

  showError(title: string, message: string, options?: Partial<AlertConfig>): void {
    this.showAlert({
      type: 'error',
      title,
      message,
      icon: 'fas fa-times-circle',
      ...options
    });
  }
}
