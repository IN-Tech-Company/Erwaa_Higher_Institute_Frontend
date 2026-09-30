import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageStoreService } from '../../../../shared/services/language/language-store.service';
import { AuthStore } from '../../../../shared/services/auth.store';

@Component({
  selector: 'app-login-password-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './login-password-form.html',
  styleUrl: './login-password-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPasswordFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  readonly lang = inject(LanguageStoreService).currentLanguage;
  readonly authStore = inject(AuthStore);
  readonly showPassword = signal(false);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor() {
    this.authStore.reset();
  }

  hasError(field: 'email' | 'password', error: string): boolean {
    const control = this.form.controls[field];
    return control.touched && control.hasError(error);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.authStore.login(this.form.getRawValue());
  }
}
