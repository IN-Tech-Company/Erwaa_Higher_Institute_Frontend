import { Injectable, computed, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { AuthUser } from '../models/auth.models';
import { UserRole } from '../models/user-role.enum';

// Access-token claims — see "Token contents" in docs/04-authentication.md.
interface AccessTokenClaims {
  jti: string; // user id
  sub: string; // email
  iss: string; // display name
  role: UserRole;
  referenceId: number; // Student / Teacher / Admin profile id
  locked: boolean;
  exp: number; // expiry, UNIX seconds
}

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly ACCESS_KEY = 'auth_token';
  private readonly REFRESH_KEY = 'refresh_token';

  readonly token = signal<string | null>(localStorage.getItem(this.ACCESS_KEY));

  private readonly claims = computed<AccessTokenClaims | null>(() => {
    const token = this.token();
    if (!token) return null;
    try {
      return jwtDecode<AccessTokenClaims>(token);
    } catch {
      return null;
    }
  });

  readonly user = computed<AuthUser | null>(() => {
    const claims = this.claims();
    if (!claims) return null;
    return {
      id: Number(claims.jti),
      email: claims.sub,
      name: claims.iss,
      role: claims.role,
      referenceId: claims.referenceId,
    };
  });

  readonly isAuthenticated = computed(() => {
    const claims = this.claims();
    return !!claims && Date.now() < claims.exp * 1000;
  });

  readonly userRole = computed(() => this.user()?.role ?? UserRole.Trainee);

  getToken(): string | null {
    return localStorage.getItem(this.ACCESS_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_KEY);
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.ACCESS_KEY, accessToken);
    localStorage.setItem(this.REFRESH_KEY, refreshToken);
    this.token.set(accessToken);
  }

  logout(): void {
    localStorage.removeItem(this.ACCESS_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    this.token.set(null);
  }
}
