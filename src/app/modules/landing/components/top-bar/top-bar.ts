import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageStoreService } from '../../../../shared/services/language-store.service';
import { ISupportedLanguages } from '../../../../shared/services/supported-languages';
import { SocialLinksComponent } from '../social-links/social-links';

@Component({
  selector: 'app-top-bar',
  imports: [RouterLink, TranslatePipe, SocialLinksComponent],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopBarComponent {
  private readonly langStore = inject(LanguageStoreService);

  readonly loginLink = computed(() => ['/', this.langStore.currentLanguage(), 'auth', 'login']);

  readonly langToggleKey = computed(() =>
    this.langStore.currentLanguage() === 'ar' ? 'AUTH.LANG_TO_EN' : 'AUTH.LANG_TO_AR'
  );

  switchLanguage(): void {
    const next: ISupportedLanguages = this.langStore.currentLanguage() === 'ar' ? 'en' : 'ar';
    this.langStore.changeLanguage(next);
  }
}
