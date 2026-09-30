import { Routes } from '@angular/router';
import { UserRole } from '../../shared/models/user-role.enum';
import { roleGuard } from '../../shared/guard/role.guard';
import { HomeComponent } from './pages/home/home';

export const dashboardRoutes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: HomeComponent },
      {
        path: 'admin/trainees',
        canActivate: [roleGuard(UserRole.Admin)],
        loadComponent: () =>
          import('./pages/admin-trainees/admin-trainees').then((m) => m.AdminTraineesComponent),
      },
    ],
  },
];
