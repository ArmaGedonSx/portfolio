import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { IProyect } from '../../interfaces';
import { Languages } from '../../enums';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-proyect-card',
  templateUrl: './proyect-card.component.html',
  styleUrls: ['./proyect-card.component.scss']
})
export class ProyectCardComponent implements OnInit, OnDestroy {
  @Input() dataProject!: IProyect;
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
