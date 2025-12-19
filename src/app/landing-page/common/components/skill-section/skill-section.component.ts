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
    const skillCards = element.querySelectorAll('.skill-tecnologie');
    console.log('skills',this.skills);
    // Timeline única con todas las animaciones sincronizadas
    const mainTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'center center',
        scrub: 1,
        markers: false
      }
    });

    // 1. Animación tree-separator-primary
    mainTimeline.fromTo(
      element.querySelector('.tree-separator-primary'),
      { 
        scaleX: 0,
        transformOrigin: 'left center'
      },
      {
        scaleX: 1,
        duration: 1
      },
      0
    );

    // 2. Animación tree-separator-title (ligeramente después)
    mainTimeline.fromTo(
      element.querySelector('.tree-separator-title'),
      { 
        scaleX: 0,
        transformOrigin: 'left center'
      },
      {
        scaleX: 1,
        duration: 1
      },
      0.3
    );

    // 3. Animación del título
    mainTimeline.fromTo(
      element.querySelector('h3'),
      { 
        opacity: 0,
        transformOrigin: 'left center'
      },
      {
        opacity: 1,
        duration: 1
      },
      0.5
    );

    // 4. Animación tree-separator-secondary
    mainTimeline.fromTo(
      element.querySelector('.tree-separator-secondary'),
      { 
        scaleX: 0,
        transformOrigin: 'left center'
      },
      {
        scaleX: 1,
        duration: 1
      },
      1
    );

    // 5. Animación del contenedor de skills
    mainTimeline.fromTo(
      element.querySelector('.skill-tecnologies'),
      {
        opacity: 0,
        transformOrigin: 'left center'
      },
      {
        opacity: 1,
        duration: 1.5
      },
      1.5
    );

    // 6. Animación de cada skill-card
    mainTimeline.fromTo(
      skillCards,
      {
        opacity: 0,
        scale: 0
      },
      {
        opacity: 1,
        scale: 1,
        stagger: 0.05,
        ease: 'back.out(1.7)',
        duration: 0.8
      },
      2.5
    );
  }
}
