import { Routes } from '@angular/router';

export const legalRoutes: Routes = [
  { path: '', redirectTo: 'privacy', pathMatch: 'full' },
  {
    path: 'privacy',
    loadComponent: () =>
      import('./privacy/privacy').then((m) => m.PrivacyComponent),
  },
  {
    path: 'terms',
    loadComponent: () =>
      import('./terms/terms').then((m) => m.TermsComponent),
  },
  {
    path: 'ownership',
    loadComponent: () =>
      import('./ownership/ownership').then((m) => m.OwnershipComponent),
  },
];
