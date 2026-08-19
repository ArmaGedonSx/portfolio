import { IExperienceInfo } from './../common/interfaces/experience-information';
import { Component, Input, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { DataService } from '../common/services/data.service';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-experiences',
  templateUrl: './experiences.component.html',
  styleUrls: ['./experiences.component.scss']
})
export class ExperiencesComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() experiences!: Array<IExperienceInfo>;
  technologies!: any;
  masterTimeline?: gsap.core.Timeline;

  constructor(
    private dataService: DataService,
    private elementRef: ElementRef
  ) {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngOnInit(): void {
    this.getTechnologies();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setupAnimations();
    }, 150);
  }

  ngOnDestroy(): void {
    if (this.masterTimeline) {
      this.masterTimeline.kill();
    }
  }

  getTechnologies(): void {
    this.dataService.getTecnologies()
      .subscribe((val: any) => {
        this.technologies = val.technologies;
      });
  }

  setupAnimations(): void {
    const element = this.elementRef.nativeElement;

    // 1. Felső összekötő vonal lefolyása
    gsap.fromTo(
      element.querySelector('#experiences-border-top'),
      { scaleY: 0, transformOrigin: 'top center' },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: element.querySelector('#experiences-container'),
          start: 'top 85%',
          end: 'top 60%',
          scrub: 0.4,
          markers: false
        }
      }
    );

    // 2. Középső hosszú timeline tengely folyamatos lefolyása görgetésre
    gsap.fromTo(
      element.querySelector('#line-experiences-list'),
      { scaleY: 0, transformOrigin: 'top center' },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: element.querySelector('.experiences-timeline-wrapper'),
          start: 'top 75%',
          end: 'bottom 60%',
          scrub: 0.4,
          markers: false
        }
      }
    );

    // 3. Kártyák és csomópontok finom megjelenése ahogy a vonal eléri őket
    const rows = element.querySelectorAll('.experience-row');
    rows.forEach((row: HTMLElement) => {
      gsap.fromTo(
        row,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: row,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }
}
