import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

type Lang = 'ar' | 'en';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);
  readonly currentLang = signal<Lang>('ar');

  toggle(): void {
    const next: Lang = this.currentLang() === 'ar' ? 'en' : 'ar';
    this.currentLang.set(next);
    this.translate.use(next);
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
  }
}
