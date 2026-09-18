import {
  EnvironmentProviders,
  LOCALE_ID,
  makeEnvironmentProviders,
} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/ar';
import localeEn from '@angular/common/locales/en';

// Register locales
registerLocaleData(localeAr, 'ar');
registerLocaleData(localeEn, 'en');

export function provideAppLocale(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: LOCALE_ID,
      useValue: 'ar-SA',
    },
  ]);
}
