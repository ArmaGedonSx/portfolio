import { Component, OnInit, AfterViewInit } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  title:string ='Daniel!';
  subtitle:string ='<Web Developer/>';
  intervalTimer:number = 250;
  wordSelected:Boolean = true;
  titleRoulete:Array<string> = [
    'Daniel!',
    'FrontEnd!',
    'BackEnd!',
    'Koinu!',
    'Developer!',
  ]; 
  
  constructor() { 
    gsap.registerPlugin(ScrollTrigger);
  }

  ngOnInit(): void {
    if(this.isMobile()) {
      this.titleRoulete = [
        'Daniel!',
        'Koinu!',
        'Front End!',
        'Back End!',
        'Developer!',
      ];
    }
    this.cicleTitle();
  }

  ngAfterViewInit(): void {
    this.setupScrollAnimations();
  }

  private setupScrollAnimations(): void {
    gsap.to('.home-banner-title', {
      opacity: 0,
      y: -100,
      x: 40,
      scrollTrigger: {
        trigger: '.home-container',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        markers: false // Cambia a true para debug
      }
    });

    gsap.to('.col-span', {
      opacity: 0,
      y: -80,
      x: -40,
      scrollTrigger: {
        trigger: '.home-container',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
    gsap.to('.home-subtitle', {
      opacity: 0,
      y: -80,
      x: 40,
      scrollTrigger: {
        trigger: '.home-container',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });

    gsap.to('button', {
      opacity: 0,
      y: -80,
      x: 40,

      scrollTrigger: {
        trigger: '.home-container',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
  }
  isMobile(): boolean {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }

  async cicleTitle():Promise<void> {
    while(true){
      const currentTitle = this.title;
      const response = await this.cleanTitle();
      let randomIndex = Math.floor(Math.random() * this.titleRoulete.length);
      if(currentTitle === this.titleRoulete[randomIndex]) {
        randomIndex = (randomIndex + 1) % this.titleRoulete.length; 
      }
      const response2 = await this.setTitle(this.titleRoulete[randomIndex]);
    }
  }

  async cleanTitle():Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.wordSelected = true;
      setTimeout(async () => {
        this.wordSelected = false;        
        resolve(await this.deleteTitle());
      }
      ,this.intervalTimer * 10);
    });
  }
  setTitle(title:string):Promise<boolean> {
    
    return new Promise<boolean>((resolve) => {
      const setTitleInterval = setInterval(() => {
        // agregar una letra en cada intervalo de tiempo
        if(this.title.length < title.length) {
          this.title += title[this.title.length];
        } else {
          this.title = title;
          clearInterval(setTitleInterval);
          resolve(true);
        }
      },this.intervalTimer);
    });
  }
  deleteTitle():Promise<boolean> {
    
    return new Promise<boolean>((resolve) => {
      const setTitleInterval = setInterval(() => {
        // eliminar la última letra en cada intervalo de tiempo
        if(this.title.length != 0) {
          this.title = this.title.slice(0, -1);
        } else {
          clearInterval(setTitleInterval);
          resolve(true);
        }
      },this.intervalTimer/3);
    });
  }
}
