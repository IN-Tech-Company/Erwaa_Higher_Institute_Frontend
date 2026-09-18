import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestService } from './request.service';
import {
  ApiEnvelope,
  ApiResponse,
  LoginRequest,
  LoginResponseData,
  OtpVerifyRequest,
  RegisterCompanyRequest,
  RegisterIndividualRequest,
  RegisterSellerRequest,
  ResetPasswordRequest,
  ResetPasswordVerifyResponse,
  TokenRefreshResponse,
  UserData,
} from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly request = inject(RequestService);

  private _resetToken: string | null = null;
  private _pendingLoginCreds: LoginRequest | null = null;

  get resetToken() { return this._resetToken; }
  set resetToken(t: string | null) { this._resetToken = t; }

  get pendingLoginCreds() { return this._pendingLoginCreds; }
  setPendingLoginCreds(creds: LoginRequest) { this._pendingLoginCreds = creds; }
  clearPendingLoginCreds() { this._pendingLoginCreds = null; }

  // Real endpoint + envelope shape confirmed against the live backend
  // (`https://api.mostaqbalyadbeyd.cloud`) 2026-09-17 — see `ApiEnvelope`'s
  // doc comment in auth.models.ts and docs/project-brief.md. This is the
  // one endpoint actually wired so far; everything else below still targets
  // the old (unverified) Nabd Plus shape/paths.
  login(body: LoginRequest): Observable<ApiEnvelope<LoginResponseData>> {
    return this.request.post<ApiEnvelope<LoginResponseData>>('/auth/signin', body);
  }

  registerIndividual(body: RegisterIndividualRequest): Observable<ApiResponse<UserData>> {
    return this.request.post<ApiResponse<UserData>>('/auth/register/client/individual', body);
  }

  registerClientCompany(body: RegisterCompanyRequest): Observable<ApiResponse<UserData>> {
    return this.request.post<ApiResponse<UserData>>('/auth/register/client/company/manager', body);
  }

  registerProviderCompany(body: RegisterCompanyRequest): Observable<ApiResponse<UserData>> {
    return this.request.post<ApiResponse<UserData>>('/auth/register/provider/company/manager', body);
  }

  registerSeller(body: RegisterSellerRequest): Observable<ApiResponse<UserData>> {
    return this.request.post<ApiResponse<UserData>>('/auth/register/seller', body);
  }

  sendOtp(phone: string): Observable<ApiResponse<void>> {
    return this.request.post<ApiResponse<void>>('/auth/otp/send', { phone });
  }

  verifyOtp(body: OtpVerifyRequest): Observable<ApiResponse<void>> {
    return this.request.post<ApiResponse<void>>('/auth/otp/verify', body);
  }

  sendResetOtp(phone: string): Observable<ApiResponse<void>> {
    return this.request.post<ApiResponse<void>>('/auth/reset-password/send-otp', { phone });
  }

  verifyResetOtp(body: OtpVerifyRequest): Observable<ApiResponse<ResetPasswordVerifyResponse>> {
    return this.request.post<ApiResponse<ResetPasswordVerifyResponse>>('/auth/reset-password/verify-otp', body);
  }

  resetPassword(body: ResetPasswordRequest): Observable<ApiResponse<void>> {
    return this.request.post<ApiResponse<void>>('/auth/reset-password/reset', body);
  }

  refresh(refreshToken: string): Observable<ApiResponse<TokenRefreshResponse>> {
    return this.request.post<ApiResponse<TokenRefreshResponse>>('/auth/refresh', { refreshToken });
  }

  logout(): Observable<ApiResponse<void>> {
    return this.request.post<ApiResponse<void>>('/auth/logout', {});
  }
}
