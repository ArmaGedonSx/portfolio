import { Component, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnDestroy {
  title = 'portfolio';
  private wheelHandler: ((e: WheelEvent) => void) | null = null;
  private scrolling = false;
  private scrollTarget = 0;
  private animationFrameId: number | null = null;
  private lastDeltaY = 0; // Para detectar cambios de dirección

  // Variables para controlar el smooth scroll
  private scrollSpeed = 0.7;        // 0.3 = muy lento, 0.5 = medio, 0.7 = rápido, 1.0 = normal
  private smoothness = 0.15;          // 0.05 = muy suave, 0.1 = medio, 0.15 = más responsive
  private scrollThreshold = 0.5;     // Umbral mínimo para continuar animando

  ngAfterViewInit() {
    this.initSmoothScroll();
  }

  ngOnDestroy() {
    if (this.wheelHandler) {
      window.removeEventListener('wheel', this.wheelHandler);
    }
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private initSmoothScroll() {
    this.scrollTarget = window.pageYOffset;
    
    // Interceptar el wheel event
    this.wheelHandler = (e: WheelEvent) => {
      e.preventDefault();
      
      // Detectar cambio de dirección (scroll hacia arriba vs abajo)
      const directionChanged = (this.lastDeltaY > 0 && e.deltaY < 0) || (this.lastDeltaY < 0 && e.deltaY > 0);
      
      if (directionChanged) {
        // Detener animación actual y resetear al scroll actual
        if (this.animationFrameId) {
          cancelAnimationFrame(this.animationFrameId);
          this.animationFrameId = null;
        }
        this.scrollTarget = window.pageYOffset;
        this.scrolling = false;
      }
      
      this.lastDeltaY = e.deltaY;
      
      this.scrollTarget += e.deltaY * this.scrollSpeed;
      this.scrollTarget = Math.max(0, Math.min(this.scrollTarget, document.body.scrollHeight - window.innerHeight));
      
      if (!this.scrolling) {
        this.scrolling = true;
        this.smoothScrollAnimation();
      }
    };
    
    window.addEventListener('wheel', this.wheelHandler, { passive: false });
  }

  private smoothScrollAnimation = () => {
    const currentScroll = window.pageYOffset;
    const difference = this.scrollTarget - currentScroll;
    
    if (Math.abs(difference) > this.scrollThreshold) {
      window.scrollTo(0, currentScroll + difference * this.smoothness);
      this.animationFrameId = requestAnimationFrame(this.smoothScrollAnimation);
    } else {
      window.scrollTo(0, this.scrollTarget);
      this.scrolling = false;
      this.animationFrameId = null;
    }
  };
}
