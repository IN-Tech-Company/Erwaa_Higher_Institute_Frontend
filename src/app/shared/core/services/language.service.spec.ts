import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './language.service';

describe('LanguageService', () => {
  let service: LanguageService;
  let translateUseSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    translateUseSpy = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        LanguageService,
        {
          provide: TranslateService,
          useValue: { use: translateUseSpy },
        },
      ],
    });

    service = TestBed.inject(LanguageService);
    document.documentElement.dir = '';
  });

  it('starts with Arabic', () => {
    expect(service.currentLang()).toBe('ar');
  });

  it('toggle switches ar → en', () => {
    service.toggle();
    expect(service.currentLang()).toBe('en');
  });

  it('toggle switches en → ar', () => {
    service.toggle(); // ar → en
    service.toggle(); // en → ar
    expect(service.currentLang()).toBe('ar');
  });

  it('toggle calls TranslateService.use with new lang', () => {
    service.toggle();
    expect(translateUseSpy).toHaveBeenCalledWith('en');
  });

  it('toggle sets dir=ltr when switching to en', () => {
    service.toggle();
    expect(document.documentElement.dir).toBe('ltr');
  });

  it('toggle sets dir=rtl when switching to ar', () => {
    service.toggle(); // ar → en
    service.toggle(); // en → ar
    expect(document.documentElement.dir).toBe('rtl');
  });
});
