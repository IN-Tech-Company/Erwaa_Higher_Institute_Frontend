import { Injectable, computed, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { UserRole } from '../models/user-role.enum';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'auth_user';
  private readonly ACCOUNT_STATUS_KEY = 'account_status';

  token = signal<string | null>(this.getToken());
  user = signal<any | null>(this.getUser());
  accountStatus = signal<string | null>(localStorage.getItem(this.ACCOUNT_STATUS_KEY));

  readonly role = computed<string | null>(() => {
    const t = this.token();
    if (!t) return null;
    try { return (jwtDecode(t) as any)?.role ?? null; } catch { return null; }
  });

  readonly permissions = computed<string[]>(() => {
    const t = this.token();
    if (!t) return [];
    try {
      const p = (jwtDecode(t) as any)?.permissions;
      return Array.isArray(p) ? p : [];
    } catch { return []; }
  });

  readonly userRole = computed<UserRole>(() => {
    const roleStr = this.role();
    if (roleStr) {
      const match = Object.values(UserRole).find(v => v === roleStr);
      if (match) return match as UserRole;
    }
    // Only 3 roles exist in this app (Admin/Teacher/Trainee) — see
    // `user-role.enum.ts` and docs/project-brief.md. Default to the most
    // restrictive real role rather than guessing from a legacy role_id.
    return UserRole.Trainee;
  });

  constructor() {
    this.loadFromStorage();
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.token.set(token);
  }

  setRefreshToken(refreshToken: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  setTokens(accessToken: string, refreshToken: string): void {
    this.setToken(accessToken);
    this.setRefreshToken(refreshToken);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  setUser(user: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.user.set(user);
  }

  getUser(): any | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  setAccountStatus(status: string | null): void {
    if (status) {
      localStorage.setItem(this.ACCOUNT_STATUS_KEY, status);
    } else {
      localStorage.removeItem(this.ACCOUNT_STATUS_KEY);
    }
    this.accountStatus.set(status);
  }

  clear(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.ACCOUNT_STATUS_KEY);
    this.token.set(null);
    this.user.set(null);
    this.accountStatus.set(null);
  }

  logout(): void {
    this.clear();
  }

  getDecodedToken(): any | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const decoded = jwtDecode(token);
      return decoded;
    } catch (error) {
      return null;
    }
  }

  getUserRoles(): string[] {
    const decoded = this.getDecodedToken();
    if (!decoded) return [];

    const roles: string[] = [];

    if (decoded['role_id']) {
      const roleId = decoded['role_id'];
      if (roleId === 1) roles.push('CLIENT');
      if (roleId === 2) roles.push('OFFICE');
      if (roleId === 3) roles.push('ADMIN');
    }

    if (Array.isArray(decoded['role'])) {
      decoded['role'].forEach((r: any) => {
        if (typeof r === 'string') roles.push(r);
        else if (r?.name) roles.push(r.name);
      });
    }

    if (Array.isArray(decoded['authority'])) {
      decoded['authority'].forEach((a: any) => {
        if (a.name) roles.push(a.name);
      });
    }

    if (decoded['role'] && typeof decoded['role'] === 'string') {
      roles.push(decoded['role']);
    }

    return roles;
  }

  hasRole(role: string): boolean {
    const roles = this.getUserRoles();
    return roles.includes(role);
  }

  hasPermission(permission: string): boolean {
    return this.permissions().includes(permission);
  }

  hasRoleId(roleId: number): boolean {
    const user = this.getUser();
    if (user?.role_id === roleId) return true;

    const decoded = this.getDecodedToken();
    return decoded?.['role_id'] === roleId;
  }

  getUserInfo(): {
    name: string | null;
    email: string | null;
    mobile: string | null;
    roles: string[];
    role_id: number | null;
    role: string | null;
    permissions: string[];
  } | null {
    const decoded = this.getDecodedToken();
    if (!decoded) return null;

    const name = decoded['firstName']
      ? `${decoded['firstName']} ${decoded['lastName'] ?? ''}`.trim()
      : decoded['name'] || null;
    const email = decoded['email'] || null;
    const mobile = decoded['mobile'] || null;
    const role_id = decoded['role_id'] || null;

    return {
      name,
      email,
      mobile,
      roles: this.getUserRoles(),
      role_id,
      role: this.role(),
      permissions: this.permissions(),
    };
  }

  getName(): string | null {
    const decoded = this.getDecodedToken();
    if (!decoded) return null;
    if (decoded['firstName']) {
      return `${decoded['firstName']} ${decoded['lastName'] ?? ''}`.trim();
    }
    return decoded['name'] || null;
  }

  getEmail(): string | null {
    const decoded = this.getDecodedToken();
    if (!decoded) return null;
    return decoded['email'] || decoded['sub'] || null;
  }

  getMobile(): string | null {
    const decoded = this.getDecodedToken();
    if (!decoded) return null;
    return decoded['mobile'] || null;
  }

  getRoles(): string[] {
    return this.getUserRoles();
  }

  // ── Role signals (reactive — use in guards & templates) ──────────────────
  readonly isAuthenticated = computed<boolean>(() => {
    const t = this.token();
    if (!t) return false;
    try {
      const decoded: any = jwtDecode(t);
      return decoded?.exp ? Date.now() < decoded.exp * 1000 : false;
    } catch { return false; }
  });

  readonly isAdmin = computed(() => this.userRole() === UserRole.Admin);
  readonly isTeacher = computed(() => this.userRole() === UserRole.Teacher);
  readonly isTrainee = computed(() => this.userRole() === UserRole.Trainee);

  getTokenData(): Record<string, any> | null {
    const decoded = this.getDecodedToken();
    if (!decoded) return null;

    return { ...decoded };
  }

  getTokenClaim(key: string): any {
    const decoded = this.getDecodedToken();
    if (!decoded) return null;
    return decoded[key] ?? null;
  }

  hasTokenClaim(key: string): boolean {
    const decoded = this.getDecodedToken();
    if (!decoded) return false;
    return key in decoded && decoded[key] !== null && decoded[key] !== undefined;
  }


  getTokenExpirationDate(): Date | null {
    const decoded = this.getDecodedToken();
    if (!decoded || !decoded.exp) return null;
    return new Date(decoded.exp * 1000);
  }


  getTokenIssuedDate(): Date | null {
    const decoded = this.getDecodedToken();
    if (!decoded || !decoded.iat) return null;
    return new Date(decoded.iat * 1000);
  }

  getReferenceId(): number {
    return this.getTokenClaim('jti') ?? null;
  }

  getId() {
    return this.getTokenClaim('sub') ?? null;
  }

  isVerified(): boolean {
    return this.getTokenClaim('isVerified') === true;
  }

  private loadFromStorage(): void {
    const token = this.getToken();
    const user = this.getUser();
    if (token) {
      this.token.set(token);
    }
    if (user) {
      this.user.set(user);
    }
  }
}

