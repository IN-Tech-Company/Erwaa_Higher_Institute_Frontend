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
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/admin-trainees/admin-trainees').then((m) => m.AdminTraineesComponent),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./pages/admin-trainee-form/admin-trainee-form').then((m) => m.AdminTraineeFormPageComponent),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./pages/admin-trainee-details/admin-trainee-details').then((m) => m.AdminTraineeDetailsComponent),
          },
          {
            path: ':id/edit',
            loadComponent: () =>
              import('./pages/admin-trainee-form/admin-trainee-form').then((m) => m.AdminTraineeFormPageComponent),
          },
          {
            path: ':id/password',
            loadComponent: () =>
              import('./pages/admin-trainee-password/admin-trainee-password').then(
                (m) => m.AdminTraineePasswordComponent
              ),
          },
        ],
      },
    ],
  },
];
