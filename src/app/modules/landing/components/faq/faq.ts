import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

interface FaqItem {
  key: string;
}

@Component({
  selector: 'app-faq-section',
  imports: [TranslatePipe],
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqSectionComponent {
  readonly items: FaqItem[] = [
    { key: 'ITEM1' },
    { key: 'ITEM2' },
    { key: 'ITEM3' },
    { key: 'ITEM4' },
    { key: 'ITEM5' },
  ];

  private readonly openKeys = signal<ReadonlySet<string>>(new Set(['ITEM1']));

  isOpen(key: string): boolean {
    return this.openKeys().has(key);
  }

  toggle(key: string): void {
    this.openKeys.update((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }
}
