import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

interface ContactInfoItem {
  icon: 'whatsapp' | string;
  labelKey: string;
  value: string;
  href: string;
}


@Component({
  selector: 'app-contact-section',
  imports: [TranslatePipe],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactSectionComponent {
  readonly infoItems: ContactInfoItem[] = [
    { icon: 'whatsapp', labelKey: 'LANDING.CONTACT.PHONE1_LABEL', value: '+966 55 198 0550', href: 'https://wa.me/966551980550' },
    { icon: 'whatsapp', labelKey: 'LANDING.CONTACT.PHONE2_LABEL', value: '+966 55 025 5950', href: 'https://wa.me/966550255950' },
    { icon: 'mail', labelKey: 'LANDING.CONTACT.EMAIL_LABEL', value: 'Erwaa.institute@gmail.com', href: 'mailto:Erwaa.institute@gmail.com' },
  ];

  readonly submitted = signal(false);

  onSubmit(event: Event): void {
    event.preventDefault();
    this.submitted.set(true);
  }
}
