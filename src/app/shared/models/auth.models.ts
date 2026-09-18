import { UserRole } from './user-role.enum';

export type AccountStatus = 'ACTIVE' | 'PENDING_DOCUMENTS' | 'UNDER_REVIEW' | 'REJECTED';

export interface CarouselSlide {
  image: string;
  title: string;
  desc: string;
}

// `UserRole` used to be redefined here as its own string-literal union,
// duplicating (and drifting from) `user-role.enum.ts`. Re-exported from the
// single canonical source instead — see docs/project-brief.md.
export { UserRole };

export interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

/**
 * The real Erwaa backend's actual response envelope (confirmed 2026-09-17
 * against `https://api.mostaqbalyadbeyd.cloud` — `/health` returns
 * `{status, message, body, ok}`), which is a *different* shape than the old
 * Nabd Plus `ApiResponse<T>` above (`data`/`success` vs `body`/`ok`). Used
 * for the endpoints actually wired to this backend so far (login) — the
 * other `ApiResponse<T>` consumers are still unverified Nabd Plus leftovers
 * and will need this same correction whenever they're wired for real; see
 * docs/project-brief.md.
 */
export interface ApiEnvelope<T> {
  status: number;
  message: string;
  body: T;
  ok: boolean;
}

// Real shape confirmed from the backend's Swagger UI (`POST /auth/signin`)
// 2026-09-17 — the identifier field is called `username` even though the
// value sent is the user's email (matches the site's email-based login).
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  accountStatus: AccountStatus | null;
}

export interface RegisterIndividualRequest {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
}

export interface RegisterCompanyRequest extends RegisterIndividualRequest {
  companyName: string;
  organizationId: string;
}

export interface RegisterSellerRequest {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  storeName: string;
  commercialRegistrationNumber: string;
}

export interface CompanyData {
  id: number;
  name: string;
  organizationId: string;
  accountStatus: AccountStatus;
}

export interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  active: boolean;
  confirmed: boolean;
  company: CompanyData | null;
}

export interface OtpVerifyRequest {
  phone: string;
  otp: string;
}

export interface ResetPasswordVerifyResponse {
  resetToken: string;
}

export interface ResetPasswordRequest {
  resetToken: string;
  newPassword: string;
}

export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
}
