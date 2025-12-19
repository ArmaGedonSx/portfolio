import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay, Parallax } from 'swiper/modules';

@Component({
  selector: 'app-proyects',
  templateUrl: './proyects.component.html',
  styleUrls: ['./proyects.component.scss']
})
export class ProyectsComponent implements OnInit, AfterViewInit {
  @Input() projects:any;
  swiper?: Swiper;
  
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initSwiper();
    }, 100);
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
