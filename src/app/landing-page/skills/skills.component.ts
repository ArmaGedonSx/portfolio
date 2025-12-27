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
  @Input() skills: any = [];
  technologies!: any;
  unsubscribe$: Subject<void>;
  swiper?: Swiper;
  sectionsLoaded: Set<number> = new Set();
  totalSections = 3;
  masterTimeline?: gsap.core.Timeline;

  constructor(
    private dataService: DataService,
    private elementRef: ElementRef
  ) {
    this.unsubscribe$ = new Subject();
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
    // Esperamos un momento para asegurar que el DOM esté listo
    setTimeout(() => {
      this.checkIfAllSectionsLoaded();
    }, 100);
  }

  onSectionLoaded(sectionIndex: number): void {
    this.sectionsLoaded.add(sectionIndex);
    this.checkIfAllSectionsLoaded();
  }

  checkIfAllSectionsLoaded(): void {
    if (this.sectionsLoaded.size === this.totalSections) {
      this.setupMasterTimeline();
    }
  }

  setupMasterTimeline(): void {
    const element = this.elementRef.nativeElement;

    gsap.fromTo(
      '#skills-border-1',
      { scaleY: 0, transformOrigin: 'top center' },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '#skills-border-1',
          start: 'top 90%',
          end: 'bottom 70%',
          scrub: 1,
          markers: false
        }
      }
    );

    // Crear timeline maestro con ScrollTrigger
    this.masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: element.querySelector('.skills-text'),
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1,
        markers: false
      }
    });
    const duration = 2;

    // 1. Animación: skills-border-1 (height - scaleY)
    // this.masterTimeline.fromTo(
    // );
    this.masterTimeline.fromTo(
      '#skills-border-3',
      { scaleY: 0,  transformOrigin: 'top center' },
      { scaleY: 1, duration },
      '>'
    );
    this.masterTimeline.fromTo(
      '#skills-border-3-1',
      { scaleX: 0, transformOrigin: 'left center' },
      { scaleX: 1, duration },
      '>'
    );
    
    this.masterTimeline.fromTo(
      '#skills-border-2',
      { scaleX: 0, transformOrigin: 'left center' },
      { scaleX: 1, duration },
      '>-0.1'
    );
    this.masterTimeline.fromTo(
      '#skills-title',
      { opacity: 0 },
      { opacity: 1, duration: duration * 0.5 },
      '>-0.2'
    );

    // 5. Animación: skills-border-4 (height - scaleY)
    this.masterTimeline.fromTo(
      '#skills-border-4',
      { scaleY: 0, transformOrigin: 'top center' },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '#skills-border-4',
          start: 'top 70%',
          end: 'top 15%',
          scrub: 1,
          markers: false
        }
      },
      '>'
    );
    this.masterTimeline.fromTo(
      '#skills-border-5',
      { scaleY: 0, transformOrigin: 'top center' },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '#skills-border-5',
          start: 'top 57%',
          end: 'top 20%',
          scrub: 1,
          markers: false
        }
      },
      '>'
    );

    // 6-8. Animaciones de cada sección COMPLETA (Languages, Frameworks, Tools)
    for (let i = 0; i < this.totalSections; i++) {

      // tree-separator-primary (width - scaleX)
      this.masterTimeline.fromTo(
        `#tree-separator-primary-${i}`,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: duration * 0.6 },
      );

      // tree-separator-title (width prioritario - scaleX) - inmediatamente después
      this.masterTimeline.fromTo(
        `#tree-separator-title-${i}`,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: duration * 0.6 },
        '>'
      );

      // skill-section-title (opacity) - inmediatamente después
      this.masterTimeline.fromTo(
        `#skill-section-title-${i}`,
        { opacity: 0 },
        { opacity: 1, duration: duration * 0.4 },
        '>'
      );

      // tree-separator-secondary (width prioritario - scaleX) - inmediatamente después
      this.masterTimeline.fromTo(
        `#tree-separator-secondary-${i}`,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: duration * 0.6 },
        '>'
      );

      // skill-tecnologies container (opacity) - inmediatamente después
      this.masterTimeline.fromTo(
        `#skill-tecnologies-${i}`,
        { opacity: 0 },
        { opacity: 1, duration: duration * 0.5 },
        '>'
      );
      // skill cards individuales (stagger) - inmediatamente después
      const skillCards = element.querySelectorAll(`[id^="skill-card-${i}-"]`);
      this.masterTimeline.fromTo(
        skillCards,
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          stagger: 0.03,
          ease: 'back.out(1.7)',
          duration: duration * 0.4
        },
        '<'
      );

      // Gap antes de la siguiente sección
      if (i < this.totalSections - 1) {
        this.masterTimeline.to({}, { duration: duration * 0.3 });
      }
    }

    // 9. Animación final: skills-border-5 (height - scaleY)
    
  }

  setupTreeSeparatorAnimation(): void {
    // Método legacy - ya no se usa, las animaciones están en setupMasterTimeline
  }

  getTechnologies() {
    this.dataService.getTecnologies()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((val: any) => {
        this.technologies = val.technologies;

      });
  }
}
