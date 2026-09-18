import { inject, Injectable } from '@angular/core';
import { LanguageStoreService } from './language-store.service';
import { ISupportedLanguages } from './supported-languages';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  languageStore = inject(LanguageStoreService);
  constructor() { }

  getCurrentLanguage(): ISupportedLanguages {
    return this.languageStore.currentLanguage();
  }

  changeLanguage(lang: ISupportedLanguages): void {
    this.languageStore.changeLanguage(lang);
  }

  setLanguage(lang: ISupportedLanguages): void {
    this.languageStore.setLanguage(lang);
  }

  get currentLanguage() {
    return this.languageStore.currentLanguage;
  }

  get direction() {
    return this.languageStore.direction;
  }

  get isRTL() {
    return this.languageStore.isRTL;
  }

  get state() {
    return this.languageStore.state;
  }
}
