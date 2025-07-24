// src/app/shared/components/alert/alert.component.ts - SEPARADO
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostListener,
         ChangeDetectionStrategy, ChangeDetectorRef, OnChanges, SimpleChanges,
         ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AlertConfig {
  type: 'info' | 'success' | 'warning' | 'error' | 'development';
  title: string;
  message: string;
  icon?: string;
  showIcon?: boolean;
  dismissible?: boolean;
  autoClose?: number;
  actions?: AlertAction[];
  size?: 'sm' | 'md' | 'lg' | 'xl';
  position?: 'top' | 'center' | 'bottom';
  showProgress?: boolean;
}

export interface AlertAction {
  label: string;
  action: string;
  style?: 'primary' | 'secondary' | 'danger' | 'success';
  icon?: string;
}

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './alert.component.html',  // ✅ AHORA USA TU ARCHIVO HTML
  styleUrls: ['./alert.component.css']     // ✅ Y TU ARCHIVO CSS SI EXISTE
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
  isClosing: boolean = false;  // ✅ Hacer pública para usar en template

  constructor(
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.initializeAlert();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisible']) {
      if (changes['isVisible'].currentValue && !this.isClosing) {
        this.initializeAlert();
      } else if (!changes['isVisible'].currentValue) {
        this.cleanupAlert();
      }
    }
  }

  ngOnDestroy(): void {
    this.clearTimers();
    this.cleanupAlert();
  }

  private initializeAlert(): void {
    if (this.isVisible && this.config && !this.isClosing) {
      console.log('🎬 Initializing alert');

      // Reset estados
      this.isClosing = false;
      this.progressWidth = 100;

      // Configurar estilos del host
      this.renderer.setStyle(this.elementRef.nativeElement, 'pointer-events', 'auto');
      this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'block');

      // Activar animación después de un micro delay
      setTimeout(() => {
        if (this.isVisible && !this.isClosing) {
          this.showAnimation = true;
          this.cdr.detectChanges();
        }
      }, 10);

      if (this.config.autoClose && this.config.autoClose > 0) {
        this.startAutoClose();
      }
    }
  }

  private cleanupAlert(): void {
    console.log('🧹 Cleaning up alert');

    this.isClosing = true;
    this.showAnimation = false;
    this.clearTimers();

    // Limpiar estilos del host
    this.renderer.setStyle(this.elementRef.nativeElement, 'pointer-events', 'none');
    this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'none');

    this.cdr.detectChanges();
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapePress(event: KeyboardEvent): void {
    if (this.isVisible && this.config && this.config.dismissible !== false && !this.isClosing) {
      event.preventDefault();
      event.stopPropagation();
      this.closeAlert('escape');
    }
  }

  onBackdropClick(event: Event): void {
    if (this.isClosing) return;

    const target = event.target as HTMLElement;
    const currentTarget = event.currentTarget as HTMLElement;

    if (target === currentTarget && this.config && this.config.dismissible !== false) {
      console.log('🎯 Backdrop clicked - closing modal');
      this.closeAlert('backdrop');
    }
  }

  handleCloseButton(event: Event): void {
    if (this.isClosing) return;

    console.log('❌ Close button clicked');
    event.preventDefault();
    event.stopPropagation();

    if (this.isVisible && this.config) {
      this.closeAlert('dismiss');
    }
  }

  handleActionButton(action: string, event: Event): void {
    if (this.isClosing) return;

    console.log('🔘 Action button clicked:', action);
    event.preventDefault();
    event.stopPropagation();

    if (!this.isVisible || !this.config) {
      console.warn('⚠️ Alert not visible or config missing');
      return;
    }

    // Emitir la acción INMEDIATAMENTE
    this.actionClicked.emit(action);

    // Cerrar después de un pequeño delay
    setTimeout(() => {
      this.closeAlert(action);
    }, 100);
  }

  closeAlert(reason: string): void {
    if (this.isClosing) {
      console.log('⚠️ Alert is already closing');
      return;
    }

    console.log('🔒 Closing alert with reason:', reason);

    if (!this.isVisible) {
      console.log('⚠️ Alert already closed');
      return;
    }

    // Marcar como cerrando
    this.isClosing = true;

    // Iniciar animación de salida
    this.showAnimation = false;
    this.clearTimers();
    this.cdr.detectChanges();

    // Emitir cierre después de la animación
    setTimeout(() => {
      this.cleanupAlert();
      this.closed.emit(reason);

      // Reset estado después de emitir
      setTimeout(() => {
        this.isClosing = false;
      }, 100);
    }, 300);
  }

  private startAutoClose(): void {
    if (!this.config || !this.config.autoClose) return;

    this.autoCloseTimer = setTimeout(() => {
      if (!this.isClosing) {
        this.closeAlert('timeout');
      }
    }, this.config.autoClose);

    if (this.config.showProgress) {
      const interval = 50;
      const steps = this.config.autoClose / interval;
      const decrement = 100 / steps;

      this.progressTimer = setInterval(() => {
        if (this.isClosing) {
          clearInterval(this.progressTimer);
          return;
        }

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

  // MÉTODOS PARA CLASES TAILWIND DINÁMICAS
  getPositionClass(): string {
    if (!this.config) return 'items-center justify-center';
    const position = this.config.position || 'center';
    const positionClasses: Record<string, string> = {
      'top': 'items-start justify-center pt-20',
      'center': 'items-center justify-center',
      'bottom': 'items-end justify-center pb-20'
    };
    return positionClasses[position];
  }

  getSizeClass(): string {
    if (!this.config) return 'max-w-md';
    const size = this.config.size || 'md';
    const sizeClasses: Record<string, string> = {
      'sm': 'max-w-sm',
      'md': 'max-w-md',
      'lg': 'max-w-lg',
      'xl': 'max-w-xl'
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
      'development': 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20'
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
      'development': 'fas fa-rocket'
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
      'development': 'bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-800 dark:to-teal-800'
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
      'development': 'bg-gradient-to-r from-emerald-500 to-teal-500'
    };
    return progressClasses[type] || progressClasses['info'];
  }

  getActionButtonClass(style: string): string {
    const baseClasses = 'transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2';
    const buttonClasses: Record<string, string> = {
      'primary': `${baseClasses} bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500 shadow-lg hover:shadow-xl`,
      'secondary': `${baseClasses} bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 focus:ring-gray-500 border border-gray-300 dark:border-gray-600`,
      'danger': `${baseClasses} bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-lg hover:shadow-xl`,
      'success': `${baseClasses} bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 shadow-lg hover:shadow-xl`
    };
    return buttonClasses[style] || buttonClasses['secondary'];
  }

  formatMessage(message: string): string {
    return message.replace(/\n/g, '<br>');
  }
}
