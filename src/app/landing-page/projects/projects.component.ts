import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay, Parallax, EffectCreative } from 'swiper/modules';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() projects: any;
  @Output() projectsLoaded = new EventEmitter<boolean>();
  swiper?: Swiper;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initSwiper();
      this.projectsLoaded.emit(true);
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.swiper) {
      this.swiper.destroy();
    }
  }

  initSwiper(): void {
    this.swiper = new Swiper('.projects-swiper', {
      modules: [Navigation, Pagination, Autoplay, Parallax, EffectCreative],
      effect: 'creative',
      creativeEffect: {
        prev: {
          translate: ['-25%', 0, -1],
          scale: 0.94,
          opacity: 0,
        },
        next: {
          translate: ['100%', 0, 0],
          scale: 1,
          opacity: 1,
        },
      },
      parallax: true,
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 1,
      spaceBetween: 0,
      loop: true,
      speed: 650,
      autoplay: {
        delay: 5500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }
}
