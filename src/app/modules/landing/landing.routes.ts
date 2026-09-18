import { Routes } from '@angular/router';

export const landingRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing-page/landing-page')
        .then((m) => m.LandingPage)
  },
  {
    path: 'courses',
    loadComponent: () =>
      import('./pages/all-courses/all-courses')
        .then((m) => m.AllCoursesPage)
  },
  {
    path: 'courses/:key',
    loadComponent: () =>
      import('./pages/course-detail/course-detail')
        .then((m) => m.CourseDetailPage)
  },
  {
    path: 'courses/:key/checkout',
    loadComponent: () =>
      import('./pages/course-checkout/course-checkout')
        .then((m) => m.CourseCheckoutPage)
  },
];
