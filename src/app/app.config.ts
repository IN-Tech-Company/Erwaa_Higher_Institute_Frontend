import { ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withPreloading,
  PreloadAllModules,
  withInMemoryScrolling,
} from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { authInterceptor } from './shared/interceptors/auth.interceptor';
import { provideAppLocale } from './shared/providers/locale.provider';
import { provideTranslation } from './shared/providers/translation-provider';
import { LanguageStoreService } from './shared/services/language-store.service';
import { LanguageService } from './shared/services/language.service';
import { SeoService } from './shared/services/seo.service';
import { LanguageHandlerService } from './shared/services/language-handler.service';
import { providePrimeNGConfig } from './shared/providers/primeng-config.provider';
import localeAr from '@angular/common/locales/ar';
import localeEn from '@angular/common/locales/en';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeAr, 'ar');
registerLocaleData(localeEn, 'en');

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
      withPreloading(PreloadAllModules),
    ),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideTranslation(),
    provideAppLocale(),
    providePrimeNGConfig(),
    LanguageService,
    LanguageStoreService,
    SeoService,
    LanguageHandlerService
  ],
}; 
