import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageStoreService } from '../../../../shared/services/language-store.service';

interface Testimonial {
  quoteKey: string;
  nameKey: string;
  roleKey: string;
}

const QUOTE_LIMIT = 260;

@Component({
  selector: 'app-testimonials-section',
  imports: [TranslatePipe],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonialsSectionComponent {
  private readonly translate = inject(TranslateService);
  private readonly langStore = inject(LanguageStoreService);

  private readonly index = signal(0);
  readonly expanded = signal(false);

  readonly items: Testimonial[] = [
    { quoteKey: 'ITEM1_QUOTE', nameKey: 'ITEM1_NAME', roleKey: 'ITEM1_ROLE' },
    { quoteKey: 'ITEM2_QUOTE', nameKey: 'ITEM2_NAME', roleKey: 'ITEM2_ROLE' },
    { quoteKey: 'ITEM3_QUOTE', nameKey: 'ITEM3_NAME', roleKey: 'ITEM3_ROLE' },
    { quoteKey: 'ITEM4_QUOTE', nameKey: 'ITEM4_NAME', roleKey: 'ITEM4_ROLE' },
    { quoteKey: 'ITEM5_QUOTE', nameKey: 'ITEM5_NAME', roleKey: 'ITEM5_ROLE' },
  ];

  readonly current = computed(() => this.items[this.index()]);

  /** Full, untranslated-pipe quote text — re-reads on language switch too. */
  private readonly fullQuote = computed(() => {
    this.langStore.currentLanguage(); // re-run this computed on language change
    return this.translate.instant('LANDING.TESTIMONIALS.' + this.current().quoteKey);
  });

  readonly isLong = computed(() => this.fullQuote().length > QUOTE_LIMIT);

  readonly displayQuote = computed(() => {
    const full = this.fullQuote();
    if (this.expanded() || full.length <= QUOTE_LIMIT) return full;
    return full.slice(0, QUOTE_LIMIT).trimEnd() + '…';
  });

  prev(): void {
    this.index.update((i) => (i - 1 + this.items.length) % this.items.length);
    this.expanded.set(false);
  }

  next(): void {
    this.index.update((i) => (i + 1) % this.items.length);
    this.expanded.set(false);
  }

  toggleExpanded(): void {
    this.expanded.update((v) => !v);
  }
}
