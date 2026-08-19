import { Component, Input, OnInit } from '@angular/core';
import { IExperienceInfo } from '../../interfaces';

@Component({
  selector: 'app-experience-card',
  templateUrl: './experience-card.component.html',
  styleUrls: ['./experience-card.component.scss']
})
export class ExperienceCardComponent implements OnInit {
  @Input() experience!: IExperienceInfo;
  @Input() technologies!: any;
  @Input() imageOnRight: boolean = true; // true = bal oldalon a kártya, false = jobb oldalon a kártya
  @Input() index: number = 0;

  constructor() {}
  ngOnInit(): void {}

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const trimmed = dateString.trim();

    if (
      trimmed.toLowerCase() === 'jelenleg' ||
      trimmed.toLowerCase() === 'present' ||
      trimmed.toLowerCase() === 'now'
    ) {
      return 'Jelenleg';
    }

    const months = [
      'Jan', 'Feb', 'Már', 'Ápr', 'Máj', 'Jún',
      'Júl', 'Aug', 'Szep', 'Okt', 'Nov', 'Dec'
    ];

    if (trimmed.includes('-')) {
      const parts = trimmed.split('-');
      if (parts.length === 2) {
        const monthNum = parseInt(parts[0], 10);
        const year = parts[1];
        if (!isNaN(monthNum) && monthNum >= 1 && monthNum <= 12 && year) {
          return `${year}. ${months[monthNum - 1]}`;
        }
      }
    }

    return trimmed;
  }
}
