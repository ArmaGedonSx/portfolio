import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  title: string = 'János!';
  subtitle: string = '<Full-Stack & Mobile Developer/>';
  intervalTimer: number = 100;
  wordSelected: boolean = true;
  titleRoulete: Array<string> = [
    'János!',
    'FullStack!',
    'Angular 21!',
    'TypeScript!',
    'Ionic & Mobile!',
    'Firebase!',
    'Bán János!'
  ];

  constructor() {}

  ngOnInit(): void {
    if (this.isMobile()) {
      this.titleRoulete = [
        'János!',
        'FullStack!',
        'Angular!',
        'Mobile!',
        'Firebase!'
      ];
    }
    this.cicleTitle();
  }

  isMobile(): boolean {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }

  async cicleTitle(): Promise<void> {
    while (true) {
      const currentTitle = this.title;
      await this.cleanTitle();
      let randomIndex = Math.floor(Math.random() * this.titleRoulete.length);
      if (currentTitle === this.titleRoulete[randomIndex]) {
        randomIndex = (randomIndex + 1) % this.titleRoulete.length;
      }
      await this.setTitle(this.titleRoulete[randomIndex]);
    }
  }

  async cleanTitle(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.wordSelected = true;
      setTimeout(async () => {
        this.wordSelected = false;
        resolve(await this.deleteTitle());
      }, 1600);
    });
  }

  setTitle(title: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      let charIndex = 0;
      const setTitleInterval = setInterval(() => {
        if (this.title.length < title.length) {
          this.title += title[charIndex];
          charIndex++;
        } else {
          this.title = title;
          clearInterval(setTitleInterval);
          resolve(true);
        }
      }, this.intervalTimer);
    });
  }

  deleteTitle(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const deleteInterval = setInterval(() => {
        if (this.title.length !== 0) {
          this.title = this.title.slice(0, -1);
        } else {
          clearInterval(deleteInterval);
          setTimeout(() => resolve(true), 250);
        }
      }, 40);
    });
  }
}
