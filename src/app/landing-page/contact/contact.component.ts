import { environment } from './../../../environments/environment';
import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, Output, EventEmitter } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Typed from 'typed.js';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, AfterViewInit, OnDestroy {
  iconPath=environment.iconPath;
  currentYear: number = new Date().getFullYear();
  @Output() contactLoaded = new EventEmitter<boolean>();
  masterTimeline?: gsap.core.Timeline;
  private typed: Typed | null = null;
  
  constructor(private elementRef: ElementRef) {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setupAnimations();
      this.contactLoaded.emit(true);
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

  setupAnimations(): void {
    const element = this.elementRef.nativeElement;

    // Timeline maestro para contact
    this.masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: element.querySelector('#contact-container'),
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1,
        markers: false
      }
    });

    const duration = 1;

    // 1. Animación de la línea vertical central
    this.masterTimeline.fromTo(
      '#contact-vertical-line',
      { scaleY: 0, transformOrigin: 'top center' },
      {
        scaleY: 1,
        ease: 'none',
        start:"",
        scrollTrigger: {
          trigger: '#contact-gradient',
          start: 'top center',
          end: 'bottom 40%',
          scrub: 1,
          markers: false
        }
      }
    );

    // 2. Animación del texto vertical izquierdo
    this.masterTimeline.fromTo(
      '#contact-text-left',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: duration * 0.8,
        scrollTrigger: {
          trigger: '#contact-text-left',
          start: 'top center',
          end: 'bottom 40%',
          scrub: 1,
          pin: false,
          markers: false
        }
      },
      '>-0.5'
    );

    // 3. Animación del texto vertical derecho
    this.masterTimeline.fromTo(
      '#contact-text-right',
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: duration * 0.8,
        scrollTrigger: {
          trigger: '#contact-text-right',
          start: 'top center',
          end: 'bottom 40%',
          scrub: 1,
          markers: false
        }
      },
      '<'
    );

    // // 4. Fade in del gradiente
    // this.masterTimeline.fromTo(
    //   '#contact-gradient',
    //   { opacity: 0 },
    //   { opacity: 1, duration: duration * 0.6 },
    //   '>-0.4'
    // );

    // 5. Fade in del título con typed effect
    this.masterTimeline.fromTo(
      '#contact-title',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: duration * 0.5 },
      '>-0.3'
    );

    // 6. Animación de los iconos sociales con stagger
    this.masterTimeline.fromTo(
      '.contact-link-list-element',
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, duration: duration * 0.4, stagger: 0.1, 
        scrollTrigger: {
          trigger: '.contact-link-list-element',
          start: 'top 80%',
          end: 'bottom 65%',
          scrub: 1,
          markers: false
        }
       },
      '>'
    );

    // 7. Animación de la línea vertical del footer
    this.masterTimeline.fromTo(
      '#contact-footer-line',
      { scaleY: 0, transformOrigin: 'top center' },
      { scaleY: 1, duration: duration * 0.8,
        scrollTrigger: {
          trigger: '#contact-footer-line',
          start: 'top 80%',
          end: 'bottom 65%',
          scrub: 1,
          markers: false
        }
       },
    );

    // 8. Animación del borde superior izquierdo del copyright
    this.masterTimeline.fromTo(
      '#contact-footer-border-1',
      { scaleX: 0, transformOrigin: 'left center' },
      { scaleX: 1, duration: duration * 0.6,
        scrollTrigger: {
          trigger: '#contact-footer-border-1',
          start: 'top 100%',
          end: 'bottom 90%',
          scrub: 1,
          markers: false
        }
       },
      '<'
    );

    // 9. Animación del borde inferior derecho del copyright
    this.masterTimeline.fromTo(
      '#contact-footer-border-2',
      { scaleX: 0, transformOrigin: 'right center' },
      { scaleX: 1, duration: duration * 0.6,
        scrollTrigger: {
          trigger: '#contact-footer-border-1',
          start: 'top 100%',
          end: 'bottom 90%',
          scrub: 1,
          markers: false
        }
       },
      '<'
    );

    // 10. Fade in del texto del copyright
    // this.masterTimeline.fromTo(
    //   '#contact-footer-text',
    //   { scaleY: 0, transformOrigin: 'top center' },
    //   {
    //     scaleY: 1,
    //     ease: 'none',
    //     scrollTrigger: {
    //       trigger: '#contact-footer-text',
    //       start: 'top 70%',
    //       end: '80% top',
    //       scrub: 1,
    //       markers: false
    //     }
    //   },
    //   '>-0.2'
    // );
  }

}
