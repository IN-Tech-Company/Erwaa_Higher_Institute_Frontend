import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRole } from '../models/user-role.enum';
import { LanguageStoreService } from '../services/language-store.service';
import { TokenService } from '../services/token.service';
import { defaultRouteForRole } from './default-route-for-role';


export function roleGuard(allowed: UserRole | UserRole[]): CanActivateFn {
  return () => {
    const token = inject(TokenService);
    const router = inject(Router);
    const lang = inject(LanguageStoreService);

    if (!token.isAuthenticated()) {
      return router.createUrlTree(['/', lang.currentLanguage(), 'auth', 'login']);
    }

    const roles = Array.isArray(allowed) ? allowed : [allowed];
    if (roles.includes(token.userRole())) return true;

    const home = defaultRouteForRole(token.userRole());
    return router.createUrlTree(['/', lang.currentLanguage(), 'app', ...(home ? [home] : [])]);
  };
}

