import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DashbaordNavigationBarControlStore } from '../../../../../shared/stores/dashboard-navigation-bar-control-store.service';
import { LanguageStoreService } from '../../../../../shared/services/language-store.service';
import { TokenService } from '../../../../../shared/services/token.service';
import { UserRole } from '../../../../../shared/models/user-role.enum';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface MenuItem {
  icon: string;
  labelEn: string;
  labelAr: string;
  route: string;
  badge?: number | string;
  accent?: 'danger' | 'warning' | 'success' | 'secondary';
  landing?: boolean;
}

export interface MenuGroup {
  labelEn?: string;
  labelAr?: string;
  items: MenuItem[];
}

// ── Shared items ─────────────────────────────
// Real institute concepts only (courses, trainees, teachers, certificates,
// support) — replaces the old healthcare-marketplace menu (ambulances,
// store, sellers, coupons...). See docs/project-brief.md for the rebuild.
const PROFILE: MenuItem = {
  icon: 'person',
  labelEn: 'Profile',
  labelAr: 'البروفايل',
  route: 'settings',
};
const SUPPORT: MenuItem = {
  icon: 'help',
  labelEn: 'Support',
  labelAr: 'الدعم',
  route: 'support',
};

// Admin
const ADMIN_TRAINEES: MenuItem = {
  icon: 'group',
  labelEn: 'Trainees',
  labelAr: 'المتدربين',
  route: 'admin/trainees',
};
const ADMIN_TEACHERS: MenuItem = {
  icon: 'cast_for_education',
  labelEn: 'Teachers',
  labelAr: 'المعلمين',
  route: 'admin/teachers',
};
const ADMIN_TEACHER_APPLICATIONS: MenuItem = {
  icon: 'badge',
  labelEn: 'Teacher Applications',
  labelAr: 'طلبات التسجيل كمعلم',
  route: 'admin/teacher-applications',
};
const ADMIN_COURSES: MenuItem = {
  icon: 'menu_book',
  labelEn: 'Courses & Programs',
  labelAr: 'الدورات والبرامج',
  route: 'admin/courses',
};
const ADMIN_CONTACT_MESSAGES: MenuItem = {
  icon: 'mail',
  labelEn: 'Contact Messages',
  labelAr: 'رسائل التواصل',
  route: 'admin/contacts',
};

// Teacher (معلم)
const TEACHER_COURSES: MenuItem = {
  icon: 'menu_book',
  labelEn: 'My Courses',
  labelAr: 'دوراتي',
  route: 'teacher/courses',
};
const TEACHER_TRAINEES: MenuItem = {
  icon: 'group',
  labelEn: 'My Trainees',
  labelAr: 'متدربيني',
  route: 'teacher/trainees',
};
const TEACHER_SCHEDULE: MenuItem = {
  icon: 'calendar_month',
  labelEn: 'Schedule',
  labelAr: 'الجدول',
  route: 'teacher/schedule',
};

// Trainee (متدرب) — real menu content the client gave 2026-09-16.
const TRAINEE_HOME: MenuItem = {
  icon: 'home',
  labelEn: 'Home',
  labelAr: 'الرئيسية',
  route: 'trainee/home',
};
const TRAINEE_SESSIONS: MenuItem = {
  icon: 'event_available',
  labelEn: 'My Sessions',
  labelAr: 'جلساتي',
  route: 'trainee/sessions',
};
const TRAINEE_AVAILABLE_COURSES: MenuItem = {
  icon: 'search',
  labelEn: 'Available Courses',
  labelAr: 'الدورات المعروضة',
  route: 'courses',
  landing: true,
};
const TRAINEE_COURSES: MenuItem = {
  icon: 'menu_book',
  labelEn: 'My Courses',
  labelAr: 'دوراتي',
  route: 'trainee/courses',
};
const TRAINEE_TRANSACTIONS: MenuItem = {
  icon: 'payments',
  labelEn: 'My Transactions',
  labelAr: 'معاملاتي المالية',
  route: 'trainee/transactions',
};
// Same "settings" route PROFILE points to, worded per the client's list.
const TRAINEE_SETTINGS: MenuItem = {
  icon: 'settings',
  labelEn: 'System Settings',
  labelAr: 'إعدادات النظام',
  route: 'settings',
};

// ── Per-role menus ────────────────────────────────────────────────────────────
const MENUS: Record<UserRole, MenuGroup[]> = {
  [UserRole.Admin]: [
    { labelEn: 'My Account', labelAr: 'حسابي', items: [PROFILE] },
    {
      labelEn: 'People',
      labelAr: 'الأعضاء',
      items: [ADMIN_TRAINEES, ADMIN_TEACHERS, ADMIN_TEACHER_APPLICATIONS],
    },
    {
      labelEn: 'Training',
      labelAr: 'التدريب',
      items: [ADMIN_COURSES],
    },
    {
      labelEn: 'Support',
      labelAr: 'الدعم',
      items: [ADMIN_CONTACT_MESSAGES],
    },
  ],

  [UserRole.Teacher]: [
    { labelEn: 'My Account', labelAr: 'حسابي', items: [PROFILE] },
    {
      labelEn: 'Teaching',
      labelAr: 'التدريس',
      items: [TEACHER_COURSES, TEACHER_TRAINEES, TEACHER_SCHEDULE],
    },
    {
      labelEn: 'Account',
      labelAr: 'الحساب',
      items: [SUPPORT],
    },
  ],

  [UserRole.Trainee]: [
    {
      labelEn: 'Training',
      labelAr: 'التدريب',
      items: [TRAINEE_HOME, TRAINEE_SESSIONS, TRAINEE_AVAILABLE_COURSES, TRAINEE_COURSES],
    },
    {
      labelEn: 'Account',
      labelAr: 'الحساب',
      items: [TRAINEE_TRANSACTIONS, TRAINEE_SETTINGS],
    },
  ],
};

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  readonly store = inject(DashbaordNavigationBarControlStore);
  private langService = inject(LanguageStoreService);
  private tokenService = inject(TokenService);
  readonly lang = this.langService.currentLanguage;

  /** Forces the icon-only look without touching the user's own collapse preference
   *  (e.g. while the assistant panel is open and sharing the screen with it). */
  readonly forceCollapsed = input(false);
  readonly isCollapsed = computed(() => this.store.isCollapsed() || this.forceCollapsed());

  readonly menuGroups = computed<MenuGroup[]>(() => MENUS[this.tokenService.userRole()] ?? []);

  getLabel(item: MenuItem): string {
    return this.langService.currentLanguage() === 'ar' ? item.labelAr : item.labelEn;
  }

  getGroupLabel(group: MenuGroup): string {
    if (!group.labelEn) return '';
    return this.langService.currentLanguage() === 'ar' ? (group.labelAr ?? '') : group.labelEn;
  }

  buildLink(item: MenuItem): string[] {
    const segments = item.route.split('/');
    const isTopLevelModule = item.landing || segments[0] === 'auth' || segments[0] === 'legal';
    return isTopLevelModule
      ? ['/', this.lang(), ...segments]
      : ['/', this.lang(), 'app', ...segments];
  }
}
