import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { LanguageStoreService } from '../../services/language-store.service';

export interface SidebarTab {
  id: string;
  icon: string;
  labelAr: string;
  labelEn: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-sidebar-tabs',
  standalone: true,
  imports: [],
  templateUrl: './sidebar-tabs.html',
  styleUrl: './sidebar-tabs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarTabsComponent {
  private readonly langService = inject(LanguageStoreService);

  readonly tabs        = input.required<SidebarTab[]>();
  readonly activeTabId = input.required<string>();
  readonly title       = input<string>('');
  readonly tabChange   = output<string>();

  getLabel(tab: SidebarTab): string {
    return this.langService.currentLanguage() === 'ar' ? tab.labelAr : tab.labelEn;
  }
}
