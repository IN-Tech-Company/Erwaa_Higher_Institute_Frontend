import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LanguageStoreService } from '../services/language-store.service';
import { TokenService } from '../services/token.service';

export const notAuthGuard: CanActivateFn = () => {
  const token = inject(TokenService);
  const router = inject(Router);
  const lang = inject(LanguageStoreService);

  if (!token.isAuthenticated()) return true;

  return router.createUrlTree(['/', lang.currentLanguage(), 'app', 'home']);
};
