import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay, Parallax } from 'swiper/modules';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-proyects',
  templateUrl: './proyects.component.html',
  styleUrls: ['./proyects.component.scss']
})
export class ProyectsComponent implements OnInit, AfterViewInit {
  @Input() projects:any;
  @Output() proyectsLoaded = new EventEmitter<boolean>();
  swiper?: Swiper;
  masterTimeline?: gsap.core.Timeline;
  
  constructor(private elementRef: ElementRef) {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initSwiper();
      this.setupAnimations();
      this.proyectsLoaded.emit(true);
    }, 100);
  }

  setupAnimations(): void {
    const element = this.elementRef.nativeElement;

    // Timeline maestro para proyects
    this.masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: element.querySelector('#proyects-container'),
        start: 'top 90%',
        end: 'bottom 80%',
        scrub: 1,
        markers: false
      }
    });

    const duration = 1;

    // 1. Animación del título

    // 2. Animación del border del título
    this.masterTimeline.fromTo(
      '#proyects-border-1',
      { scaleY: 0, transformOrigin: 'left center' },
      { scaleY: 1, duration },
      "+=2.5"
    );
    this.masterTimeline.fromTo(
      '#proyects-title',
      { opacity: 0 },
      { opacity: 1, duration: duration * 0.5 },
      ">"
    );

    // 3. Animación del swiper container
    this.masterTimeline.fromTo(
      '#proyects-swiper',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: duration * 0.8 },
      '>-0.3'
    );

    // 4. Animación de cada slide (si hay proyectos)
    if (this.projects && this.projects.length > 0) {
      for (let i = 0; i < Math.min(3, this.projects.length); i++) {
        this.masterTimeline.fromTo(
          `#proyect-slide-content-${i}`,
          { opacity: 0 },
          { opacity: 1, duration: duration * 0.4 },
          '<0.1'
        );
      }
    }
  }

  ngOnDestroy(): void {
    if (this.swiper) {
      this.swiper.destroy();
    }
  }

  initSwiper(): void {
    this.swiper = new Swiper('.projects-swiper', {
      // Módulos necesarios: Navegación, Paginación, Autoplay y Parallax
      modules: [Navigation, Pagination, Autoplay, Parallax],
      
      // Habilita el efecto parallax en los elementos con data-swiper-parallax
      parallax: true,
      
      // Cambia el cursor a "mano" cuando está sobre el swiper
      grabCursor: true,
      
      // Mantiene el slide activo centrado
      centeredSlides: true,
      
      // Muestra solo 1 slide a la vez para efecto parallax óptimo
      slidesPerView: 1,
      
      // Espacio entre slides
      spaceBetween: 0,
      
      // Permite el loop infinito de slides
      loop: false,
      
      // Velocidad de transición (más lenta para apreciar el parallax)
      speed: 500,
      
      // Autoplay automático del carousel
      // autoplay: {
      //   delay: 5000,                    // Tiempo entre transiciones (ms)
      //   disableOnInteraction: false,    // Continúa después de interacción
      //   pauseOnMouseEnter: true         // Pausa cuando el mouse está encima
      // },
      
      // Paginación (bullets/puntos navegables)
      pagination: {
        el: '.swiper-pagination',     // Selector del contenedor
        clickable: true,              // Permite hacer click en bullets
        dynamicBullets: true          // Muestra solo algunos bullets activos
      },
      
      // Botones de navegación (flechas)
      navigation: {
        nextEl: '.swiper-button-next',  // Selector botón siguiente
        prevEl: '.swiper-button-prev'   // Selector botón anterior
      },
      
      // Breakpoints responsive
      breakpoints: {
        // Móvil: 1 slide
        320: {
          slidesPerView: 1,
          spaceBetween: 0
        },
        // Tablet: 1 slide (parallax funciona mejor con 1 slide)
        768: {
          slidesPerView: 1,
          spaceBetween: 0
        },
        // Desktop: 1 slide
        1024: {
          slidesPerView: 1,
          spaceBetween: 0
        }
      }
    });
  }

}
