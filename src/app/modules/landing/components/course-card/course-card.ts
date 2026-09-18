import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageStoreService } from '../../../../shared/services/language-store.service';
import { CoursePrice, CourseLevel } from '../../data/courses-catalog';


@Component({
  selector: 'app-course-card',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './course-card.html',
  styleUrl: './course-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseCardComponent {
  private readonly langStore = inject(LanguageStoreService);

  readonly image = input.required<string>();
  readonly title = input.required<string>();
  readonly badge = input<string>();
  readonly imageRatio = input<string>(); readonly price = input<CoursePrice>();
  readonly originalPrice = input<number | null>();
  readonly rating = input<number | null>();
  readonly level = input<CourseLevel>();
  readonly duration = input<string | null>();
  readonly link = input<(string | number)[]>();

  readonly hasPrice = computed(() => this.price() !== undefined);
  readonly hasMeta = computed(() => !!this.level() || !!this.duration());

  readonly levelLabelKey = computed(() => {
    const level = this.level();
    return level ? `LANDING.COURSE_DETAIL.LEVEL_${level.toUpperCase()}` : null;
  });

  readonly stars = computed(() => {
    const rating = this.rating() ?? 0;
    return Array.from({ length: 5 }, (_, i) => {
      const diff = rating - i;
      if (diff >= 1) return 'star';
      if (diff >= 0.5) return 'star_half';
      return 'star_border';
    });
  });

  private formatAmount(amount: number): string {
    const locale = this.langStore.currentLanguage() === 'ar' ? 'ar-SA' : 'en-US';
    return new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
  }

  readonly formattedPrice = computed(() => {
    const price = this.price();
    if (typeof price !== 'number') return '';
    return this.formatAmount(price);
  });

  readonly formattedOriginalPrice = computed(() => {
    const original = this.originalPrice();
    return original ? this.formatAmount(original) : '';
  });

  readonly savingsPercent = computed(() => {
    const price = this.price();
    const original = this.originalPrice();
    if (typeof price !== 'number' || !original || original <= price) return null;
    return Math.round(((original - price) / original) * 100);
  });
}
