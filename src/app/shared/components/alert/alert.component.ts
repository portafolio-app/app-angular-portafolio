import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  HostListener,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges,
  ElementRef,
  Renderer2,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

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
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent implements OnInit, OnDestroy, OnChanges {
  @Input() config: AlertConfig | null = null;
  @Input() isVisible: boolean = false;
  @Output() actionClicked = new EventEmitter<string>();
  @Output() closed = new EventEmitter<string>();

  progressWidth: number = 100;
  showAnimation: boolean = false;
  isClosing: boolean = false;

  private autoCloseTimer?: any;
  private progressTimer?: any;
  private savedScrollPosition: number = 0;

  constructor(
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
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
      this.isClosing = false;
      this.progressWidth = 100;

      this.handleBodyScrollLock(true);

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
    this.isClosing = true;
    this.showAnimation = false;
    this.clearTimers();
    this.handleBodyScrollLock(false);
    this.cdr.detectChanges();
  }

  private handleBodyScrollLock(isVisible: boolean): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const body = document.body;
    const html = document.documentElement;

    if (isVisible) {
      this.savedScrollPosition =
        window.pageYOffset || document.documentElement.scrollTop;
      body.style.position = 'fixed';
      body.style.top = `-${this.savedScrollPosition}px`;
      body.style.left = '0';
      body.style.right = '0';
      body.style.width = '100%';
      body.style.overflow = 'hidden';
      html.style.overflow = 'hidden';
    } else {
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.width = '';
      body.style.overflow = '';
      html.style.overflow = '';

      if (this.savedScrollPosition >= 0) {
        window.scrollTo(0, this.savedScrollPosition);
        this.savedScrollPosition = 0;
      }
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapePress(event: KeyboardEvent): void {
    if (
      this.isVisible &&
      this.config &&
      this.config.dismissible !== false &&
      !this.isClosing
    ) {
      event.preventDefault();
      event.stopPropagation();
      this.handleClose('escape');
    }
  }

  onBackdropClick(event: Event): void {
    if (this.isClosing) return;

    const target = event.target as HTMLElement;
    const currentTarget = event.currentTarget as HTMLElement;

    if (
      target === currentTarget &&
      this.config &&
      this.config.dismissible !== false
    ) {
      this.handleClose('backdrop');
    }
  }

  handleCloseButton(event: Event): void {
    if (this.isClosing) return;

    event.preventDefault();
    event.stopPropagation();

    if (!this.isVisible || !this.config) return;

    this.handleClose('dismiss');
  }

  handleActionButton(action: string, event: Event): void {
    if (this.isClosing) return;

    event.preventDefault();
    event.stopPropagation();

    if (!this.isVisible || !this.config) return;

    this.actionClicked.emit(action);

    setTimeout(() => {
      this.handleClose(action);
    }, 100);
  }

  private handleClose(reason: string): void {
    if (this.isClosing) return;

    this.isClosing = true;
    this.closed.emit(reason);
    this.showAnimation = false;
    this.clearTimers();
    this.cdr.detectChanges();

    setTimeout(() => {
      this.cleanupAlert();
      setTimeout(() => {
        this.isClosing = false;
      }, 50);
    }, 300);
  }

  private startAutoClose(): void {
    if (!this.config || !this.config.autoClose) return;

    this.autoCloseTimer = setTimeout(() => {
      if (!this.isClosing) {
        this.handleClose('timeout');
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

  getPositionClass(): string {
    if (!this.config) return 'items-center justify-center';
    const position = this.config.position || 'center';
    const classes = {
      top: 'items-start justify-center pt-2 sm:pt-4 md:pt-6',
      center: 'items-center justify-center',
      bottom: 'items-end justify-center pb-2 sm:pb-4 md:pb-6',
    };
    return classes[position];
  }

  getSizeClass(): string {
    if (!this.config) return 'w-full max-w-md mx-4';

    const size = this.config.size || 'md';
    const baseClasses = 'w-full mx-2 sm:mx-4';

    const sizeClasses = {
      sm: `${baseClasses} max-w-sm sm:max-w-md`,
      md: `${baseClasses} max-w-md sm:max-w-lg lg:max-w-xl`,
      lg: `${baseClasses} max-w-lg sm:max-w-xl lg:max-w-2xl`,
      xl: `${baseClasses} max-w-xl sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl`,
    };

    return sizeClasses[size];
  }

  getAlertClasses(): string {
    if (!this.config) return 'border-blue-200 dark:border-blue-700';
    const borders = {
      info: 'border-blue-200 dark:border-blue-700',
      success: 'border-green-200 dark:border-green-700',
      warning: 'border-yellow-200 dark:border-yellow-700',
      error: 'border-red-200 dark:border-red-700',
      development: 'border-emerald-200 dark:border-emerald-700',
    };
    return borders[this.config.type] || borders.info;
  }

  getHeaderClass(): string {
    if (!this.config) return 'bg-blue-50 dark:bg-blue-900/20';
    const headers = {
      info: 'bg-blue-50 dark:bg-blue-900/20',
      success: 'bg-green-50 dark:bg-green-900/20',
      warning: 'bg-yellow-50 dark:bg-yellow-900/20',
      error: 'bg-red-50 dark:bg-red-900/20',
      development:
        'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20',
    };
    return headers[this.config.type] || headers.info;
  }

  getIconClass(): string {
    if (!this.config) return 'fas fa-info-circle';
    if (this.config.icon) return this.config.icon;
    const icons = {
      info: 'fas fa-info-circle',
      success: 'fas fa-check-circle',
      warning: 'fas fa-exclamation-triangle',
      error: 'fas fa-times-circle',
      development: 'fas fa-rocket',
    };
    return icons[this.config.type] || icons.info;
  }

  getIconBackgroundClass(): string {
    if (!this.config) return 'bg-blue-100 dark:bg-blue-800';
    const backgrounds = {
      info: 'bg-blue-100 dark:bg-blue-800',
      success: 'bg-green-100 dark:bg-green-800',
      warning: 'bg-yellow-100 dark:bg-yellow-800',
      error: 'bg-red-100 dark:bg-red-800',
      development:
        'bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-800 dark:to-teal-800',
    };
    return backgrounds[this.config.type] || backgrounds.info;
  }

  getIconColorClass(): string {
    if (!this.config) return 'text-blue-600 dark:text-blue-400';
    const colors = {
      info: 'text-blue-600 dark:text-blue-400',
      success: 'text-green-600 dark:text-green-400',
      warning: 'text-yellow-600 dark:text-yellow-400',
      error: 'text-red-600 dark:text-red-400',
      development: 'text-emerald-600 dark:text-emerald-400',
    };
    return colors[this.config.type] || colors.info;
  }

  getTitleColorClass(): string {
    if (!this.config) return 'text-blue-900 dark:text-blue-100';
    const colors = {
      info: 'text-blue-900 dark:text-blue-100',
      success: 'text-green-900 dark:text-green-100',
      warning: 'text-yellow-900 dark:text-yellow-100',
      error: 'text-red-900 dark:text-red-100',
      development: 'text-emerald-900 dark:text-emerald-100',
    };
    return colors[this.config.type] || colors.info;
  }

  getMessageColorClass(): string {
    if (!this.config) return 'text-blue-700 dark:text-blue-300';
    const colors = {
      info: 'text-blue-700 dark:text-blue-300',
      success: 'text-green-700 dark:text-green-300',
      warning: 'text-yellow-700 dark:text-yellow-300',
      error: 'text-red-700 dark:text-red-300',
      development: 'text-emerald-700 dark:text-emerald-300',
    };
    return colors[this.config.type] || colors.info;
  }

  getProgressBarClass(): string {
    if (!this.config) return 'bg-blue-500';
    const colors = {
      info: 'bg-blue-500',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      error: 'bg-red-500',
      development: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    };
    return colors[this.config.type] || colors.info;
  }

  getActionButtonClass(style: string): string {
    const base = `group relative px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium
                  rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-95
                  flex items-center justify-center space-x-1.5 sm:space-x-2 focus:outline-none focus:ring-2
                  shadow-sm hover:shadow-md min-h-[40px] sm:min-h-[44px]
                  disabled:opacity-50 disabled:cursor-not-allowed`;

    const styles: Record<string, string> = {
      primary: `${base} bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white focus:ring-emerald-500 border border-emerald-600`,
      secondary: `${base} bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 focus:ring-gray-500 border border-gray-300 dark:border-gray-600`,
      danger: `${base} bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white focus:ring-red-500 border border-red-600`,
      success: `${base} bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white focus:ring-green-500 border border-green-600`,
    };

    return styles[style] || styles['secondary'];
  }

  getActionButtonHoverClass(style: string): string {
    const hovers: Record<string, string> = {
      primary: 'from-emerald-400 to-teal-400',
      secondary: 'from-gray-300 to-gray-400',
      danger: 'from-red-400 to-red-500',
      success: 'from-green-400 to-green-500',
    };
    return hovers[style] || hovers['secondary'];
  }

  formatMessage(message: string): string {
    return message.replace(/\n/g, '<br>');
  }

  getTruncatedMessage(): string {
    if (!this.config?.message) return '';

    const plainText = this.config.message.replace(/<[^>]*>/g, '');

    if (plainText.length <= 60) {
      return plainText;
    }

    const firstSentence = plainText.split('.')[0];
    if (firstSentence.length <= 60) {
      return firstSentence + '...';
    }

    return plainText.substring(0, 57) + '...';
  }

  shouldShowFullMessage(): boolean {
    if (!this.config?.message) return false;

    const plainText = this.config.message.replace(/<[^>]*>/g, '').trim();

    if (plainText.length <= 50) return false;

    const sentences = plainText
      .split(/[.!?]\s+/)
      .filter((s) => s.trim().length > 0);
    return (
      sentences.length > 1 ||
      plainText.length > 80 ||
      this.config.message.includes('\n')
    );
  }

  trackByAction(index: number, action: AlertAction): string {
    return action.action;
  }
}
