import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay, Parallax } from 'swiper/modules';

@Component({
  selector: 'app-proyects',
  templateUrl: './proyects.component.html',
  styleUrls: ['./proyects.component.scss']
})
export class ProyectsComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() projects: any;
  @Output() proyectsLoaded = new EventEmitter<boolean>();
  swiper?: Swiper;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initSwiper();
      this.proyectsLoaded.emit(true);
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.swiper) {
      this.swiper.destroy();
    }
  }

  initSwiper(): void {
    this.swiper = new Swiper('.projects-swiper', {
      modules: [Navigation, Pagination, Autoplay, Parallax],
      parallax: true,
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 1,
      spaceBetween: 0,
      loop: true,
      speed: 600,
      autoplay: {
        delay: 5500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    });
  }
}
