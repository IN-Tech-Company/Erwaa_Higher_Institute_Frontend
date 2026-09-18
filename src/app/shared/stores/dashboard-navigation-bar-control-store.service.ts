import { Injectable, signal, computed, inject } from '@angular/core';
import { LanguageStoreService } from '../services/language-store.service';
import { ISupportedLanguages } from '../services/supported-languages';
import { NavService } from '../services/nav.service';

export interface MenuItem {
  icon: string;
  labelEn: string;
  labelAr: string;
  route: string;
  active?: boolean;
  badge?: number | string;
}

@Injectable({ providedIn: 'root' })
export class DashbaordNavigationBarControlStore {
  private readonly navService = inject(NavService);

  langStore = inject(LanguageStoreService);
  langService = inject(LanguageStoreService);
  lang = this.langService.currentLanguage();
  isRtl = computed(() => this.langService.currentLanguage() === 'ar');

  isOpen = signal<boolean>(true);
  isCollapsed = signal<boolean>(false);

  /** Toggle button: always closes (or opens when closed). If collapsed, resets to full first. */
  toggleSidebar(): void {
    if (this.isCollapsed()) this.isCollapsed.set(false);
    this.isOpen.update((v) => !v);
  }

  /** Collapse button: toggles icon-only mode without hiding the sidebar. */
  toggleCollapse(): void {
    const next = !this.isCollapsed();
    this.isCollapsed.set(next);
    if (next) this.isOpen.set(true);
  }

  closeNavbar(): void {
    this.isOpen.set(false);
    this.isCollapsed.set(false);
  }

  setLanguage(lang: ISupportedLanguages): void {
    this.langService.setLanguage(lang);
    this.langStore.changeLanguage(lang);
  }

  navigate(item: MenuItem, items: MenuItem[]): void {
    items.forEach((i) => (i.active = false));
    item.active = true;
    this.navService.go(`${item.route}`);
  }
}
