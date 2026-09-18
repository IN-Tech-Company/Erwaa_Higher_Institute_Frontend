import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';

export const dashboardRoutes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: HomeComponent },
    ],
  },
];
