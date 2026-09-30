import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { PASSWORD_MIN_LENGTH, PASSWORD_PATTERN } from '../../../../../../shared/utills/password-rules';
import { AdminTraineesStore } from '../../admin-trainees.store';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const { newPassword, confirmPassword } = group.value;
  return confirmPassword && newPassword !== confirmPassword ? { passwordMismatch: true } : null;
}

/** Set a new password for the selected trainee. */
@Component({
  selector: 'app-trainee-password-form',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './trainee-password-form.html',
  styleUrl: './trainee-password-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TraineePasswordFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  readonly store = inject(AdminTraineesStore);

  readonly trainee = this.store.selected();
  readonly showPassword = signal(false);

  readonly form = this.fb.group(
    {
      newPassword: [
        '',
        [Validators.required, Validators.minLength(PASSWORD_MIN_LENGTH), Validators.pattern(PASSWORD_PATTERN)],
      ],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordsMatch }
  );

  hasError(field: 'newPassword' | 'confirmPassword', error: string): boolean {
    const control = this.form.controls[field];
    return control.touched && control.hasError(error);
  }

  passwordMismatch(): boolean {
    return this.form.controls.confirmPassword.touched && this.form.hasError('passwordMismatch');
  }

  submit(): void {
    if (this.form.invalid || !this.trainee) {
      this.form.markAllAsTouched();
      return;
    }
    this.store.setPassword(this.trainee, this.form.getRawValue());
  }
}
