import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageStoreService } from '../../../../shared/services/language-store.service';

interface NavItem {
  labelKey: string;
  fragment: string;
}

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteHeaderComponent {
  private readonly langStore = inject(LanguageStoreService);

  readonly homeLink = computed(() => ['/', this.langStore.currentLanguage()]);
  readonly ctaLink = computed(() => ['/', this.langStore.currentLanguage(), 'auth', 'login']);

  readonly categoriesOpen = signal(false);
  readonly menuOpen = signal(false);

  readonly categories = [
    'LANDING.CATEGORY_LIST.SOFTWARE_DIPLOMA',
    'LANDING.CATEGORY_LIST.IT_COURSES',
    'LANDING.CATEGORY_LIST.DATA_ENTRY',
    'LANDING.CATEGORY_LIST.JOB_READINESS',
    'LANDING.CATEGORY_LIST.DIGITAL_MARKETING',
    'LANDING.CATEGORY_LIST.CYBER_SECURITY',
    'LANDING.CATEGORY_LIST.COMPUTER_BASICS',
    'LANDING.CATEGORY_LIST.POSITIVE_BEHAVIOR',
    'LANDING.CATEGORY_LIST.PROFESSIONAL_DEV',
  ];

  readonly navItems: NavItem[] = [
    { labelKey: 'LANDING.NAV.HOME', fragment: 'home' },
    { labelKey: 'LANDING.NAV.ABOUT', fragment: 'about' },
    { labelKey: 'LANDING.NAV.COURSES', fragment: 'courses' },
    { labelKey: 'LANDING.NAV.FEATURES', fragment: 'features' },
    { labelKey: 'LANDING.NAV.STATS', fragment: 'program-history' },
    { labelKey: 'LANDING.NAV.TESTIMONIALS', fragment: 'testimonials' },
    { labelKey: 'LANDING.NAV.FAQ', fragment: 'faq' },
    { labelKey: 'LANDING.NAV.CONTACT', fragment: 'contact' },
  ];

  toggleCategories(): void {
    this.categoriesOpen.update((v) => !v);
  }

  closeCategories(): void {
    this.categoriesOpen.set(false);
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
