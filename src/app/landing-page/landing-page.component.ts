import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { IDS } from './common/constants';
import { Languages } from './common/enums';
import { IProyect } from './common/interfaces';
import { DataService } from './common/services/data.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit, OnDestroy {
  DATA: any;
  skills: any = [];
  projects: Array<IProyect> = [];
  idList: Array<any> = [];
  idSelected: string = '';
  currentLanguage: Languages = Languages.HUNGARIAN;
  private unsubscribe$: Subject<void> = new Subject();

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.router.navigate(['']);
    
    // Figyeljük a nyelv változását
    this.dataService.currentLanguage$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((lang: Languages) => {
        this.currentLanguage = lang;
        this.loadConfig(lang);
      });

    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
      let currentSectionId = '';
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 0) {
          currentSectionId = section.id;
          this.idSelected = section.id;
        }
      });
    });
  }

  onSplashComplete(selectedLang: Languages): void {
    this.loadConfig(selectedLang);
  }

  loadConfig(lang: Languages = this.currentLanguage): void {
    this.dataService
      .getConfig(lang)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((val: any) => {
        this.DATA = val;
        this.skills = val['skills'];
        this.projects = val['projects'];
      });
  }

  @HostListener('window:scroll', ['event'])
  onScroll(event: any) {}
}
