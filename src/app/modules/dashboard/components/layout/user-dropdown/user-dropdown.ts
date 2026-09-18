import { ChangeDetectionStrategy, Component, HostListener, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../../shared/services/auth.service';
import { HelpPopupComponent } from '../../../../../shared/components/help-popup/help-popup';
import { LanguageService } from '../../../../../shared/services/language.service';
import { NavService } from '../../../../../shared/services/nav.service';
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
  imports: [HelpPopupComponent],
  templateUrl: './user-dropdown.html',
  styleUrl: './user-dropdown.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDropdown {
  showHelp: boolean = false;
  showChangePassword: boolean = false;
  private navService = inject(NavService);
  languageService = inject(LanguageService);
  isOpen = signal(false);

  private tokenService = inject(TokenService);
  private authService = inject(AuthService);
  private fcmService = inject(FcmService);

  private readonly _defaultName = 'مستخدم';
  private readonly _defaultInitials = '؟';

  readonly currentUser = signal({
    userId: this.tokenService.getReferenceId() ?? 0,
    name: this.tokenService.getName() || this._defaultName,
    greeting: 'Hello👋',
    avatar: '',
    initials: this._initials(this.tokenService.getName() || '') || this._defaultInitials,
  });

  readonly roleLabel = computed(() => {
    const isAr = this.languageService.currentLanguage() === 'ar';
    const map: Record<string, { ar: string; en: string }> = {
      ADMIN: { ar: 'مدير النظام', en: 'Admin' },
      TEACHER: { ar: 'معلم', en: 'Teacher' },
      TRAINEE: { ar: 'متدرب', en: 'Trainee' },
    };
    const entry = map[this.tokenService.userRole()];
    if (!entry) return '';
    return isAr ? entry.ar : entry.en;
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
      this.authService.logout().pipe(
        finalize(() => {
          this.tokenService.logout();
          this.navService.go('auth/login');
        })
      ).subscribe();
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