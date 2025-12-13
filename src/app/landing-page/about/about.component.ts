import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Typed from 'typed.js';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, OnDestroy {
  @Input() aboutMessage:any = 'LoreIpsum';
  private typed: Typed | null = null;
  private currentTypedText: string = 'About Me';
  
  constructor() { 
    gsap.registerPlugin(ScrollTrigger);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.typed) {
      this.typed.destroy();
    }
  }
  ngAfterViewInit(): void {
    this.setupScrollAnimations();
  }
  private setupScrollAnimations(): void {
    // Animación para profile-photo - entrada
    gsap.timeline({
      scrollTrigger: {
        trigger: '.profile-photo',
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1,
        markers: true
      }
      
    })
    .fromTo('.profile-photo', 
      { opacity: 0, x: -100 },
      { opacity: 1, x: 0 }
    );

    // Fade out cuando sale por arriba (400px después)
    gsap.timeline({
      scrollTrigger: {
        trigger: '.profile-photo',
        start: 'bottom+=600 80%',
        end: 'bottom+=600 20%',
        scrub: 1,
        markers: false
      }
    })
    .to('.profile-photo', 
      { opacity: 0, x: -100 }
    );

    // Animación para about-subtitle - entrada
    gsap.timeline({
      scrollTrigger: {
        trigger: '.about-subtitle',
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1,
        markers: false,
        onEnter: () => this.startTypedAnimation(),
        // onLeave: () => this.clearTypedText(),
        onEnterBack: () => this.startTypedAnimation(),
        // onLeaveBack: () => this.clearTypedText(),
      }
    })
    .fromTo('.about-subtitle', 
      { opacity: 0, x: 100 },
      { opacity: 1, x: 0 }
    );

    // Fade out cuando sale por arriba (400px después)
    gsap.timeline({
      scrollTrigger: {
        trigger: '.about-subtitle',
        start: 'bottom+=600 80%',
        end: 'bottom+=600 20%',
        scrub: 1,
        markers: false,
        // onEnter: () => this.clearTypedText()
      }
    })
    .to('.about-subtitle', 
      { opacity: 0, x: 100 }
    );
  }

  private startTypedAnimation(): void {
    if (this.typed) {
      this.typed.destroy();
    }

    const element = document.querySelector('.typed-text');
    if (element) {
      this.typed = new Typed('.typed-text', {
        strings: ['About Me'],
        typeSpeed: 100,
        backSpeed: 50,
        loop: false,
        showCursor: false,
        cursorChar: '|'
      });
    }
  }

  public clearTypedText(): void {
    if (this.typed) {
      
      const element = document.querySelector('.typed-text');
      if (element) {
        this.typed.destroy();
        console.log('typed',this.typed);
        // this.typed.typeSpeed = 0,
        this.typed = new Typed('.typed-text', {
          strings: [this.currentTypedText, ''],
          typeSpeed: 0,
          backSpeed: 50,
          startDelay: 0,
          showCursor: true,
          cursorChar: '|',
          onComplete: () => {
            if (this.typed) {
              this.typed.destroy();
              this.typed = null;
            }
          }
        });
      }
    }
  }
}
