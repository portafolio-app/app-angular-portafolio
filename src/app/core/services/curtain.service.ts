import { Injectable } from '@angular/core';
import { gsap } from 'gsap';

@Injectable({
  providedIn: 'root'
})
export class CurtainService {
  private curtainLeft: HTMLElement | null = null;
  private curtainRight: HTMLElement | null = null;
  private canvas: HTMLElement | null = null;
  private mainContent: HTMLElement | null = null;
  private isAnimating = false;

  constructor() {}

  public setCurtainElements(
    curtainLeft: HTMLElement,
    curtainRight: HTMLElement,
    canvas?: HTMLElement,
    mainContent?: HTMLElement
  ): void {
    this.curtainLeft = curtainLeft;
    this.curtainRight = curtainRight;
    this.canvas = canvas || null;
    this.mainContent = mainContent || null;

    // Asegurar posición inicial fuera de pantalla
    gsap.set(this.curtainLeft, { x: '-100%' });
    gsap.set(this.curtainRight, { x: '100%' });
  }

  public async closeCurtains(
    onNavigate: () => void,
    onFadedOut?: () => void
  ): Promise<void> {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const timeline = gsap.timeline({
      onComplete: () => {
        this.isAnimating = false;
      }
    });

    // Phase 1: Close curtains (1s)
    timeline.to(
      [this.curtainLeft, this.curtainRight],
      {
        x: '0%',
        duration: 1,
        ease: 'power3.inOut'
      },
      0
    );

    // Phase 2: Fade canvas and content (0.5s overlap)
    timeline.to(
      [this.canvas, this.mainContent],
      {
        opacity: 0,
        scale: 0.9,
        duration: 0.5,
        ease: 'power3.inOut'
      },
      0.5
    );

    // Phase 3: Navigate while curtains are closed
    timeline.call(() => {
      if (onFadedOut) onFadedOut();
      onNavigate();
    }, [], 1.5);

    // Wait for navigation and then open
    await new Promise(resolve => setTimeout(resolve, 1800));
    this.openCurtains();
  }

  public openCurtains(): void {
    if (!this.curtainLeft || !this.curtainRight) return;

    const timeline = gsap.timeline();

    // Reset content visibility for next page
    timeline.to(
      [this.canvas, this.mainContent],
      {
        opacity: 1,
        scale: 1,
        duration: 0,
      },
      0
    );

    // Phase 4: Open curtains (1.2s)
    timeline.to(
      [this.curtainLeft, this.curtainRight],
      {
        x: (index) => (index === 0 ? '-100%' : '100%'),
        duration: 1.2,
        ease: 'power3.inOut'
      },
      0
    );
  }

  public setCanvasAndContent(canvas: HTMLElement, content: HTMLElement): void {
    this.canvas = canvas;
    this.mainContent = content;
  }
}
