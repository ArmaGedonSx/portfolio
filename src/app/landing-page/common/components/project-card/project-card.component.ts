import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { IProject } from '../../interfaces';
import { Languages } from '../../enums';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent implements OnInit, OnDestroy {
  @Input() dataProject!: IProject;
  @Input() projectIndex: number = 0;
  @Input() totalProjects: number = 3;
  @Input() hideImage: boolean = false;
  
  Languages = Languages;
  currentLang: Languages = Languages.HUNGARIAN;
  private unsubscribe$ = new Subject<void>();

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.currentLanguage$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((lang) => {
        this.currentLang = lang;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
