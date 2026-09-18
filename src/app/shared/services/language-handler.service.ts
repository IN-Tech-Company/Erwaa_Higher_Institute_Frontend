import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageHandlerService {
  private supportedLanguages = ['ar', 'en'];
  private defaultLanguage = 'ar';
  private currentLanguage = this.defaultLanguage;

  constructor(
    private translate: TranslateService,
    private router: Router,
    @Inject(LOCALE_ID) private locale: string
  ) {
    this.initializeLanguage();
    this.setupRouterSubscription();
  }

  private initializeLanguage(): void {
    this.translate.setDefaultLang(this.defaultLanguage);

    const language = this.detectLanguage();
    this.setLanguage(language);
  }

  private detectLanguage(): string {
    const urlLang = this.getLanguageFromUrl();
    if (urlLang && this.supportedLanguages.includes(urlLang)) {
      return urlLang;
    }

    const storedLang = localStorage.getItem('selectedLanguage');
    if (storedLang && this.supportedLanguages.includes(storedLang)) {
      return storedLang;
    }

    const browserLang = this.getBrowserLanguage();
    if (browserLang && this.supportedLanguages.includes(browserLang)) {
      return browserLang;
    }

    return this.defaultLanguage;
  }

  private getLanguageFromUrl(): string | null {
    const url = this.router.url;
    const segments = url.split('/');
    return segments[1] || null;
  }

  private getBrowserLanguage(): string | null {
    const browserLang = navigator.language || (navigator as any).userLanguage;
    if (browserLang) {
      const langCode = browserLang.split('-')[0];
      return this.supportedLanguages.includes(langCode) ? langCode : null;
    }
    return null;
  }

  private setupRouterSubscription(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const urlLang = this.getLanguageFromUrl();
        if (urlLang && this.supportedLanguages.includes(urlLang) && urlLang !== this.currentLanguage) {
          this.setLanguage(urlLang);
        }
      });
  }

  setLanguage(language: string): void {
    if (this.supportedLanguages.includes(language)) {
      this.currentLanguage = language;
      this.translate.use(language);

      this.updateDocumentDirection(language);

      this.updateDocumentLanguage(language);

      localStorage.setItem('selectedLanguage', language);

      this.updateLocale(language);
    }
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  getSupportedLanguages(): string[] {
    return this.supportedLanguages;
  }

  isRTL(): boolean {
    return this.currentLanguage === 'ar';
  }

  isLTR(): boolean {
    return this.currentLanguage === 'en';
  }

  switchLanguage(language: string): void {
    if (this.supportedLanguages.includes(language) && language !== this.currentLanguage) {
      const currentPath = this.getCurrentPathWithoutLanguage();
      this.router.navigate([`/${language}${currentPath}`]);
    }
  }

  private getCurrentPathWithoutLanguage(): string {
    const currentUrl = this.router.url;
    return currentUrl.replace(/^\/[a-z]{2}/, '') || '/';
  }

  private updateDocumentDirection(language: string): void {
    const direction = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', language);
  }

  private updateDocumentLanguage(language: string): void {
    document.documentElement.setAttribute('lang', language);
  }

  private updateLocale(language: string): void {
    const locale = language === 'ar' ? 'ar-SA' : 'en-US';
    document.documentElement.setAttribute('data-locale', locale);
  }

  getText(key: string, params?: any): string {
    return this.translate.instant(key, params);
  }

  getTextAsync(key: string, params?: any) {
    return this.translate.get(key, params);
  }

  isArabic(): boolean {
    return this.currentLanguage === 'ar';
  }

  isEnglish(): boolean {
    return this.currentLanguage === 'en';
  }
}
