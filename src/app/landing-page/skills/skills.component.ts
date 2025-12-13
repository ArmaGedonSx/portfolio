import { Subject, takeUntil } from 'rxjs';
import { Component, Input, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { DataService } from '../common/services/data.service';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() skills:any = [];
  technologies!:any;
  unsubscribe$:Subject<void>;
  swiper?: Swiper;
  
  constructor(
    private dataService:DataService
  ) {
    this.unsubscribe$=new Subject();
  }
  
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    if (this.swiper) {
      this.swiper.destroy();
    }
  }

  ngOnInit(): void {
    this.getTechnologies();
  }

  ngAfterViewInit(): void {
    // setTimeout(() => {
    //   this.initSwiper();
    // }, 100);
  }

  getTechnologies(){
    this.dataService.getTecnologies()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((val:any)=>{
        this.technologies = val.technologies;

      });
  }
}
