import { environment } from './../../../environments/environment';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, OnDestroy {
  @Input() contactInfo: any;
  @Input() philosophy: any;

  iconPath = environment.iconPath;
  currentYear: number = new Date().getFullYear();

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
