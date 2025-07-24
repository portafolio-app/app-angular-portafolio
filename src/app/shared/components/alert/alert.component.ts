// src/app/shared/components/alert/alert.component.ts
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostListener, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges, SimpleChanges, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AlertConfig {
  type: 'info' | 'success' | 'warning' | 'error' | 'development';
  title: string;
  message: string;
  icon?: string;
  showIcon?: boolean;
  dismissible?: boolean;
  autoClose?: number; // milisegundos
  actions?: AlertAction[];
  size?: 'sm' | 'md' | 'lg';
  position?: 'top' | 'center' | 'bottom';
  showProgress?: boolean;
}

export interface AlertAction {
  label: string;
  action: string;
  style?: 'primary' | 'secondary' | 'danger';
  icon?: string;
}

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy, OnChanges {
  @Input() config: AlertConfig | null = null;
  @Input() isVisible: boolean = false;
  @Output() actionClicked = new EventEmitter<string>();
  @Output() closed = new EventEmitter<string>();

  progressWidth: number = 100;
  showAnimation: boolean = false;
  private autoCloseTimer?: any;
  private progressTimer?: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.initializeAlert();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisible'] && changes['isVisible'].currentValue) {
      this.initializeAlert();
    }
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  private initializeAlert(): void {
    if (this.isVisible && this.config) {
      // Agregar clase al host para forzar visibilidad
      this.renderer.addClass(this.elementRef.nativeElement, 'active');
      this.renderer.addClass(this.elementRef.nativeElement, 'alert-visible');

      // Reset progress
      this.progressWidth = 100;

      // Pequeño delay para la animación de entrada
      setTimeout(() => {
        this.showAnimation = true;
        this.cdr.detectChanges();
      }, 10);

      if (this.config.autoClose && this.config.autoClose > 0) {
        this.startAutoClose();
      }
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapePress(event: KeyboardEvent): void {
    if (this.isVisible && this.config && this.config.dismissible !== false) {
      event.preventDefault();
      event.stopPropagation();
      this.closeAlert('escape');
    }
  }

  // MÉTODO CORREGIDO: Backdrop click
  onBackdropClick(event: Event): void {
    // Verificar que el click fue en el elemento con clase alert-backdrop
    const target = event.target as HTMLElement;
    const hasBackdropClass = target.classList.contains('alert-backdrop');

    if (hasBackdropClass && this.config && this.config.dismissible !== false) {
      console.log('🎯 Backdrop clicked - closing modal');
      this.closeAlert('backdrop');
    }
  }

  // MÉTODO CORREGIDO: Botón de cerrar
  handleCloseButton(event: Event): void {
    console.log('❌ Close button clicked');
    event.preventDefault();
    event.stopPropagation();

    // Verificar que el componente está visible antes de cerrar
    if (this.isVisible && this.config) {
      this.closeAlert('dismiss');
    }
  }

  // MÉTODO CORREGIDO: Botones de acción
  handleActionButton(action: string, event: Event): void {
    console.log('🔘 Action button clicked:', action);
    event.preventDefault();
    event.stopPropagation();

    // Verificar que el componente está visible
    if (!this.isVisible || !this.config) {
      console.warn('⚠️ Alert not visible or config missing');
      return;
    }

    // Emitir la acción ANTES de cerrar
    this.actionClicked.emit(action);

    // Cerrar después de un pequeño delay para permitir que se procese la acción
    setTimeout(() => {
      this.closeAlert(action);
    }, 150);
  }

  // MÉTODO CORREGIDO: Cerrar alert
  closeAlert(reason: string): void {
    console.log('🔒 Closing alert with reason:', reason);

    // Verificar que aún está visible
    if (!this.isVisible) {
      console.log('⚠️ Alert already closed');
      return;
    }

    // Detener animación y remover clases del host
    this.showAnimation = false;
    this.renderer.removeClass(this.elementRef.nativeElement, 'active');
    this.renderer.removeClass(this.elementRef.nativeElement, 'alert-visible');
    this.clearTimers();
    this.cdr.detectChanges();

    // Emitir cierre después de la animación
    setTimeout(() => {
      this.closed.emit(reason);
    }, 300);
  }

  private startAutoClose(): void {
    if (!this.config || !this.config.autoClose) return;

    // Timer para cerrar automáticamente
    this.autoCloseTimer = setTimeout(() => {
      this.closeAlert('timeout');
    }, this.config.autoClose);

    // Timer para la barra de progreso
    if (this.config.showProgress) {
      const interval = 50; // Actualizar cada 50ms
      const steps = this.config.autoClose / interval;
      const decrement = 100 / steps;

      this.progressTimer = setInterval(() => {
        this.progressWidth = Math.max(0, this.progressWidth - decrement);
        this.cdr.detectChanges();
        if (this.progressWidth <= 0) {
          clearInterval(this.progressTimer);
        }
      }, interval);
    }
  }

  private clearTimers(): void {
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
      this.autoCloseTimer = undefined;
    }
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
      this.progressTimer = undefined;
    }
  }

  // Métodos para obtener clases CSS dinámicas
  getPositionClass(): string {
    if (!this.config) return 'items-center';

    const position = this.config.position || 'center';
    const positionClasses: Record<string, string> = {
      'top': 'items-start pt-20',
      'center': 'items-center',
      'bottom': 'items-end pb-20'
    };
    return positionClasses[position];
  }

  getSizeClass(): string {
    if (!this.config) return 'max-w-md';

    const size = this.config.size || 'md';
    const sizeClasses: Record<string, string> = {
      'sm': 'max-w-sm',
      'md': 'max-w-md',
      'lg': 'max-w-lg'
    };
    return sizeClasses[size];
  }

  getAlertClasses(): string {
    if (!this.config) return 'border-blue-200 dark:border-blue-700';

    const type = this.config.type;
    const borderClasses: Record<string, string> = {
      'info': 'border-blue-200 dark:border-blue-700',
      'success': 'border-green-200 dark:border-green-700',
      'warning': 'border-yellow-200 dark:border-yellow-700',
      'error': 'border-red-200 dark:border-red-700',
      'development': 'border-emerald-200 dark:border-emerald-700'
    };
    return borderClasses[type] || borderClasses['info'];
  }

  getHeaderClass(): string {
    if (!this.config) return 'bg-blue-50 dark:bg-blue-900/20';

    const type = this.config.type;
    const headerClasses: Record<string, string> = {
      'info': 'bg-blue-50 dark:bg-blue-900/20',
      'success': 'bg-green-50 dark:bg-green-900/20',
      'warning': 'bg-yellow-50 dark:bg-yellow-900/20',
      'error': 'bg-red-50 dark:bg-red-900/20',
      'development': 'bg-emerald-50 dark:bg-emerald-900/20'
    };
    return headerClasses[type] || headerClasses['info'];
  }

  getIconClass(): string {
    if (!this.config) return 'fas fa-info-circle';

    if (this.config.icon) return this.config.icon;

    const type = this.config.type;
    const iconClasses: Record<string, string> = {
      'info': 'fas fa-info-circle',
      'success': 'fas fa-check-circle',
      'warning': 'fas fa-exclamation-triangle',
      'error': 'fas fa-times-circle',
      'development': 'fas fa-code'
    };
    return iconClasses[type] || iconClasses['info'];
  }

  getIconBackgroundClass(): string {
    if (!this.config) return 'bg-blue-100 dark:bg-blue-800';

    const type = this.config.type;
    const bgClasses: Record<string, string> = {
      'info': 'bg-blue-100 dark:bg-blue-800',
      'success': 'bg-green-100 dark:bg-green-800',
      'warning': 'bg-yellow-100 dark:bg-yellow-800',
      'error': 'bg-red-100 dark:bg-red-800',
      'development': 'bg-emerald-100 dark:bg-emerald-800'
    };
    return bgClasses[type] || bgClasses['info'];
  }

  getIconColorClass(): string {
    if (!this.config) return 'text-blue-600 dark:text-blue-400';

    const type = this.config.type;
    const colorClasses: Record<string, string> = {
      'info': 'text-blue-600 dark:text-blue-400',
      'success': 'text-green-600 dark:text-green-400',
      'warning': 'text-yellow-600 dark:text-yellow-400',
      'error': 'text-red-600 dark:text-red-400',
      'development': 'text-emerald-600 dark:text-emerald-400'
    };
    return colorClasses[type] || colorClasses['info'];
  }

  getTitleColorClass(): string {
    if (!this.config) return 'text-blue-900 dark:text-blue-100';

    const type = this.config.type;
    const titleClasses: Record<string, string> = {
      'info': 'text-blue-900 dark:text-blue-100',
      'success': 'text-green-900 dark:text-green-100',
      'warning': 'text-yellow-900 dark:text-yellow-100',
      'error': 'text-red-900 dark:text-red-100',
      'development': 'text-emerald-900 dark:text-emerald-100'
    };
    return titleClasses[type] || titleClasses['info'];
  }

  getMessageColorClass(): string {
    if (!this.config) return 'text-blue-700 dark:text-blue-300';

    const type = this.config.type;
    const messageClasses: Record<string, string> = {
      'info': 'text-blue-700 dark:text-blue-300',
      'success': 'text-green-700 dark:text-green-300',
      'warning': 'text-yellow-700 dark:text-yellow-300',
      'error': 'text-red-700 dark:text-red-300',
      'development': 'text-emerald-700 dark:text-emerald-300'
    };
    return messageClasses[type] || messageClasses['info'];
  }

  getProgressBarClass(): string {
    if (!this.config) return 'bg-blue-500';

    const type = this.config.type;
    const progressClasses: Record<string, string> = {
      'info': 'bg-blue-500',
      'success': 'bg-green-500',
      'warning': 'bg-yellow-500',
      'error': 'bg-red-500',
      'development': 'bg-emerald-500'
    };
    return progressClasses[type] || progressClasses['info'];
  }

  getActionButtonClass(style: string): string {
    const buttonClasses: Record<string, string> = {
      'primary': 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500',
      'secondary': 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 focus:ring-gray-500',
      'danger': 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
    };
    return `${buttonClasses[style] || buttonClasses['secondary']} focus:outline-none focus:ring-2 focus:ring-offset-2`;
  }

  formatMessage(message: string): string {
    return message.replace(/\n/g, '<br>');
  }
}
