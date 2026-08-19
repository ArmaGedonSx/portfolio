import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit, OnChanges, SimpleChanges, OnDestroy, ChangeDetectorRef } from '@angular/core';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() projects: any;
  @Output() projectsLoaded = new EventEmitter<boolean>();
  
  swiper?: Swiper;
  activeIndex: number = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projects'] && this.projects?.length) {
      setTimeout(() => {
        this.initSwiper();
        this.projectsLoaded.emit(true);
      }, 50);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initSwiper();
      this.projectsLoaded.emit(true);
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.swiper) {
      this.swiper.destroy(true, true);
    }
  }

  initSwiper(): void {
    const el = document.querySelector('.projects-swiper');
    if (!el || !this.projects?.length) {
      return;
    }

    if (this.swiper) {
      this.swiper.destroy(true, true);
      this.swiper = undefined;
    }

    this.swiper = new Swiper('.projects-swiper', {
      modules: [Navigation, Pagination, Autoplay],
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      speed: 450,
      observer: true,
      observeParents: true,
      on: {
        slideChange: (s: Swiper) => {
          this.activeIndex = s.realIndex;
          this.cdr.detectChanges();
        }
      }
    });

    if (this.activeIndex > 0) {
      this.swiper.slideToLoop(this.activeIndex, 0);
    }
  }

  selectProject(index: number): void {
    this.activeIndex = index;
    if (this.swiper) {
      this.swiper.slideToLoop(index, 450);
    }
    this.cdr.detectChanges();
  }

  prevSlide(): void {
    if (this.swiper) {
      this.swiper.slidePrev(450);
    }
  }

  nextSlide(): void {
    if (this.swiper) {
      this.swiper.slideNext(450);
    }
  }
}
