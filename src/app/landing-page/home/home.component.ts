import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  title:string ='Daniel Ortiz!';
  subtitle:string ='<Front End Developer • Web Developer • Translator/>';
  intervalTimer:number = 500;
  wordSelected:Boolean = true;
  titleRoulete:Array<string> = [
    'Daniel Ortiz!',
    'DDO/',
    'Front End!',
    'Web Developer!',
  ]; 
  constructor() { }

  ngOnInit(): void {
    
    this.cicleTitle();
  }
  // puedes crear una funcion asincrona para usar await


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
      setTimeout(() => {
        this.wordSelected = false;
        this.title = '';
        resolve(true);
      }
      ,this.intervalTimer * 6);
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
}
