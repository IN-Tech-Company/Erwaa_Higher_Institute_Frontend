import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageStoreService } from '../../../../shared/services/language-store.service';

interface BannerSlide {
  image: string;
  altKey: string;
}

/**
 * Pure visual divider between homepage sections — 2 pre-designed marketing
 * banners (client-provided, full text/CTA baked into the image itself),
 * auto-rotating, full-bleed width. No title/eyebrow/text of our own on
 * purpose (client request 2026-09-17: "مفيش أي حاجة تانية خالص بس كده زي
 * فاصل" — nothing else at all, just like a divider). The whole banner
 * links to the courses page since slide 2's own baked-in CTA ("استعرض
 * الدورات الآن") points there.
 */
@Component({
  selector: 'app-promo-banner',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './promo-banner.html',
  styleUrl: './promo-banner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromoBannerComponent implements OnInit, OnDestroy {
  private readonly langStore = inject(LanguageStoreService);
  readonly lang = this.langStore.currentLanguage;

  readonly slides: BannerSlide[] = [
    { image: '/assets/images/slider/slider.png', altKey: 'LANDING.PROMO_BANNER.SLIDE1_ALT' },
    { image: '/assets/images/slider/slider-2.png', altKey: 'LANDING.PROMO_BANNER.SLIDE2_ALT' },
    { image: '/assets/images/slider/slider-3.png', altKey: 'LANDING.PROMO_BANNER.SLIDE3_ALT' },
  ];

  readonly currentIndex = signal(0);

  private interval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.interval = setInterval(() => {
      this.currentIndex.update((i) => (i + 1) % this.slides.length);
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.interval) clearInterval(this.interval);
  }

  readonly coursesLink = () => ['/', this.lang(), 'courses'];
}
