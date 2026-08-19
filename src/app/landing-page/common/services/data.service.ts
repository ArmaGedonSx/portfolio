import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Languages } from '../enums';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private currentLangSubject = new BehaviorSubject<Languages>(Languages.HUNGARIAN);
  currentLanguage$: Observable<Languages> = this.currentLangSubject.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  setLanguage(lang: Languages): void {
    this.currentLangSubject.next(lang);
  }

  getCurrentLanguage(): Languages {
    return this.currentLangSubject.value;
  }

  getConfig(idiom: Languages) {
    const configPath = environment[idiom as unknown as keyof typeof environment] || environment.hungarian;
    return this.http.get(
      `${environment.config}${configPath}`
    );
  }

  getTecnologies() {
    return this.http.get(
      `${environment.tecnologies}`
    );
  }
}
