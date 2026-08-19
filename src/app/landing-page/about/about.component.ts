import { Component, Input, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import Typed from 'typed.js';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() aboutMessage: any = '';
  private typed: Typed | null = null;

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.typed) {
      this.typed.destroy();
    }
  }

  ngAfterViewInit(): void {
    this.startTypedAnimation();
  }

  private startTypedAnimation(): void {
    const element = document.querySelector('.typed-text');
    if (element && !this.typed) {
      this.typed = new Typed('.typed-text', {
        strings: ['Rólam & Szemlélet'],
        typeSpeed: 70,
        backSpeed: 40,
        loop: false,
        showCursor: false
      });
    }
  }
}
