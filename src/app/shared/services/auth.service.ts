import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AuthSession,
  ChangePasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  VerifyEmailResponse,
} from '../models/auth.models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly baseUrl = '/auth';

  login(body: LoginRequest): Observable<AuthSession> {
    return this.api.post(`${this.baseUrl}/login`, body);
  }

  register(body: RegisterRequest): Observable<void> {
    return this.api.post('/v1/register/trainee', body);
  }

  requestMagicLink(email: string): Observable<void> {
    return this.api.post(`${this.baseUrl}/magic-link`, { email });
  }

  verifyMagicLink(token: string): Observable<AuthSession> {
    return this.api.post(`${this.baseUrl}/magic-link/verify`, { token });
  }

  refresh(refreshToken: string): Observable<AuthSession> {
    return this.api.post(`${this.baseUrl}/refresh`, { refreshToken });
  }

  logout(refreshToken: string): Observable<void> {
    return this.api.post(`${this.baseUrl}/logout`, { refreshToken });
  }

  verifyEmail(token: string): Observable<VerifyEmailResponse> {
    return this.api.post(`${this.baseUrl}/email/verify`, { token });
  }

  resendVerifyEmail(email: string): Observable<void> {
    return this.api.post(`${this.baseUrl}/email/verify/resend`, { email });
  }

  forgotPassword(email: string): Observable<void> {
    return this.api.post(`${this.baseUrl}/password/forgot`, { email });
  }

  resetPassword(body: ResetPasswordRequest): Observable<void> {
    return this.api.post(`${this.baseUrl}/password/reset`, body);
  }

  changePassword(body: ChangePasswordRequest): Observable<AuthSession> {
    return this.api.put(`${this.baseUrl}/password`, body);
  }
}
