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
  @ViewChild('sliderTrack') sliderTrackRef?: ElementRef<HTMLDivElement>;
  @ViewChild('sliderThumb') sliderThumbRef?: ElementRef<HTMLDivElement>;
  @ViewChild('sliderProgress') sliderProgressRef?: ElementRef<HTMLDivElement>;
  @ViewChild('sliderText') sliderTextRef?: ElementRef<HTMLDivElement>;

  isVisible: boolean = true;
  Languages = Languages;
  Math = Math;
  selectedLang: Languages = Languages.HUNGARIAN;
  private tl: any = null;
  private autoTimer: any = null;
  private isClosing: boolean = false;

  title: string = 'Bán János';
  subTitle: string = 'FULL-STACK & MOBILE ENGINEER';
  columns: number[] = Array.from({ length: 9 }, (_, i) => i);

  // Precíz csúszka állapot (későbbi használatra megőrizve)
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

    // Finom aranyszínű állapotjelző vonal beúsztatása
    this.tl.fromTo(
      '.intro-progress-line',
      { width: '0%', opacity: 0 },
      { width: '100%', opacity: 1, duration: 1.1, ease: 'power2.inOut' },
      '>-0.2'
    );

    // Automatikus továbblépés rövid megjelenés után (~1.8 mp)
    this.autoTimer = setTimeout(() => {
      this.closeSplash();
    }, 1850);
  }

  ngOnDestroy(): void {
    if (this.autoTimer) {
      clearTimeout(this.autoTimer);
    }
  }

  // Kattintással azonnal átugorható
  skipSplash(): void {
    if (this.isClosing) return;
    if (this.autoTimer) {
      clearTimeout(this.autoTimer);
    }
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

  closeSplash(): void {
    if (this.isClosing) return;
    this.isClosing = true;

    const exitTl = gsap.timeline();

    exitTl.to('.intro-auto-bar', {
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in'
    });

    exitTl.to(
      '.intro-text',
      {
        y: -45,
        opacity: 0,
        duration: 0.35,
        stagger: {
          amount: 0.2,
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
        duration: 0.8,
        stagger: {
          amount: 0.3,
          from: 'start'
        },
        ease: 'power3.inOut',
        onComplete: () => {
          this.isVisible = false;
          this.dataService.setLanguage(this.selectedLang);
          this.animationComplete.emit(this.selectedLang);
        }
      },
      '>-0.1'
    );
  }

  // =========================================================================
  // KÉSŐBBI HASZNÁLATRA MEGŐRZÖTT VEZÉRLŐFÜGGVÉNYEK (CSÚSZKA + NYELVVÁLASZTÓ)
  // =========================================================================

  selectLanguage(lang: Languages): void {
    this.selectedLang = lang;
    this.dataService.setLanguage(lang);
  }

  private recalculateDimensions(): void {
    if (this.sliderTrackRef?.nativeElement && this.sliderThumbRef?.nativeElement) {
      const trackRect = this.sliderTrackRef.nativeElement.getBoundingClientRect();
      const thumbRect = this.sliderThumbRef.nativeElement.getBoundingClientRect();
      this.thumbWidth = thumbRect.width || 36;
      this.maxDragDistance = Math.max(60, trackRect.width - this.thumbWidth - 8);
    }
  }

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
    if (this.dragProgress >= 0.82) {
      this.triggerUnlock();
    }
  }

  @HostListener('window:pointerup', ['$event'])
  @HostListener('window:pointercancel', ['$event'])
  onPointerUp(event?: PointerEvent): void {
    if (!this.isDragging || this.isUnlocked) return;
    this.isDragging = false;

    if (this.sliderThumbRef?.nativeElement) {
      gsap.to(this.sliderThumbRef.nativeElement, { x: 0, duration: 0.45, ease: 'power4.out' });
    }
    if (this.sliderProgressRef?.nativeElement) {
      gsap.to(this.sliderProgressRef.nativeElement, { width: `${this.thumbWidth}px`, opacity: 0.3, duration: 0.45, ease: 'power4.out' });
    }
    if (this.sliderTextRef?.nativeElement) {
      gsap.to(this.sliderTextRef.nativeElement, { opacity: 1, x: 0, duration: 0.45, ease: 'power4.out' });
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

    if (this.sliderThumbRef?.nativeElement) {
      gsap.to(this.sliderThumbRef.nativeElement, { x: this.maxDragDistance, duration: 0.24, ease: 'power3.out' });
    }
    if (this.sliderProgressRef?.nativeElement) {
      gsap.to(this.sliderProgressRef.nativeElement, { width: `${this.maxDragDistance + this.thumbWidth}px`, opacity: 1, duration: 0.24, ease: 'power3.out' });
    }
    if (this.sliderTextRef?.nativeElement) {
      gsap.to(this.sliderTextRef.nativeElement, { opacity: 0, duration: 0.15 });
    }
    this.dragX = this.maxDragDistance;
    this.dragProgress = 1;
    this.cdr.markForCheck();

    setTimeout(() => {
      this.dataService.setLanguage(this.selectedLang);
      this.closeSplash();
    }, 180);
  }
}
