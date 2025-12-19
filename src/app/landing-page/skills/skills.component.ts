import { Subject, takeUntil } from 'rxjs';
import { Component, Input, OnDestroy, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { DataService } from '../common/services/data.service';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() skills:any = [];
  technologies!:any;
  unsubscribe$:Subject<void>;
  swiper?: Swiper;
  
  constructor(
    private dataService:DataService,
    private elementRef: ElementRef
  ) {
    this.unsubscribe$=new Subject();
    gsap.registerPlugin(ScrollTrigger);
  }
  
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    if (this.swiper) {
      this.swiper.destroy();
    }
  }

  ngOnInit(): void {
    this.getTechnologies();
  }

  ngAfterViewInit(): void {
    this.setupTreeSeparatorAnimation();
  }

  setupTreeSeparatorAnimation(): void {
    const element = this.elementRef.nativeElement;
    
    // Animación para skill-title-trace
    gsap.timeline({
      scrollTrigger: {
        trigger: element.querySelector('.skills-text'),
        start: 'top 80%',
        end: 'top 40%',
        scrub: 1,
        markers: false
      }
    })
    .fromTo(
      element.querySelector('.skill-title-trace'),
      {
        scaleX: 0,
        transformOrigin: 'left center'
      },
      {
        scaleX: 1
      }
    );
    
    // Animación para tree-separator-skill
    gsap.timeline({
      scrollTrigger: {
        trigger: element.querySelector('.tree-separator-skill'),
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1,
        markers: false
      }
    })
    .fromTo(
      element.querySelector('.tree-separator-skill'),
      {
        scaleY: 0,
        transformOrigin: 'top center'
      },
      {
        scaleY: 1
      }
    );
  }

  getTechnologies(){
    this.dataService.getTecnologies()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((val:any)=>{
        this.technologies = val.technologies;

      });
  }
}
