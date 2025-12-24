import { IExperienceInfo } from './../common/interfaces/experience-information';
import { Component, Input, OnInit, AfterViewInit, OnDestroy, ElementRef, Output, EventEmitter } from '@angular/core';
import { DataService } from '../common/services/data.service';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Typed from 'typed.js';

@Component({
  selector: 'app-experiences',
  templateUrl: './experiences.component.html',
  styleUrls: ['./experiences.component.scss']
})
export class ExperiencesComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() experiences!:Array<IExperienceInfo>;
  @Output() experiencesLoaded = new EventEmitter<boolean>();
  technologies!:any;
  masterTimeline?: gsap.core.Timeline;
  private typed: Typed | null = null;

  constructor(
    private dataService:DataService,
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
      this.experiencesLoaded.emit(true);
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.typed) {
      this.typed.destroy();
    }
    if (this.masterTimeline) {
      this.masterTimeline.kill();
    }
  }
  getTechnologies(){
    this.dataService.getTecnologies()
      .subscribe((val:any)=>{
        this.technologies = val.technologies;
      });
  }

  setupAnimations(): void {
    const element = this.elementRef.nativeElement;

    // Timeline maestro para experiences
    this.masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: element.querySelector('#experiences-container'),
        start: 'top 80%',
        end: 'bottom 50%',
        scrub: 1,
        markers: false
      }
    });

    const duration = 1;

    // 1. Animación del borde superior vertical
    this.masterTimeline.fromTo(
      '#experiences-border-top',
      { scaleY: 0, transformOrigin: 'top center' },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '#experiences-border-top',
          start: 'top 70%',
          end: '80% top',
          scrub: true,
          markers: false
        }
      }
    );

    // 2. Animación del borde inferior izquierdo del título
    this.masterTimeline.fromTo(
      '#experiences-border-1',
      { scaleX: 0, transformOrigin: 'left center' },
      { scaleX: 1, duration: duration * 0.8 },
      '>-0.3'
    );

    // 3. Animación del borde superior derecho del título
    this.masterTimeline.fromTo(
      '#experiences-border-2',
      { scaleX: 0, transformOrigin: 'right center' },
      { scaleX: 1, duration: duration * 0.8 },
      '<'
    );

    // 4. Fade in del título con efecto typed
    this.masterTimeline.fromTo(
      '#experiences-title',
      { opacity: 0 },
      { opacity: 1, duration: duration * 0.5 },
      '>-0.2'
    );

    // 5. Animación de la línea central vertical
    this.masterTimeline.fromTo(
      '.line-experiences-list',
      { scaleY: 0, transformOrigin: 'top center' },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.line-experiences-list',
          start: 'top 70%',
          end: '80% top',
          scrub: true,
          markers: false
        }
      },
      '>-0.3'
    );

    // 6. Animación de cada experiencia con stagger
    if (this.experiences && this.experiences.length > 0) {
      this.experiences.forEach((_, i) => {
        this.masterTimeline!.fromTo(
          `#experience-card-${i}`,
          { opacity: 0, x: i % 2 === 0 ? 50 : -50 },
          { opacity: 1, x: 0, duration: duration * 0.6 },
          '>'
        );
      });
    }
  }

}
