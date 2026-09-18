import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopNavbar } from '../../components/layout/top-navbar/top-navbar';
import { Sidebar } from '../../components/layout/sidebar/sidebar';
import { SidePanelComponent } from '../../../../shared/components/side-panel/side-panel';
import { DashbaordNavigationBarControlStore } from '../../../../shared/stores/dashboard-navigation-bar-control-store.service';
import { ISupportedLanguages } from '../../../../shared/services/supported-languages';
import { LanguageStoreService } from '../../../../shared/services/language-store.service';
import { FcmService } from '../../../../shared/services/notifications/fcm.service';

@Component({
  selector: 'app-dashboard-layout-container',
  standalone: true,
  imports: [RouterOutlet, TopNavbar, Sidebar, SidePanelComponent],
  templateUrl: './dashboard-layout-container.html',
  styleUrl: './dashboard-layout-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayoutContainerComponent implements OnInit, OnDestroy {
  readonly store = inject(DashbaordNavigationBarControlStore);
  private langService = inject(LanguageStoreService)
  private fcm = inject(FcmService);
  private resizeHandler = () => this.checkScreenSize();

  readonly sidebarEffectivelyCollapsed = computed(() => this.store.isCollapsed());

  ngOnInit(): void {
    const savedLang = this.langService.currentLanguage();
    this.applyLanguage(savedLang);
    this.checkScreenSize();
    window.addEventListener('resize', this.resizeHandler);
    this.fcm.init().catch((err) => console.error('[FCM] init rejected:', err));
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeHandler);
  }

  private applyLanguage(lang: ISupportedLanguages): void {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }

  private checkScreenSize(): void {
    if (window.innerWidth <= 768) {
      this.store.isOpen.set(false);
      this.store.isCollapsed.set(false);
    } else {
      this.store.isOpen.set(true);
    }
  }
}