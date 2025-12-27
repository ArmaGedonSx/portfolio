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
  private smoothness = 0.05;          // 0.05 = muy suave, 0.1 = medio, 0.15 = más responsive
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
    this.scrollTarget = window.pageYOffset || window.scrollY || document.documentElement.scrollTop;
    
    // Interceptar el wheel event
    this.wheelHandler = (e: WheelEvent) => {
      // Prevenir el scroll por defecto solo después de verificar que podemos manejarlo
      e.preventDefault();
      e.stopPropagation();
      
      // Detectar cambio de dirección (scroll hacia arriba vs abajo)
      const directionChanged = (this.lastDeltaY > 0 && e.deltaY < 0) || (this.lastDeltaY < 0 && e.deltaY > 0);
      
      if (directionChanged) {
        // Detener animación actual y resetear al scroll actual
        if (this.animationFrameId) {
          cancelAnimationFrame(this.animationFrameId);
          this.animationFrameId = null;
        }
        this.scrollTarget = window.pageYOffset || window.scrollY || document.documentElement.scrollTop;
        this.scrolling = false;
      }
      
      this.lastDeltaY = e.deltaY;
      
      // Calcular el nuevo target de scroll
      const delta = e.deltaY * this.scrollSpeed;
      this.scrollTarget += delta;
      
      // Obtener el máximo scroll posible de forma más robusta
      const maxScroll = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      ) - window.innerHeight;
      
      this.scrollTarget = Math.max(0, Math.min(this.scrollTarget, maxScroll));
      
      if (!this.scrolling) {
        this.scrolling = true;
        this.smoothScrollAnimation();
      }
    };
    
    // Usar passive: false para poder hacer preventDefault
    window.addEventListener('wheel', this.wheelHandler, { passive: false, capture: false });
  }

  private smoothScrollAnimation = () => {
    const currentScroll = window.pageYOffset || window.scrollY || document.documentElement.scrollTop;
    const difference = this.scrollTarget - currentScroll;
    
    if (Math.abs(difference) > this.scrollThreshold) {
      const newScroll = currentScroll + difference * this.smoothness;
      window.scrollTo({
        top: newScroll,
        behavior: 'auto' // Importante: usar 'auto' para evitar conflictos con CSS scroll-behavior
      });
      this.animationFrameId = requestAnimationFrame(this.smoothScrollAnimation);
    } else {
      window.scrollTo({
        top: this.scrollTarget,
        behavior: 'auto'
      });
      this.scrolling = false;
      this.animationFrameId = null;
    }
  };
}
