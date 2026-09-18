import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, computed, inject, signal, viewChildren } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageStoreService } from '../../../../shared/services/language-store.service';

type Step = 1 | 2 | 3;

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

/**
 * 3-step password reset — email (not phone, matching the site's real login)
 * → 6-digit code → new password. No real backend yet (see TODOs) — every
 * step is fully built and validated, just not wired to an API call.
 */
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent implements OnDestroy {
  private readonly langStore = inject(LanguageStoreService);
  private readonly router = inject(Router);
  readonly lang = this.langStore.currentLanguage;

  readonly step = signal<Step>(1);
  readonly submitted = signal(false);

  // Step 1
  readonly email = signal('');

  // Step 2
  readonly otpDigits = signal<string[]>(Array(OTP_LENGTH).fill(''));
  readonly otpInputs = viewChildren<ElementRef<HTMLInputElement>>('otpInput');
  readonly otpValue = computed(() => this.otpDigits().join(''));
  readonly resendSeconds = signal(0);
  private resendTimer: ReturnType<typeof setInterval> | null = null;

  // Step 3
  readonly newPassword = signal('');
  readonly confirmPassword = signal('');
  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);
  readonly passwordMismatch = computed(
    () => this.confirmPassword().length > 0 && this.newPassword() !== this.confirmPassword()
  );

  readonly done = signal(false);

  onEmailInput(event: Event): void {
    this.email.set((event.target as HTMLInputElement).value);
  }

  submitStep1(event: Event): void {
    event.preventDefault();
    this.submitted.set(true);
    if (!this.email()) return;
    // TODO: call the real "send reset code" API once the backend is ready.
    this.submitted.set(false);
    this.step.set(2);
    this.startResendCountdown();
  }

  onOtpInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '').slice(-1);
    const digits = [...this.otpDigits()];
    digits[index] = value;
    this.otpDigits.set(digits);

    if (value && index < OTP_LENGTH - 1) {
      this.otpInputs()[index + 1]?.nativeElement.focus();
    }
  }

  onOtpKeydown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.otpDigits()[index] && index > 0) {
      this.otpInputs()[index - 1]?.nativeElement.focus();
    }
  }

  onOtpPaste(event: ClipboardEvent): void {
    const pasted = event.clipboardData?.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH) ?? '';
    if (!pasted) return;
    event.preventDefault();
    const digits = Array(OTP_LENGTH).fill('');
    for (let i = 0; i < pasted.length; i++) digits[i] = pasted[i];
    this.otpDigits.set(digits);
    const lastIndex = Math.min(pasted.length, OTP_LENGTH) - 1;
    if (lastIndex >= 0) this.otpInputs()[lastIndex]?.nativeElement.focus();
  }

  submitStep2(event: Event): void {
    event.preventDefault();
    this.submitted.set(true);
    if (this.otpValue().length !== OTP_LENGTH) return;
    // TODO: call the real "verify code" API once the backend is ready.
    this.submitted.set(false);
    this.step.set(3);
  }

  resendCode(): void {
    if (this.resendSeconds() > 0) return;
    // TODO: call the real "resend code" API once the backend is ready.
    this.otpDigits.set(Array(OTP_LENGTH).fill(''));
    this.otpInputs()[0]?.nativeElement.focus();
    this.startResendCountdown();
  }

  private startResendCountdown(): void {
    this.resendSeconds.set(RESEND_SECONDS);
    if (this.resendTimer) clearInterval(this.resendTimer);
    this.resendTimer = setInterval(() => {
      this.resendSeconds.update((s) => {
        if (s <= 1) {
          if (this.resendTimer) clearInterval(this.resendTimer);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update((v) => !v);
  }

  onNewPasswordInput(event: Event): void {
    this.newPassword.set((event.target as HTMLInputElement).value);
  }

  onConfirmPasswordInput(event: Event): void {
    this.confirmPassword.set((event.target as HTMLInputElement).value);
  }

  submitStep3(event: Event): void {
    event.preventDefault();
    this.submitted.set(true);
    if (!this.newPassword() || !this.confirmPassword() || this.passwordMismatch()) return;
    // TODO: call the real "set new password" API once the backend is ready.
    this.done.set(true);
  }

  goToLogin(): void {
    this.router.navigate(['/', this.lang(), 'auth', 'login']);
  }

  ngOnDestroy(): void {
    if (this.resendTimer) clearInterval(this.resendTimer);
  }
}
