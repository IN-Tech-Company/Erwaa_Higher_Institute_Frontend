import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageStoreService } from '../../../../shared/services/language-store.service';
import { SocialLinksComponent } from '../social-links/social-links';

interface FooterLink {
  labelKey: string;
  href: string | string[];
}

interface FooterContactItem {
  icon: 'whatsapp' | string;
  value: string;
  href: string;
}
@Component({
  selector: 'app-footer',
  imports: [RouterLink, TranslatePipe, SocialLinksComponent],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  private readonly langStore = inject(LanguageStoreService);

  readonly homeLink = computed(() => ['/', this.langStore.currentLanguage()]);
  readonly loginLink = computed(() => ['/', this.langStore.currentLanguage(), 'auth', 'login']);
  readonly termsLink = computed(() => ['/', this.langStore.currentLanguage(), 'legal', 'terms']);
  readonly privacyLink = computed(() => ['/', this.langStore.currentLanguage(), 'legal', 'privacy']);
  readonly ownershipLink = computed(() => ['/', this.langStore.currentLanguage(), 'legal', 'ownership']);

  readonly aboutLinks: FooterLink[] = [
    { labelKey: 'LANDING.FOOTER.LINK_ABOUT', href: '#about' },
    { labelKey: 'LANDING.FOOTER.LINK_FAQ', href: '#faq' },
  ];

  readonly servicesLinks: FooterLink[] = [
    { labelKey: 'LANDING.FOOTER.LINK_COURSES', href: '#courses' },
    { labelKey: 'LANDING.FOOTER.LINK_SPECIALIZATIONS', href: '#courses' },
    { labelKey: 'LANDING.FOOTER.LINK_STATS', href: '#stats' },
  ];

  readonly supportLinks: FooterLink[] = [
    { labelKey: 'LANDING.FOOTER.LINK_CONTACT', href: '#contact' },
    { labelKey: 'LANDING.FOOTER.LINK_HELP', href: '#faq' },
  ];

  readonly whatsappItems: FooterContactItem[] = [
    { icon: 'whatsapp', value: '+966 55 198 0550', href: 'https://wa.me/966551980550' },
    { icon: 'whatsapp', value: '+966 55 025 5950', href: 'https://wa.me/966550255950' },
  ];

  readonly emailItem: FooterContactItem = {
    icon: 'mail',
    value: 'Erwaa.institute@gmail.com',
    href: 'mailto:Erwaa.institute@gmail.com',
  };
}
