import { UserRole } from '../../../../../shared/models/user-role.enum';

export interface MenuItem {
  icon: string; // Material Symbols name
  label: string; // translation key
  path: string; // after /{lang}, e.g. 'app/admin/courses' or 'courses'
}

export interface MenuGroup {
  label?: string; // translation key; no label = top of the menu
  items: MenuItem[];
}

const HOME: MenuItem = { icon: 'home', label: 'SIDEBAR.HOME', path: 'app' };
const SETTINGS: MenuItem = { icon: 'settings', label: 'SIDEBAR.SETTINGS', path: 'app/settings' };

export const MENUS: Record<UserRole, MenuGroup[]> = {
  [UserRole.Admin]: [
    { items: [HOME] },
    {
      label: 'SIDEBAR.GROUP_PEOPLE',
      items: [
        { icon: 'group', label: 'SIDEBAR.TRAINEES', path: 'app/admin/trainees' },
        { icon: 'cast_for_education', label: 'SIDEBAR.TEACHERS', path: 'app/admin/teachers' },
        { icon: 'badge', label: 'SIDEBAR.TEACHER_APPLICATIONS', path: 'app/admin/teacher-applications' },
      ],
    },
    {
      label: 'SIDEBAR.GROUP_TRAINING',
      items: [{ icon: 'menu_book', label: 'SIDEBAR.COURSES_PROGRAMS', path: 'app/admin/courses' }],
    },
    {
      label: 'SIDEBAR.GROUP_CONTACT',
      items: [{ icon: 'mail', label: 'SIDEBAR.CONTACT_MESSAGES', path: 'app/admin/contacts' }],
    },
    { label: 'SIDEBAR.GROUP_ACCOUNT', items: [SETTINGS] },
  ],

  [UserRole.Teacher]: [
    { items: [HOME] },
    {
      label: 'SIDEBAR.GROUP_TEACHING',
      items: [
        { icon: 'menu_book', label: 'SIDEBAR.MY_COURSES', path: 'app/teacher/courses' },
        { icon: 'group', label: 'SIDEBAR.MY_TRAINEES', path: 'app/teacher/trainees' },
        { icon: 'calendar_month', label: 'SIDEBAR.MY_SCHEDULE', path: 'app/teacher/schedule' },
      ],
    },
    {
      label: 'SIDEBAR.GROUP_ACCOUNT',
      items: [SETTINGS, { icon: 'support_agent', label: 'SIDEBAR.SUPPORT', path: 'app/support' }],
    },
  ],

  // Items and wording are the client's list for trainees (2026-09-16).
  [UserRole.Trainee]: [
    { items: [HOME] },
    {
      label: 'SIDEBAR.GROUP_TRAINING',
      items: [
        { icon: 'event_available', label: 'SIDEBAR.MY_SESSIONS', path: 'app/trainee/sessions' },
        { icon: 'search', label: 'SIDEBAR.AVAILABLE_COURSES', path: 'courses' },
        { icon: 'menu_book', label: 'SIDEBAR.MY_COURSES', path: 'app/trainee/courses' },
      ],
    },
    {
      label: 'SIDEBAR.GROUP_ACCOUNT',
      items: [
        { icon: 'payments', label: 'SIDEBAR.MY_TRANSACTIONS', path: 'app/trainee/transactions' },
        { icon: 'settings', label: 'SIDEBAR.SYSTEM_SETTINGS', path: 'app/settings' },
      ],
    },
  ],
};
