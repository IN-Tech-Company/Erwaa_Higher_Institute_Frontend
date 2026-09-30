import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthStore } from '../../../../shared/services/auth.store';

@Component({
  selector: 'app-login-magic-link-form',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './login-magic-link-form.html',
  styleUrl: './login-magic-link-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginMagicLinkFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  readonly authStore = inject(AuthStore);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor() {
    this.authStore.reset();
  }

  hasError(error: string): boolean {
    const control = this.form.controls.email;
    return control.touched && control.hasError(error);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.authStore.requestMagicLink(this.form.getRawValue().email);
  }
}
