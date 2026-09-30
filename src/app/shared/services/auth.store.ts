import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  AccountStatus,
  AuthSession,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
} from '../models/auth.models';
import { AuthService } from './auth.service';
import { LanguageStoreService } from './language/language-store.service';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly api = inject(AuthService);
  private readonly tokens = inject(TokenService);
  private readonly router = inject(Router);
  private readonly lang = inject(LanguageStoreService).currentLanguage;

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly registeredEmail = signal<string | null>(null);
  readonly magicLinkSentTo = signal<string | null>(null);
  readonly resetLinkSentTo = signal<string | null>(null);
  readonly passwordReset = signal(false);
  readonly accountStatus = signal<AccountStatus | null>(null);
  readonly verifyEmailResentTo = signal<string | null>(null);
  readonly verifyEmailFailed = signal(false);

  readonly isLoggedIn = this.tokens.isAuthenticated;

  readonly user = this.tokens.user;

  readonly role = computed(() => this.user()?.role ?? null);

  login(body: LoginRequest): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.login(body).subscribe({
      next: (session) => {
        this.loading.set(false);
        this.signIn(session);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'AUTH.ERRORS.GENERIC');
        this.loading.set(false);
      },
    });
  }

  register(body: RegisterRequest): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.register(body).subscribe({
      next: () => {
        this.registeredEmail.set(body.email);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'AUTH.ERRORS.GENERIC');
        this.loading.set(false);
      },
    });
  }

  requestMagicLink(email: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.requestMagicLink(email).subscribe({
      next: () => {
        this.magicLinkSentTo.set(email);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'AUTH.ERRORS.GENERIC');
        this.loading.set(false);
      },
    });
  }

  forgotPassword(email: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.forgotPassword(email).subscribe({
      next: () => {
        this.resetLinkSentTo.set(email);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'AUTH.ERRORS.GENERIC');
        this.loading.set(false);
      },
    });
  }

  resetPassword(body: ResetPasswordRequest): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.resetPassword(body).subscribe({
      next: () => {
        this.passwordReset.set(true);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'AUTH.ERRORS.GENERIC');
        this.loading.set(false);
      },
    });
  }

  verifyMagicLink(token: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.verifyMagicLink(token).subscribe({
      next: (session) => {
        this.loading.set(false);
        this.signIn(session);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'AUTH.ERRORS.GENERIC');
        this.loading.set(false);
      },
    });
  }

  verifyEmail(token: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.verifyEmail(token).subscribe({
      next: (res) => {
        this.loading.set(false);
        // Trainees come back with a session; teachers wait for admin approval.
        if (res.session) {
          this.signIn(res.session);
        } else {
          this.accountStatus.set(res.accountStatus);
        }
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'AUTH.ERRORS.GENERIC');
        this.verifyEmailFailed.set(true);
        this.loading.set(false);
      },
    });
  }

  resendVerifyEmail(email: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.resendVerifyEmail(email).subscribe({
      next: () => {
        this.verifyEmailResentTo.set(email);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'AUTH.ERRORS.GENERIC');
        this.loading.set(false);
      },
    });
  }

  logout(): void {
    const refreshToken = this.tokens.getRefreshToken();
    if (refreshToken) {
      this.api.logout(refreshToken).subscribe({ error: () => { } });
    }
    this.tokens.logout();
  }

  reset(): void {
    this.error.set(null);
    this.registeredEmail.set(null);
    this.magicLinkSentTo.set(null);
    this.resetLinkSentTo.set(null);
    this.passwordReset.set(false);
    this.accountStatus.set(null);
    this.verifyEmailResentTo.set(null);
    this.verifyEmailFailed.set(false);
  }

  private signIn(session: AuthSession): void {
    this.tokens.setTokens(session.accessToken, session.refreshToken);
    this.router.navigate(['/', this.lang(), 'app']);
  }
}
