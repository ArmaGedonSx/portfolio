import { Component, Input, AfterViewInit, ElementRef } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-skill-section',
  templateUrl: './skill-section.component.html',
  styleUrls: ['./skill-section.component.scss']
})
export class SkillSectionComponent implements AfterViewInit {
  @Input() title: string = '';
  @Input() skills: string[] = [];
  @Input() technologies: any;

  constructor(private elementRef: ElementRef) {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngAfterViewInit(): void {
    const element = this.elementRef.nativeElement;

    // Animación tree-separator-primary
    gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        end: 'top 60%',
        scrub: 1,
        markers: false
      }
    })
    .fromTo(
      element.querySelector('.tree-separator-primary'),
      { 
        scaleX: 0,
        transformOrigin: 'left center'
      },
      {
        scaleX: 1
      }
    );

    // Animación tree-separator-title
    gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: 'top 82%',
        end: 'top 55%',
        scrub: 1,
        markers: false
      }
    })
    .fromTo(
      element.querySelector('.tree-separator-title'),
      { 
        scaleX: 0,
        transformOrigin: 'left center'
      },
      {
        scaleX: 1
      }
    );

    // Animación del título
    gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'top 50%',
        scrub: 1,
        markers: false
      }
    })
    .fromTo(
      element.querySelector('h3'),
      { 
        opacity: 0,
        // scaleX: 0,
        transformOrigin: 'left center'
      },
      {
        opacity: 1,
        // scaleX: 1
      }
    );

    // Animación tree-separator-secondary
    gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: 'top 75%',
        end: 'top 55%',
        scrub: 1,
        markers: false
      }
    })
    .fromTo(
      element.querySelector('.tree-separator-secondary'),
      { 
        scaleX: 0,
        transformOrigin: 'left center'
      },
      {
        scaleX: 1
      }
    );

    // Animación del contenedor de skills
    gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'top 50%',
        scrub: 1,
        markers: true
      }
    })
    .fromTo(
      element.querySelector('.skill-tecnologie'),
      {
        opacity: 0,
        // scaleX: 0,
        transformOrigin: 'left center'
      },
      {
        opacity: 1,
        // scaleX: 1
      }
    );
  }
}
