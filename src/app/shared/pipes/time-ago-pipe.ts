import { inject, Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from '../services/language.service';

@Pipe({
  name: 'timeAgo',
  standalone: true,
  pure: false,
})
export class TimeAgoPipe implements PipeTransform {
  private readonly languageService = inject(LanguageService);

  transform(value: string | Date | null | undefined): string {
    if (!value) return '';
    const date = new Date(value);
    if (isNaN(date.getTime())) return '';

    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 0) return this._now();

    if (seconds < 60) return this._now();

    const intervals: { en: string; ar: string; s: number }[] = [
      { en: 'year', ar: 'سنة', s: 31_536_000 },
      { en: 'month', ar: 'شهر', s: 2_592_000 },
      { en: 'week', ar: 'أسبوع', s: 604_800 },
      { en: 'day', ar: 'يوم', s: 86_400 },
      { en: 'hour', ar: 'ساعة', s: 3_600 },
      { en: 'minute', ar: 'دقيقة', s: 60 },
    ];

    const locale = this.languageService.getCurrentLanguage();

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.s);
      if (count < 1) continue;

      if (locale === 'ar') {
        return this._arabicAgo(count, interval.ar, interval.en);
      } else {
        return this._englishAgo(count, interval.en);
      }
    }

    return this._now();
  }

  private _englishAgo(count: number, unit: string): string {
    const plural = count > 1 ? unit + 's' : unit;
    return count === 1 ? `a ${unit} ago` : `${count} ${plural} ago`;
  }

  private _arabicAgo(count: number, arUnit: string, enUnit: string): string {
    if (count === 1) return `منذ ${arUnit}`;
    if (count === 2) return `منذ ${this._arabicDual(enUnit)}`;
    if (count <= 10) return `منذ ${count} ${arUnit}`;
    return `منذ ${count} ${arUnit}`;
  }

  private _arabicDual(enUnit: string): string {
    const duals: Record<string, string> = {
      year: 'سنتين',
      month: 'شهرين',
      week: 'أسبوعين',
      day: 'يومين',
      hour: 'ساعتين',
      minute: 'دقيقتين',
    };
    return duals[enUnit] ?? '';
  }

  private _now(): string {
    return this.languageService.getCurrentLanguage() === 'ar' ? 'الآن' : 'just now';
  }
}