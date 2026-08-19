import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { gsap } from 'gsap';
import { Languages } from './common/enums';
import { IProyect } from './common/interfaces';
import { DataService } from './common/services/data.service';

export interface Chapter {
  id: string;
  code: string;
  name: string;
}

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit, OnDestroy {
  DATA: any;
  skills: any = [];
  projects: Array<IProyect> = [];
  currentLanguage: Languages = Languages.HUNGARIAN;
  private unsubscribe$: Subject<void> = new Subject();

  activeChapterIndex: number = 0;
  isTransitioning: boolean = false;
  isSplashActive: boolean = true;
  private lastWheelTime: number = 0;
  private touchStartY: number = 0;
  private touchStartX: number = 0;
  private touchStartTime: number = 0;
  private wheelDeltaY: number = 0;
  private wheelResetTimer: any = null;
  private lastChapterTransitionTime: number = 0;

  readonly chapters: Chapter[] = [
    { id: 'home', code: '01', name: 'Kezdőlap' },
    { id: 'about', code: '02', name: 'Rólam' },
    { id: 'skills', code: '03', name: 'Készségek' },
    { id: 'projects', code: '04', name: 'Projektek' },
    { id: 'experience', code: '05', name: 'Tapasztalat' },
    { id: 'contact', code: '06', name: 'Kapcsolat' },
  ];

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    if (this.wheelResetTimer) {
      clearTimeout(this.wheelResetTimer);
    }
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.router.navigate(['']);

    this.dataService.currentLanguage$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((lang: Languages) => {
        this.currentLanguage = lang;
        this.loadConfig(lang);
      });
  }

  onSplashComplete(selectedLang: Languages): void {
    this.isSplashActive = false;
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

  @HostListener('window:wheel', ['$event'])
  onWheel(event: WheelEvent): void {
    // 1. Splash képernyő vizsgálat
    if (document.querySelector('.intro-splash')) return;

    // 2. Animációs zár
    if (this.isTransitioning) {
      event.preventDefault();
      return;
    }

    const now = Date.now();
    if (now - this.lastChapterTransitionTime < 650) {
      return;
    }

    const currentId = this.chapters[this.activeChapterIndex]?.id;
    const currentPanel = document.getElementById(currentId);

    if (currentPanel) {
      const maxScroll = currentPanel.scrollHeight - currentPanel.clientHeight;
      const isScrollable = maxScroll > 8;

      if (isScrollable) {
        const isAtBottom = currentPanel.scrollTop >= maxScroll - 4;
        const isAtTop = currentPanel.scrollTop <= 4;

        // Belső lefelé görgetés: közvetlen elmozdítás
        if (event.deltaY > 0 && !isAtBottom) {
          currentPanel.scrollTop += event.deltaY;
          this.wheelDeltaY = 0;
          return;
        }

        // Belső felfelé görgetés: közvetlen elmozdítás
        if (event.deltaY < 0 && !isAtTop) {
          currentPanel.scrollTop += event.deltaY;
          this.wheelDeltaY = 0;
          return;
        }
      }
    }

    // 3. Határra érve / 100vh szekciónál: Delta-Akkumuláció
    this.wheelDeltaY += event.deltaY;

    if (this.wheelResetTimer) {
      clearTimeout(this.wheelResetTimer);
    }
    this.wheelResetTimer = setTimeout(() => {
      this.wheelDeltaY = 0;
    }, 220);

    if (this.wheelDeltaY > 30) {
      this.wheelDeltaY = 0;
      this.lastChapterTransitionTime = now;
      this.nextChapter();
    } else if (this.wheelDeltaY < -30) {
      this.wheelDeltaY = 0;
      this.lastChapterTransitionTime = now;
      this.prevChapter();
    }
  }

  @HostListener('window:touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    if (event.touches.length !== 1) return;
    this.touchStartY = event.touches[0].clientY;
    this.touchStartX = event.touches[0].clientX;
    this.touchStartTime = Date.now();
  }

  @HostListener('window:touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    if (document.querySelector('.intro-splash') || this.isTransitioning || event.changedTouches.length !== 1) return;

    const now = Date.now();
    if (now - this.lastChapterTransitionTime < 650) return;

    const deltaY = this.touchStartY - event.changedTouches[0].clientY;
    const deltaX = this.touchStartX - event.changedTouches[0].clientX;
    const deltaTime = now - this.touchStartTime;

    if (Math.abs(deltaY) > Math.abs(deltaX) * 1.2 && Math.abs(deltaY) > 35 && deltaTime < 800) {
      const currentId = this.chapters[this.activeChapterIndex]?.id;
      const currentPanel = document.getElementById(currentId);

      if (currentPanel) {
        const maxScroll = currentPanel.scrollHeight - currentPanel.clientHeight;
        const isScrollable = maxScroll > 8;
        if (isScrollable) {
          const isAtBottom = currentPanel.scrollTop >= maxScroll - 4;
          const isAtTop = currentPanel.scrollTop <= 4;

          // Swipe Up (lefelé mozgatás)
          if (deltaY > 0 && !isAtBottom) {
            return;
          }
          // Swipe Down (felfelé mozgatás)
          if (deltaY < 0 && !isAtTop) {
            return;
          }
        }
      }

      this.lastChapterTransitionTime = now;
      if (deltaY > 0) {
        this.nextChapter();
      } else {
        this.prevChapter();
      }
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (document.querySelector('.intro-splash') || this.isTransitioning) return;

    const currentId = this.chapters[this.activeChapterIndex]?.id;
    const currentPanel = document.getElementById(currentId);
    const maxScroll = currentPanel ? currentPanel.scrollHeight - currentPanel.clientHeight : 0;
    const isScrollable = maxScroll > 8;
    const isAtBottom = currentPanel ? currentPanel.scrollTop >= maxScroll - 4 : true;
    const isAtTop = currentPanel ? currentPanel.scrollTop <= 4 : true;

    switch (event.code) {
      case 'ArrowDown':
      case 'PageDown':
      case 'Space':
        if (!isScrollable || isAtBottom) {
          event.preventDefault();
          this.nextChapter();
        } else if (currentPanel) {
          currentPanel.scrollTop += 120;
        }
        break;
      case 'ArrowUp':
      case 'PageUp':
        if (!isScrollable || isAtTop) {
          event.preventDefault();
          this.prevChapter();
        } else if (currentPanel) {
          currentPanel.scrollTop -= 120;
        }
        break;
      case 'Home':
        event.preventDefault();
        this.goToChapter(0);
        break;
      case 'End':
        event.preventDefault();
        this.goToChapter(this.chapters.length - 1);
        break;
    }
  }

  nextChapter(): void {
    if (this.activeChapterIndex < this.chapters.length - 1) {
      this.goToChapter(this.activeChapterIndex + 1);
    }
  }

  prevChapter(): void {
    if (this.activeChapterIndex > 0) {
      this.goToChapter(this.activeChapterIndex - 1);
    }
  }

  goToChapter(targetIndex: number): void {
    if (document.querySelector('.intro-splash') || this.isTransitioning || targetIndex === this.activeChapterIndex) return;
    if (targetIndex < 0 || targetIndex >= this.chapters.length) return;

    const fromIndex = this.activeChapterIndex;
    const isForward = targetIndex > fromIndex;
    this.activeChapterIndex = targetIndex;
    this.isTransitioning = true;

    const fromId = this.chapters[fromIndex].id;
    const toId = this.chapters[targetIndex].id;
    const fromEl = document.getElementById(fromId);
    const toEl = document.getElementById(toId);

    if (!fromEl || !toEl) {
      this.isTransitioning = false;
      return;
    }

    // Scroll pozíció intelligens beállítása a célpanelen
    if (isForward) {
      toEl.scrollTop = 0;
    } else {
      const maxScroll = toEl.scrollHeight - toEl.clientHeight;
      if (maxScroll > 8) {
        toEl.scrollTop = maxScroll;
      } else {
        toEl.scrollTop = 0;
      }
    }

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(fromEl, {
          clearProps: 'transform,opacity,filter,zIndex,visibility',
        });
        gsap.set(toEl, {
          clearProps: 'transform,opacity,filter,zIndex,visibility',
        });
        this.isTransitioning = false;
      },
    });

    if (isForward) {
      gsap.set(toEl, {
        visibility: 'visible',
        yPercent: 100,
        scale: 1,
        opacity: 1,
        filter: 'blur(0px)',
        zIndex: 30,
      });
      gsap.set(fromEl, { zIndex: 10 });

      tl.to(
        fromEl,
        {
          scale: 0.94,
          opacity: 0.2,
          yPercent: -12,
          filter: 'blur(2px)',
          duration: 0.75,
          ease: 'power2.inOut',
        },
        0
      );

      tl.to(
        toEl,
        {
          yPercent: 0,
          duration: 0.75,
          ease: 'power3.out',
        },
        0
      );
    } else {
      gsap.set(toEl, {
        visibility: 'visible',
        scale: 0.94,
        opacity: 0.2,
        yPercent: -12,
        filter: 'blur(2px)',
        zIndex: 10,
      });
      gsap.set(fromEl, { zIndex: 30 });

      tl.to(
        fromEl,
        {
          yPercent: 100,
          duration: 0.75,
          ease: 'power2.inOut',
        },
        0
      );

      tl.to(
        toEl,
        {
          scale: 1,
          opacity: 1,
          yPercent: 0,
          filter: 'blur(0px)',
          duration: 0.75,
          ease: 'power3.out',
        },
        0
      );
    }

    // Staggered reveal for internal content elements
    const contentToReveal = toEl.querySelectorAll(
      'h1, h2, h3, .about-card, .skill-section, .projects-swiper, .experience-row, .contact-statement, .home-subtitle'
    );
    if (contentToReveal && contentToReveal.length > 0) {
      tl.fromTo(
        contentToReveal,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.04, ease: 'power2.out' },
        0.25
      );
    }
  }
}
