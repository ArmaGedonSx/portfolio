import { Component, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-intro-splash',
  templateUrl: './intro-splash.component.html',
  styleUrls: ['./intro-splash.component.scss']
})


export class IntroSplashComponent implements OnInit, AfterViewInit {
  @Output() animationComplete = new EventEmitter<void>();
  
  isVisible = true;
  private tl:any = null;
  title:string = 'Daniel Ortiz';
  subTitle:string = 'WEB DEVELOPER';
  columns: number[] = Array.from({ length: 9 }, (_, i) => i);
  
  get titleLetters(): string[] {
    if(!this.title){
      return [];
    }
    return this.title.split('');
  }
  get subtitleLetters(): string[] {
    if(!this.subTitle){
      return [];
    }
    return this.subTitle.split('');
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.tl = gsap.timeline();
    this.animateWordsUp('.intro-text-up');
    this.animateWordsDown('.intro-text-down');
    this.animateWordsUp('.intro-subtitle',0.5);
    this.fadeOutWord('.intro-text');
    this.fadeOutSubTitle('.intro-subtitle',0.2);
    this.fadeOutSplash();
  }

  private animateWordsUp(query:string, time:number = 1) {
    //one stagger call does all the animation:
    this.tl.from(query, { 
      y: 100,
      opacity: 0,
      duration: time,
      stagger: 0.05,
      ease: 'power3.out'
    });
  }
  private animateWordsDown(query:string, time:number = 1) {
    //one stagger call does all the animation:
    this.tl.from(query, { 
      y: -100,
      opacity: 0,
      duration: time,
      stagger: 0.05,
      ease: 'power3.out'
    },'0');
  }
  
  private fadeOutWord(query:string, duration:number=0.8, afterTime:string='+=0.8' ){
    this.tl.to(query, { 
      y: 100,
      opacity: 0,
      duration: duration,
      stagger: {
        amount: 0.5,
        from: "end"
      },
      ease: 'power3.in'
    }, afterTime);
  }
  private fadeOutSubTitle(query:string, duration:number=0.8 ){
    this.tl.to(query, { 
      y: 100,
      opacity: 0,
      duration: duration,
      stagger: {
        amount: 0.5,
        from: "end"
      },
      ease: 'power3.in'
    });
  }

  private fadeOutSplash(){
    this.tl.to('.splash-column', { 
      y: '100vh',
      duration: 1.2,
      stagger: {
        amount: 0.6,
        from: "start"
      },
      ease: 'power3.inOut',
      onComplete: () => {
        this.isVisible = false;
        this.animationComplete.emit();
      }
    },'-=1');
  }
}
