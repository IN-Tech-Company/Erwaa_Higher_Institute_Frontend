import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageStoreService } from '../../../shared/services/language-store.service';
import { ISupportedLanguages } from '../../../shared/services/supported-languages';

@Component({
  selector: 'app-legal-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './legal-layout.html',
  styleUrl: './legal-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegalLayoutComponent {
  readonly langStore = inject(LanguageStoreService);

  readonly homeLink = computed(() => ['/', this.langStore.currentLanguage()]);

  readonly logoSrc = computed(() => '/assets/images/logo/logo.png');

  readonly backIcon = computed(() =>
    this.langStore.direction() === 'rtl' ? 'arrow_forward' : 'arrow_back'
  );

  readonly tabs = [
    { path: 'privacy', icon: 'lock', labelKey: 'LEGAL.PRIVACY.TITLE' },
    { path: 'terms', icon: 'description', labelKey: 'LEGAL.TERMS.TITLE' },
    { path: 'ownership', icon: 'verified', labelKey: 'LEGAL.OWNERSHIP.TITLE' },
  ];

  readonly langToggleKey = computed(() =>
    this.langStore.currentLanguage() === 'ar' ? 'AUTH.LANG_TO_EN' : 'AUTH.LANG_TO_AR'
  );

  switchLanguage(): void {
    const next: ISupportedLanguages = this.langStore.currentLanguage() === 'ar' ? 'en' : 'ar';
    this.langStore.changeLanguage(next);
  }
}
