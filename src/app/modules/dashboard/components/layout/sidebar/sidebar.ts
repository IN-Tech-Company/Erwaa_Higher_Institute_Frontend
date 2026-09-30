import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LanguageStoreService } from '../../../../../shared/services/language/language-store.service';
import { TokenService } from '../../../../../shared/services/token.service';
import { DashbaordNavigationBarControlStore } from '../../../../../shared/stores/dashboard-navigation-bar-control-store.service';
import { MENUS, MenuItem } from './sidebar-menus';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  readonly store = inject(DashbaordNavigationBarControlStore);
  private readonly tokenService = inject(TokenService);
  readonly lang = inject(LanguageStoreService).currentLanguage;

  readonly menu = computed(() => MENUS[this.tokenService.userRole()]);

  link(item: MenuItem): string[] {
    return ['/', this.lang(), ...item.path.split('/')];
  }
}
