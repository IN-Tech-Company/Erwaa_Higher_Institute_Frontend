import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './modules/auth/components/auth-layout/auth-layout';
import { DashboardLayoutContainerComponent } from './modules/dashboard/pages/dashboard-layout-container/dashboard-layout-container';
import { authRoutes } from './modules/auth/auth.routes';
import { guestGuard } from './shared/guard/guest.guard';

export const routes: Routes = [
  {
    path: ':lang',
    children: [
      {
        path: 'app',
        component: DashboardLayoutContainerComponent,
        loadChildren: () =>
          import('./modules/dashboard/dashboard.routes').then(
            (m) => m.dashboardRoutes
          ),
      },
      {
        path: 'auth',
        canActivate: [guestGuard],
        component: AuthLayoutComponent,
        children: authRoutes,
      },
      {
        path: 'legal',
        loadComponent: () =>
          import('./modules/legal/legal-layout/legal-layout').then(
            (m) => m.LegalLayoutComponent
          ),
        loadChildren: () =>
          import('./modules/legal/legal.routes').then((m) => m.legalRoutes),
      },
      {
        path: '',
        canActivate: [guestGuard],
        loadChildren: () =>
          import('./modules/landing/landing.routes').then(
            (m) => m.landingRoutes
          ),
      },
    ],
  },
  {
    path: '',
    redirectTo: 'ar',
    pathMatch: 'full',
  },
];
