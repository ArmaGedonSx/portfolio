import { Component, Input, OnInit } from '@angular/core';
import { IExperienceInfo } from '../../interfaces';

@Component({
  selector: 'app-experience-card',
  templateUrl: './experience-card.component.html',
  styleUrls: ['./experience-card.component.scss']
})
export class ExperienceCardComponent implements OnInit {
  @Input() experience!:IExperienceInfo;
  @Input() technologies!:any;
  @Input() imageOnRight: boolean = true; // true = derecha, false = izquierda
  
  constructor(
  ) {}
  ngOnInit(): void {}

  formatDate(dateString: string): string {
    if (!dateString) return '';
    
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const [month, year] = dateString.split('-');
    const monthIndex = parseInt(month, 10) - 1;
    
    return `${months[monthIndex]} ${year}`;
  }

}
