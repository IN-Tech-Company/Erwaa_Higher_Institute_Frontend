import { UserRole } from './user-role.enum';

export { UserRole };

export interface CarouselSlide {
  image: string;
  title: string;
  desc: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export type AccountStatus = 'ACTIVE' | 'PENDING_APPROVAL';

export interface VerifyEmailResponse {
  accountStatus: AccountStatus;
  session?: AuthSession;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword?: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthUser {
  id: number; // jti
  email: string; // sub
  name: string; // iss
  role: UserRole;
  referenceId: number; // Student / Teacher / Admin profile id
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  nationalId: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}
