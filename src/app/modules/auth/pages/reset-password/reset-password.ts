import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthStore } from '../../../../shared/services/auth.store';
import { LanguageStoreService } from '../../../../shared/services/language/language-store.service';
import { PASSWORD_MIN_LENGTH, PASSWORD_PATTERN } from '../../../../shared/utills/password-rules';


function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const { newPassword, confirmPassword } = group.value;
  return confirmPassword && newPassword !== confirmPassword ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  readonly authStore = inject(AuthStore);
  readonly lang = inject(LanguageStoreService).currentLanguage;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // From the email link: /{lang}/auth/reset-password?token=… — kept in memory only, see ngOnInit.
  readonly token = this.route.snapshot.queryParamMap.get('token');

  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);

  readonly form = this.fb.group(
    {
      newPassword: ['', [Validators.required, Validators.minLength(PASSWORD_MIN_LENGTH), Validators.pattern(PASSWORD_PATTERN)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordsMatch }
  );

  constructor() {
    this.authStore.reset();
  }

  ngOnInit(): void {
    // Hide the token: drop it from the address bar and the browser history.
    this.router.navigate([], { relativeTo: this.route, queryParams: {}, replaceUrl: true });
  }

  hasError(field: 'newPassword' | 'confirmPassword', error: string): boolean {
    const control = this.form.controls[field];
    return control.touched && control.hasError(error);
  }

  passwordMismatch(): boolean {
    return this.form.controls.confirmPassword.touched && this.form.hasError('passwordMismatch');
  }

  submit(): void {
    if (this.form.invalid || !this.token) {
      this.form.markAllAsTouched();
      return;
    }
    this.authStore.resetPassword({ token: this.token, ...this.form.getRawValue() });
  }
}
