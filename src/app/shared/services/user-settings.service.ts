import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { RequestService } from './request.service';
import { ToastService } from './toast.service';
import { UserProfileDto, UpdateUserRequestDto, PrivacyDto } from '../models/user-profile.model';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Not wired into any page yet (see docs/project-brief.md) — kept ready for
 * the eventual profile/privacy settings screen. Trimmed 2026-09-17: this
 * used to also cover company info, store info, subscriptions and emergency
 * team members, all leftover Nabd Plus concepts that don't exist in this
 * app's 3-role model (Admin/Teacher/Trainee) — removed along with those
 * `UserRole` members.
 */
@Injectable({ providedIn: 'root' })
export class UserSettingsService {
  private readonly request = inject(RequestService);
  private readonly toast = inject(ToastService);
  private readonly translate = inject(TranslateService);

  readonly profile = signal<UserProfileDto | null>(null);
  readonly loading = signal(false);

  readonly privacy = signal<PrivacyDto | null>(null);
  readonly privacyLoading = signal(false);

  readonly profileImageUploading = signal(false);

  // ── Profile ───────────────────────────────────────────────────────────────

  getProfile(): Observable<ApiResponse<UserProfileDto>> {
    this.loading.set(true);
    return this.request.get<ApiResponse<UserProfileDto>>('/users/me', { showLoader: false }).pipe(
      tap({
        next: (res) => { this.profile.set(res.data); this.loading.set(false); },
        error: () => this.loading.set(false),
      })
    );
  }

  uploadProfileImage(file: File): Observable<ApiResponse<string>> {
    const formData = new FormData();
    formData.append('image', file);
    this.profileImageUploading.set(true);
    return this.request.upload<ApiResponse<string>>('/users/me/profile-image', formData, { showLoader: false }).pipe(
      tap({
        next: (res) => {
          const url = res.data ?? null;
          this.profile.update(p => p ? { ...p, profileImageUrl: url } : p);
          this.profileImageUploading.set(false);
        },
        error: (err) => {
          this.profileImageUploading.set(false);
          this.toast.error(err?.error?.message ?? 'فشل تحميل الصورة');
        },
      })
    );
  }

  deleteProfileImage(): Observable<ApiResponse<void>> {
    this.profileImageUploading.set(true);
    return this.request.delete<ApiResponse<void>>('/users/me/profile-image', { showLoader: false }).pipe(
      tap({
        next: () => {
          this.profile.update(p => p ? { ...p, profileImageUrl: null } : p);
          this.profileImageUploading.set(false);
          this.toast.success('تم حذف الصورة');
        },
        error: (err) => {
          this.profileImageUploading.set(false);
          this.toast.error(err?.error?.message ?? 'فشل حذف الصورة');
        },
      })
    );
  }

  updateProfile(data: UpdateUserRequestDto): Observable<ApiResponse<UserProfileDto>> {
    return this.request.put<ApiResponse<UserProfileDto>>('/users/me', data, { showLoader: true }).pipe(
      tap({
        next: (res) => {
          this.profile.set(res.data);
          const msg = res.message ?? this.translate.instant('SETTINGS.PROFILE.SAVE_SUCCESS');
          this.toast.success(msg);
        },
        error: (err) => {
          const msg = err?.error?.message ?? this.translate.instant('SETTINGS.PROFILE.SAVE_ERROR');
          this.toast.error(msg);
        },
      })
    );
  }

  // ── Privacy ───────────────────────────────────────────────────────────────

  getPrivacy(targetUserId?: number): Observable<ApiResponse<PrivacyDto>> {
    this.privacyLoading.set(true);
    const params = targetUserId ? { targetUserId } : undefined;
    return this.request.get<ApiResponse<PrivacyDto>>('/users/me/privacy', { showLoader: false, params }).pipe(
      tap({
        next: (res) => { this.privacy.set(res.data); this.privacyLoading.set(false); },
        error: () => this.privacyLoading.set(false),
      })
    );
  }
}
