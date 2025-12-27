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
    // Animación del borde vertical izquierdo
    gsap.timeline({
      scrollTrigger: {
        trigger: '.about-card',
        start: 'top 95%',
        end: 'bottom 90%',
        scrub: 1,
        markers: false
      }
    })
    .fromTo('.borde-about-card', 
      { scaleY: 0, y:-500 , transformOrigin: 'top center' },
      { scaleY: 1, y:0 }
    );
    
    // Timeline independiente para los bordes de la foto
    const photoTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.profile-photo',
        start: 'top 60%',
        end: 'top 50%',
        scrub: 1,
        markers: false,
        onUpdate: (self) => {
          // Detectar cuando el timeline está yendo en reversa (scroll hacia atrás)
          if (self.direction === -1) {
            // Quitar clase inmediatamente cuando se detecta scroll hacia atrás
            const rightBorder = document.querySelector('.line-decoration-right');
            const bottomBorder = document.querySelector('.line-decoration-bottom');
            const image = document.querySelector('.about-img img');
            if (rightBorder) rightBorder.classList.remove('rounded-corner');
            if (bottomBorder) bottomBorder.classList.remove('rounded-corner');
            if (image) image.classList.remove('rounded-corner');
          }
        }
      }
    });

    // Animaciones secuenciales de los bordes
    photoTimeline
      .fromTo(
        '.line-decoration-top',
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 1 }
      )
      .fromTo(
        '.line-decoration-right',
        { scaleY: 0, transformOrigin: 'top center' },
        { scaleY: 1, duration: 1 },
        '>-0.2'
      )
      .fromTo(
        '.line-decoration-bottom',
        { scaleX: 0, transformOrigin: 'right center' },
        { 
          scaleX: 1, 
          duration: 1,
          onComplete: () => {
            // Agregar clase para animar el border-radius cuando completa hacia adelante
            const rightBorder = document.querySelector('.line-decoration-right');
            const bottomBorder = document.querySelector('.line-decoration-bottom');
            const image = document.querySelector('.about-img img');
            if (rightBorder) rightBorder.classList.add('rounded-corner');
            if (bottomBorder) bottomBorder.classList.add('rounded-corner');
            if (image) image.classList.add('rounded-corner');
          }
        },
        '>-0.2'
      )
      .fromTo(
        '.line-decoration-left',
        { scaleY: 0, transformOrigin: 'top center' },
        { scaleY: 1, duration: 1 },
        '>-0.2'
      );
      
    
    // Animación para profile-photo - entrada
    gsap.timeline({
      scrollTrigger: {
        trigger: '.profile-photo',
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1,
        markers: false
      }
      
    })
    .fromTo('.profile-photo', 
      { opacity: 0, x: -100 },
      { opacity: 1, x: 0 }
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
