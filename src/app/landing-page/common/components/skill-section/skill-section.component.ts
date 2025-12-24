import { Component, Input, Output, EventEmitter, AfterViewInit, ElementRef } from '@angular/core';
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
  @Input() sectionIndex: number = 0;
  @Output() sectionLoaded = new EventEmitter<number>();

  constructor(private elementRef: ElementRef) {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngAfterViewInit(): void {
    // Emitir evento indicando que el componente cargó
    setTimeout(() => {
      this.sectionLoaded.emit(this.sectionIndex);
    }, 0);
  }
}
