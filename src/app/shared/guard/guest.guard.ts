import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LanguageStoreService } from '../services/language-store.service';
import { TokenService } from '../services/token.service';
import { defaultRouteForRole } from './default-route-for-role';

export const guestGuard: CanActivateFn = () => {
  const token = inject(TokenService);
  const router = inject(Router);
  const lang = inject(LanguageStoreService);

  if (!token.isAuthenticated()) return true;

  const home = defaultRouteForRole(token.userRole());
  const segments = home ? home.split('/').filter(Boolean) : [];
  return router.createUrlTree(['/', lang.currentLanguage(), 'app', ...segments]);
};
