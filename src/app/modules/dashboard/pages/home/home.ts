import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { LanguageStoreService } from '../../../../shared/services/language-store.service';
import { TokenService } from '../../../../shared/services/token.service';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly langStore = inject(LanguageStoreService);
  private readonly tokenService = inject(TokenService);

  readonly lang = this.langStore.currentLanguage;

  readonly greeting = computed(() => {
    const name = this.tokenService.getName();
    if (this.lang() === 'ar') {
      return name ? `أهلاً بك، ${name}` : 'أهلاً بك';
    }
    return name ? `Welcome, ${name}` : 'Welcome';
  });

  readonly subtitle = computed(() =>
    this.lang() === 'ar' ? 'نظرة سريعة على لوحة التحكم' : 'A quick overview of your dashboard'
  );
}
