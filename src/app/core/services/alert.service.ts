// src/app/core/services/alert.service.ts
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
   * Muestra una alerta de información
   */
  showInfo(title: string, message: string, options?: Partial<AlertConfig>): void {
    this.showAlert({
      type: 'info',
      title,
      message,
      icon: 'fas fa-info-circle',
      ...options
    });
  }

  /**
   * Muestra una alerta de éxito
   */
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

  /**
   * Muestra una alerta de advertencia
   */
  showWarning(title: string, message: string, options?: Partial<AlertConfig>): void {
    this.showAlert({
      type: 'warning',
      title,
      message,
      icon: 'fas fa-exclamation-triangle',
      ...options
    });
  }

  /**
   * Muestra una alerta de error
   */
  showError(title: string, message: string, options?: Partial<AlertConfig>): void {
    this.showAlert({
      type: 'error',
      title,
      message,
      icon: 'fas fa-times-circle',
      ...options
    });
  }

  /**
   * Muestra una alerta específica para proyectos en desarrollo
   */
  showDevelopmentAlert(): void {
    const actions: AlertAction[] = [
      {
        label: 'Ver Proyectos Disponibles',
        action: 'view_available',
        style: 'primary',
        icon: 'fas fa-eye'
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
      title: '🚧 Portafolio en Desarrollo',
      message: `
        <strong>¡Hola! 👋</strong><br><br>

        Mi portafolio está en constante evolución. Actualmente estoy:

        <ul class="mt-3 space-y-2 list-disc list-inside">
          <li><strong>Documentando proyectos</strong> para hacerlos públicos</li>
          <li><strong>Preparando demos en vivo</strong> funcionales</li>
          <li><strong>Limpiando código</strong> para repositorios públicos</li>
          <li><strong>Creando tutoriales</strong> y casos de estudio</li>
        </ul>

        <div class="mt-4 p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
          <p class="text-sm"><strong>📅 Próximas actualizaciones:</strong> Cada 2-3 semanas</p>
        </div>

        Mientras tanto, puedes ver los proyectos disponibles o contactarme directamente.
      `,
      icon: 'fas fa-hammer',
      size: 'lg',
      actions,
      showProgress: false,
      dismissible: true
    });
  }

  /**
   * Muestra una alerta de bienvenida
   */
  showWelcomeAlert(): void {
    const actions: AlertAction[] = [
      {
        label: 'Explorar Proyectos',
        action: 'explore',
        style: 'primary',
        icon: 'fas fa-rocket'
      },
      {
        label: 'Sobre Mí',
        action: 'about',
        style: 'secondary',
        icon: 'fas fa-user'
      }
    ];

    this.showAlert({
      type: 'info',
      title: '👋 ¡Bienvenido a mi Portafolio!',
      message: `
        Soy <strong>Jorge Luis Castillo Vega</strong>, desarrollador de software apasionado por crear soluciones tecnológicas innovadoras.

        <div class="mt-4 space-y-2">
          <p>🎯 <strong>Especialidades:</strong></p>
          <ul class="ml-4 space-y-1 text-sm">
            <li>• Desarrollo Full Stack</li>
            <li>• Aplicaciones Móviles</li>
            <li>• Sistemas IoT</li>
            <li>• APIs y Microservicios</li>
          </ul>
        </div>

        <p class="mt-4 text-sm opacity-75">
          <em>Explora mis proyectos y no dudes en contactarme para colaboraciones.</em>
        </p>
      `,
      icon: 'fas fa-code',
      size: 'lg',
      actions,
      autoClose: 10000,
      showProgress: true
    });
  }

  /**
   * Muestra una alerta de contacto
   */
  showContactAlert(): void {
    const actions: AlertAction[] = [
      {
        label: 'Enviar Email',
        action: 'email',
        style: 'primary',
        icon: 'fas fa-envelope'
      },
      {
        label: 'LinkedIn',
        action: 'linkedin',
        style: 'secondary',
        icon: 'fab fa-linkedin'
      },
      {
        label: 'GitHub',
        action: 'github',
        style: 'secondary',
        icon: 'fab fa-github'
      }
    ];

    this.showAlert({
      type: 'info',
      title: '📞 ¡Conectemos!',
      message: `
        <p>Me encanta colaborar en proyectos interesantes y conocer profesionales del sector.</p>

        <div class="mt-4 space-y-3">
          <div class="flex items-center space-x-3">
            <i class="fas fa-envelope text-green-600"></i>
            <span>casvejorge1@gmail.com</span>
          </div>
          <div class="flex items-center space-x-3">
            <i class="fas fa-map-marker-alt text-blue-600"></i>
            <span>Trujillo, La Libertad, Perú</span>
          </div>
          <div class="flex items-center space-x-3">
            <i class="fas fa-clock text-purple-600"></i>
            <span>Disponible para proyectos</span>
          </div>
        </div>

        <p class="mt-4 text-sm opacity-75">
          <em>Respondo usualmente en menos de 24 horas.</em>
        </p>
      `,
      icon: 'fas fa-handshake',
      size: 'md',
      actions
    });
  }

  /**
   * Muestra una alerta personalizada
   */
  showAlert(config: AlertConfig): void {
    // Configuración por defecto
    const defaultConfig: Partial<AlertConfig> = {
      showIcon: true,
      dismissible: true,
      size: 'md',
      position: 'center',
      showProgress: false
    };

    const finalConfig = { ...defaultConfig, ...config };

    this.alertSubject.next(finalConfig as AlertConfig);
    this.isVisibleSubject.next(true);
  }

  /**
   * Oculta la alerta actual
   */
  hideAlert(): void {
    this.isVisibleSubject.next(false);

    // Limpiar la alerta después de la animación
    setTimeout(() => {
      this.alertSubject.next(null);
    }, 300);
  }

  /**
   * Maneja las acciones de la alerta
   */
  handleAction(action: string): void {
    switch (action) {
      case 'explore':
        this.scrollToSection('proyectos');
        break;
      case 'about':
        this.scrollToSection('tecnologias');
        break;
      case 'contact':
      case 'email':
        window.open('mailto:casvejorge1@gmail.com', '_blank');
        break;
      case 'linkedin':
        window.open('https://www.linkedin.com/in/jcastillov15', '_blank');
        break;
      case 'github':
        window.open('https://github.com/VCL-tt', '_blank');
        break;
      case 'view_available':
        this.scrollToSection('proyectos');
        break;
      default:
        console.log('Acción no reconocida:', action);
    }

    this.hideAlert();
  }

  /**
   * Scroll suave a una sección
   */
  private scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 80;
      const elementPosition = element.offsetTop - navbarHeight;

      window.scrollTo({
        top: Math.max(0, elementPosition),
        behavior: 'smooth'
      });
    }
  }

  /**
   * Verifica si hay una alerta activa
   */
  hasActiveAlert(): boolean {
    return this.isVisibleSubject.value;
  }
}
