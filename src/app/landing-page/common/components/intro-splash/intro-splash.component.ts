import { Component, OnInit, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef, HostListener, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { gsap } from 'gsap';
import { Languages } from '../../enums';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-intro-splash',
  templateUrl: './intro-splash.component.html',
  styleUrls: ['./intro-splash.component.scss']
})
export class IntroSplashComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() animationComplete = new EventEmitter<Languages>();
  @ViewChild('sliderTrack') sliderTrackRef!: ElementRef<HTMLDivElement>;
  @ViewChild('sliderThumb') sliderThumbRef!: ElementRef<HTMLDivElement>;
  @ViewChild('sliderProgress') sliderProgressRef!: ElementRef<HTMLDivElement>;
  @ViewChild('sliderText') sliderTextRef!: ElementRef<HTMLDivElement>;

  isVisible: boolean = true;
  Languages = Languages;
  Math = Math;
  selectedLang: Languages = Languages.HUNGARIAN;
  private tl: any = null;

  title: string = 'Bán János';
  subTitle: string = 'FULL-STACK & MOBILE ENGINEER';
  columns: number[] = Array.from({ length: 9 }, (_, i) => i);

  // Precíz csúszka állapot
  dragX: number = 0;
  dragProgress: number = 0;
  isDragging: boolean = false;
  isUnlocked: boolean = false;
  private startPointerX: number = 0;
  private initialDragX: number = 0;
  private maxDragDistance: number = 240;
  private thumbWidth: number = 36;

  constructor(
    private dataService: DataService,
    private cdr: ChangeDetectorRef
  ) {}

  get titleLetters(): string[] {
    if (!this.title) return [];
    return this.title.split('');
  }

  get subtitleLetters(): string[] {
    if (!this.subTitle) return [];
    return this.subTitle.split('');
  }

  ngOnInit(): void {
    this.selectedLang = this.dataService.getCurrentLanguage() || Languages.HUNGARIAN;
  }

  ngAfterViewInit(): void {
    this.tl = gsap.timeline();
    this.animateWordsUp('.intro-text-up');
    this.animateWordsDown('.intro-text-down');
    this.animateWordsUp('.intro-subtitle', 0.5);
    
    // Nyelvválasztó és slider kártya beúsztatása
    this.tl.fromTo(
      '.intro-lang-card',
      { opacity: 0, y: 20, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: 'power3.out' },
      '>-0.1'
    );

    setTimeout(() => {
      this.recalculateDimensions();
    }, 100);
  }

  ngOnDestroy(): void {}

  private recalculateDimensions(): void {
    if (this.sliderTrackRef?.nativeElement && this.sliderThumbRef?.nativeElement) {
      const trackRect = this.sliderTrackRef.nativeElement.getBoundingClientRect();
      const thumbRect = this.sliderThumbRef.nativeElement.getBoundingClientRect();
      this.thumbWidth = thumbRect.width || 36;
      // 8px = 4px padding a két szélen
      this.maxDragDistance = Math.max(60, trackRect.width - this.thumbWidth - 8);
    }
  }

  selectLanguage(lang: Languages): void {
    this.selectedLang = lang;
    this.dataService.setLanguage(lang);
  }

  // --- Precíz, késleltetésmentes Direct-DOM elhúzáskezelő ---

  onDragStart(event: PointerEvent): void {
    if (this.isUnlocked) return;
    this.recalculateDimensions();
    this.isDragging = true;
    this.startPointerX = event.clientX;
    this.initialDragX = this.dragX;

    (event.currentTarget as HTMLElement)?.setPointerCapture?.(event.pointerId);
  }

  @HostListener('window:pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    if (!this.isDragging || this.isUnlocked) return;

    const deltaX = event.clientX - this.startPointerX;
    let newX = this.initialDragX + deltaX;

    if (newX < 0) newX = 0;
    if (newX > this.maxDragDistance) newX = this.maxDragDistance;

    this.dragX = newX;
    this.dragProgress = this.maxDragDistance > 0 ? this.dragX / this.maxDragDistance : 0;

    // Közvetlen GPU transzformáció 0ms késleltetéssel (60/120 FPS simaság)
    if (this.sliderThumbRef?.nativeElement) {
      this.sliderThumbRef.nativeElement.style.transform = `translate3d(${this.dragX}px, 0, 0)`;
    }
    if (this.sliderProgressRef?.nativeElement) {
      this.sliderProgressRef.nativeElement.style.width = `${this.dragX + this.thumbWidth}px`;
      this.sliderProgressRef.nativeElement.style.opacity = `${0.3 + this.dragProgress * 0.7}`;
    }
    if (this.sliderTextRef?.nativeElement) {
      this.sliderTextRef.nativeElement.style.opacity = `${Math.max(0, 1 - this.dragProgress * 1.5)}`;
      this.sliderTextRef.nativeElement.style.transform = `translate3d(${this.dragProgress * 18}px, 0, 0)`;
    }

    // Küszöbérték elérésekor (82%) azonnali finom feloldás
    if (this.dragProgress >= 0.82) {
      this.triggerUnlock();
    }
  }

  @HostListener('window:pointerup', ['$event'])
  @HostListener('window:pointercancel', ['$event'])
  onPointerUp(event?: PointerEvent): void {
    if (!this.isDragging || this.isUnlocked) return;
    this.isDragging = false;

    // Ha elengedi a felhasználó, elegáns rugózással csúszik vissza
    if (this.sliderThumbRef?.nativeElement) {
      gsap.to(this.sliderThumbRef.nativeElement, {
        x: 0,
        duration: 0.45,
        ease: 'power4.out'
      });
    }
    if (this.sliderProgressRef?.nativeElement) {
      gsap.to(this.sliderProgressRef.nativeElement, {
        width: `${this.thumbWidth}px`,
        opacity: 0.3,
        duration: 0.45,
        ease: 'power4.out'
      });
    }
    if (this.sliderTextRef?.nativeElement) {
      gsap.to(this.sliderTextRef.nativeElement, {
        opacity: 1,
        x: 0,
        duration: 0.45,
        ease: 'power4.out'
      });
    }

    this.dragX = 0;
    this.dragProgress = 0;
    this.cdr.markForCheck();
  }

  onTrackClick(event: MouseEvent): void {
    if (this.isUnlocked) return;
    this.recalculateDimensions();
    this.triggerUnlock();
  }

  private triggerUnlock(): void {
    if (this.isUnlocked) return;
    this.isUnlocked = true;
    this.isDragging = false;
    this.recalculateDimensions();

    // Sima, prémium záró animáció a célvonalig
    if (this.sliderThumbRef?.nativeElement) {
      gsap.to(this.sliderThumbRef.nativeElement, {
        x: this.maxDragDistance,
        duration: 0.24,
        ease: 'power3.out'
      });
    }
    if (this.sliderProgressRef?.nativeElement) {
      gsap.to(this.sliderProgressRef.nativeElement, {
        width: `${this.maxDragDistance + this.thumbWidth}px`,
        opacity: 1,
        duration: 0.24,
        ease: 'power3.out'
      });
    }
    if (this.sliderTextRef?.nativeElement) {
      gsap.to(this.sliderTextRef.nativeElement, {
        opacity: 0,
        duration: 0.15
      });
    }

    this.dragX = this.maxDragDistance;
    this.dragProgress = 1;
    this.cdr.markForCheck();

    setTimeout(() => {
      this.confirmLanguage();
    }, 180);
  }

  confirmLanguage(): void {
    this.dataService.setLanguage(this.selectedLang);
    this.closeSplash();
  }

  private animateWordsUp(query: string, time: number = 1): void {
    this.tl.from(query, {
      y: 70,
      opacity: 0,
      duration: time,
      stagger: 0.035,
      ease: 'power3.out'
    });
  }

  private animateWordsDown(query: string, time: number = 1): void {
    this.tl.from(
      query,
      {
        y: -70,
        opacity: 0,
        duration: time,
        stagger: 0.035,
        ease: 'power3.out'
      },
      '0'
    );
  }

  private closeSplash(): void {
    const exitTl = gsap.timeline();

    exitTl.to('.intro-lang-card', {
      opacity: 0,
      y: -15,
      scale: 0.97,
      duration: 0.35,
      ease: 'power2.in'
    });

    exitTl.to(
      '.intro-text',
      {
        y: -50,
        opacity: 0,
        duration: 0.38,
        stagger: {
          amount: 0.22,
          from: 'end'
        },
        ease: 'power3.in'
      },
      '<'
    );

    exitTl.to(
      '.splash-column',
      {
        y: '100vh',
        duration: 0.85,
        stagger: {
          amount: 0.35,
          from: 'start'
        },
        ease: 'power3.inOut',
        onComplete: () => {
          this.isVisible = false;
          this.animationComplete.emit(this.selectedLang);
        }
      },
      '>-0.1'
    );
  }
}
