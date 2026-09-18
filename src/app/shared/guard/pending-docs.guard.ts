import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { TokenService } from '../services/token.service';
import { NavService } from '../services/nav.service';

export const pendingDocsGuard: CanActivateFn = (_route, state) => {
  const tokenService = inject(TokenService);
  const nav = inject(NavService);

  if (tokenService.accountStatus() !== 'PENDING_DOCUMENTS') return true;

  if (state.url.includes('settings/verification-data')) return true;

  nav.go('settings/verification-data');
  return false;
};
