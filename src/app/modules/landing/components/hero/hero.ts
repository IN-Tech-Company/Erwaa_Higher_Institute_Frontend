import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

interface HeroSlide {
  image: string;
  key: string;
}

@Component({
  selector: 'app-hero',
  imports: [TranslatePipe],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent implements OnInit, OnDestroy {
  readonly slides: HeroSlide[] = [
    { image: '/assets/images/hero/hero-reception.png', key: 'SLIDE1' },
    { image: '/assets/images/hero/hero-offline-sesstion.png', key: 'SLIDE2' },
    { image: '/assets/images/hero/hero-offline-sesstion-2.png', key: 'SLIDE3' },
    { image: '/assets/images/hero/hero-online-cource.png', key: 'SLIDE4' },
    { image: '/assets/images/hero/hero-certificate.png', key: 'SLIDE5' },
    { image: '/assets/images/hero/hero-logo.png', key: 'SLIDE6' },
  ];

  readonly activeIndex = signal(0);
  readonly activeSlide = computed(() => this.slides[this.activeIndex()]);

  private interval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  next(): void {
    this.activeIndex.update((i) => (i + 1) % this.slides.length);
    this.restartAutoplay();
  }

  prev(): void {
    this.activeIndex.update((i) => (i - 1 + this.slides.length) % this.slides.length);
    this.restartAutoplay();
  }

  private startAutoplay(): void {
    this.interval = setInterval(() => {
      this.activeIndex.update((i) => (i + 1) % this.slides.length);
    }, 6000);
  }

  private stopAutoplay(): void {
    if (this.interval) clearInterval(this.interval);
  }

  private restartAutoplay(): void {
    this.stopAutoplay();
    this.startAutoplay();
  }
}
