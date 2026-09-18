import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

interface SocialLink {
  key: 'whatsapp' | 'telegram' | 'x' | 'instagram' | 'snapchat';
  labelKey: string;
  href: string;
}


@Component({
  selector: 'app-social-links',
  imports: [TranslatePipe],
  templateUrl: './social-links.html',
  styleUrl: './social-links.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialLinksComponent {
  readonly tone = input<'light' | 'dark'>('light');

  readonly links: SocialLink[] = [
    { key: 'whatsapp', labelKey: 'LANDING.TOPBAR.SOCIAL_WHATSAPP', href: 'https://wa.me/966551980550' },
    { key: 'telegram', labelKey: 'LANDING.TOPBAR.SOCIAL_TELEGRAM', href: 'https://t.me/+966551980550' },
    { key: 'x', labelKey: 'LANDING.TOPBAR.SOCIAL_X', href: 'https://x.com/institute_Erwaa' },
    { key: 'instagram', labelKey: 'LANDING.TOPBAR.SOCIAL_INSTAGRAM', href: '#' },
    { key: 'snapchat', labelKey: 'LANDING.TOPBAR.SOCIAL_SNAPCHAT', href: '#' },
  ];
}
