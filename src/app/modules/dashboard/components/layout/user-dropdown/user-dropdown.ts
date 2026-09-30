import { ChangeDetectionStrategy, Component, HostListener, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '../../../../../shared/services/auth.store';
import { LanguageService } from '../../../../../shared/services/language/language.service';

import { TokenService } from '../../../../../shared/services/token.service';
import { FcmService } from '../../../../../shared/services/notifications/fcm.service';
export interface DropdownItem {
  icon: string;
  labelAr: string;
  labelEn: string;
  action: () => void;
  danger?: boolean;
}

@Component({
  selector: 'app-user-dropdown',
  standalone: true,
  imports: [],
  templateUrl: './user-dropdown.html',
  styleUrl: './user-dropdown.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDropdown {
  showHelp: boolean = false;
  showChangePassword: boolean = false;
  languageService = inject(LanguageService);
  isOpen = signal(false);

  private tokenService = inject(TokenService);
  private authStore = inject(AuthStore);
  private fcmService = inject(FcmService);
  private router = inject(Router);

  private readonly _defaultName = 'مستخدم';
  private readonly _defaultInitials = '؟';

  readonly currentUser = computed(() => {
    const user = this.tokenService.user();
    const name = user?.name || this._defaultName;
    return { name, email: user?.email ?? '', initials: this._initials(name) || this._defaultInitials };
  });

  private _initials(name: string): string {
    return name.split(' ').slice(0, 2).map((w) => w[0] ?? '').join('').toUpperCase();
  }

  menuItems: DropdownItem[] = [
    {
      icon: 'bx bx-globe',
      labelEn: 'Switch to Arabic',
      labelAr: 'التبديل للإنجليزية',
      action: () => this.switchLanguage(),
    },
    {
      icon: 'bx bx-lock-alt',
      labelEn: 'Change Password',
      labelAr: 'تغيير كلمة المرور',
      action: () => this.openChangePassword(),
    },
    {
      icon: 'bx bx-help-circle',
      labelEn: 'Help',
      labelAr: 'مساعدة',
      action: () => this.openHelp(),
    },
    {
      icon: 'bx bx-log-out',
      labelEn: 'Log Out',
      labelAr: 'تسجيل الخروج',
      action: () => this.logout(),
      danger: true,
    },
  ];

  toggle(): void {
    this.isOpen.update((v) => !v);
  }

  close(): void {
    this.isOpen.set(false);
  }

  onItemClick(item: DropdownItem): void {
    item.action();
    this.close();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-dropdown-wrap')) {
      this.close();
    }
  }

  switchLanguage(): void {
    const newLang = this.languageService.currentLanguage() === 'en' ? 'ar' : 'en';
    this.languageService.changeLanguage(newLang);
  }

  private logout(): void {
    this.fcmService.deregisterCurrent().finally(() => {
      this.authStore.logout();
      this.router.navigate(['/', this.languageService.currentLanguage(), 'auth', 'login']);
    });
  }

  isRtl() {
    return this.languageService.isRTL();
  }

  getLabel(item: DropdownItem) {
    return this.languageService.currentLanguage() === 'en' ? item.labelEn : item.labelAr;
  }

  openHelp(): void {
    this.showChangePassword = false
    this.showHelp = true;
  }

  openChangePassword(): void {
    this.showChangePassword = true
    this.showHelp = false;
  }

  handleHelpMessage($event: string) {
    console.log($event);
  }

}