import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthBrandService } from '../../../../shared/services/auth-brand.service';
import { LanguageStoreService } from '../../../../shared/services/language-store.service';
import { ISupportedLanguages } from '../../../../shared/services/supported-languages';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, RouterLink, TranslatePipe],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayoutComponent implements OnInit, OnDestroy {
  readonly brand = inject(AuthBrandService);
  readonly langStore = inject(LanguageStoreService);

  readonly currentIndex = signal(0);

  readonly homeLink = computed(() => ['/', this.langStore.currentLanguage()]);

  readonly logoSrc = computed(() => '/assets/images/logo/logo.png');

  readonly brandLogoSrc = computed(() => '/assets/images/logo/logo.png');

  readonly langToggleKey = computed(() =>
    this.langStore.currentLanguage() === 'ar' ? 'AUTH.LANG_TO_EN' : 'AUTH.LANG_TO_AR'
  );

  readonly safeIndex = computed(() => {
    const len = this.brand.slides().length;
    return len === 0 ? 0 : this.currentIndex() % len;


  });

  private interval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.interval = setInterval(() => {
      const len = this.brand.slides().length;
      if (len > 0) this.currentIndex.update(i => (i + 1) % len);
    }, 4000);
  }

  ngOnDestroy(): void {
    if (this.interval) clearInterval(this.interval);
  }

  switchLanguage(): void {
    const next: ISupportedLanguages = this.langStore.currentLanguage() === 'ar' ? 'en' : 'ar';
    this.langStore.changeLanguage(next);
  }

  goTo(index: number): void {
    this.currentIndex.set(index);
  }
}
