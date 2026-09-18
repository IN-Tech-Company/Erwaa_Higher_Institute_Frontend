import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Popover } from 'primeng/popover';
import { DashbaordNavigationBarControlStore } from '../../../../../shared/stores/dashboard-navigation-bar-control-store.service';
import { UserDropdown } from '../user-dropdown/user-dropdown';
import { LanguageService } from '../../../../../shared/services/language.service';
import { NavService } from '../../../../../shared/services/nav.service';
import { TokenService } from '../../../../../shared/services/token.service';
import { UserRole } from '../../../../../shared/models/user-role.enum';
import { NotificationStoreService } from '../../../../../shared/services/notifications/notification-store.service';
import { NotificationsDropdownComponent } from '../../notifications-dropdown/notifications-dropdown';

interface NavItem {
  key: string;
  icon: string;
  labelEn: string;
  labelAr: string;
  subtitleEn: string;
  subtitleAr: string;
  route: () => void;
  badge?: number;
}

// Real institute nav items only (home/courses/people/support) — the old
// per-role list here also carried a shopping cart, favorites, wallet, and
// several emergency-dispatch services that don't apply to a training
// institute. See docs/project-brief.md for the rebuild notes.
@Component({
  selector: 'app-top-navbar',
  standalone: true,
  imports: [UserDropdown, NotificationsDropdownComponent, Popover],
  templateUrl: './top-navbar.html',
  styleUrl: './top-navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopNavbar {
  private readonly store = inject(DashbaordNavigationBarControlStore);
  private readonly navService = inject(NavService);
  private readonly langService = inject(LanguageService);
  private readonly tokenService = inject(TokenService);
  readonly notifications = inject(NotificationStoreService);

  readonly badgeCount = computed(() => this.notifications.unreadCount());
  readonly hasBadge = computed(() => this.badgeCount() > 0);
  readonly badgeLabel = computed(() => {
    const n = this.badgeCount();
    return n > 99 ? '99+' : String(n);
  });

  readonly activeKey = signal<string>('home');

  readonly navItems = computed<NavItem[]>(() => {
    const go = (path: string) => () => this.navigateTo(path);

    const HOME = { key: 'home', icon: 'home', labelEn: 'Home', labelAr: 'الرئيسية', subtitleEn: 'Dashboard overview', subtitleAr: 'نظرة عامة على لوحة التحكم', route: go('') };
    const NOTF = { key: 'notifications', icon: 'notifications', labelEn: 'Notifications', labelAr: 'الإشعارات', subtitleEn: 'Updates & alerts', subtitleAr: 'التحديثات والتنبيهات', route: go('/notifications') };

    switch (this.tokenService.userRole()) {
      case UserRole.Admin: {
        const TRAINEES = { key: 'admin-trainees', icon: 'group', labelEn: 'Trainees', labelAr: 'المتدربين', subtitleEn: 'Manage trainee accounts', subtitleAr: 'إدارة حسابات المتدربين', route: go('/admin/trainees') };
        const TEACHERS = { key: 'admin-teachers', icon: 'cast_for_education', labelEn: 'Teachers', labelAr: 'المعلمين', subtitleEn: 'Manage teacher accounts', subtitleAr: 'إدارة حسابات المعلمين', route: go('/admin/teachers') };
        const COURSES = { key: 'admin-courses', icon: 'menu_book', labelEn: 'Courses', labelAr: 'الدورات', subtitleEn: 'Manage courses & programs', subtitleAr: 'إدارة الدورات والبرامج', route: go('/admin/courses') };
        return [HOME, TRAINEES, TEACHERS, COURSES, NOTF];
      }

      case UserRole.Teacher: {
        const COURSES = { key: 'teacher-courses', icon: 'menu_book', labelEn: 'My Courses', labelAr: 'دوراتي', subtitleEn: 'Courses you teach', subtitleAr: 'الدورات اللي تدرّسها', route: go('/teacher/courses') };
        const TRAINEES = { key: 'teacher-trainees', icon: 'group', labelEn: 'My Trainees', labelAr: 'متدربيني', subtitleEn: 'Trainees in your courses', subtitleAr: 'المتدربين في دوراتك', route: go('/teacher/trainees') };
        return [HOME, COURSES, TRAINEES, NOTF];
      }

      case UserRole.Trainee: {
        const COURSES = { key: 'trainee-courses', icon: 'menu_book', labelEn: 'My Courses', labelAr: 'دوراتي', subtitleEn: 'Courses you are enrolled in', subtitleAr: 'الدورات اللي مسجّل فيها', route: go('/trainee/courses') };
        const CERTS = { key: 'trainee-certificates', icon: 'workspace_premium', labelEn: 'Certificates', labelAr: 'شهاداتي', subtitleEn: 'Your completion certificates', subtitleAr: 'شهادات إتمامك للدورات', route: go('/trainee/certificates') };
        return [HOME, COURSES, CERTS, NOTF];
      }

      default:
        return [HOME, NOTF];
    }
  });

  readonly activeItem = computed(() =>
    this.navItems().find(i => i.key === this.activeKey()) ?? this.navItems()[0]
  );

  readonly pageTitle = computed(() => {
    const item = this.activeItem();
    return item ? (this.langService.currentLanguage() === 'ar' ? item.labelAr : item.labelEn) : '';
  });

  readonly pageSubtitle = computed(() => {
    const item = this.activeItem();
    return item ? (this.langService.currentLanguage() === 'ar' ? item.subtitleAr : item.subtitleEn) : '';
  });

  get lang() {
    return this.langService.currentLanguage();
  }

  navigateTo(path: string): void {
    this.navService.go([path]);
  }

  readonly notifPopover = viewChild<Popover>('notifPopover');

  onNavClick(item: NavItem, event: MouseEvent): void {
    if (item.key === 'notifications') {
      this.notifPopover()?.toggle(event);
      return;
    }
    this.activeKey.set(item.key);
    item.route();
  }

  onNotifPopoverShow(): void {
    this.notifications.ensureLoaded();
    this.notifications.refreshUnreadCount();
  }

  onMenuToggle(): void {
    this.store.toggleSidebar();
  }

  getLabel(item: NavItem): string {
    return this.langService.currentLanguage() === 'ar' ? item.labelAr : item.labelEn;
  }
}
