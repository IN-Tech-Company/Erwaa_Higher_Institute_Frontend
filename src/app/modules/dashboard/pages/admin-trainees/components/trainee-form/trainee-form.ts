import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { PASSWORD_MIN_LENGTH, PASSWORD_PATTERN } from '../../../../../../shared/utills/password-rules';
import { AdminTraineesStore } from '../../admin-trainees.store';

// Saudi mobile: 5XXXXXXXX, with an optional 0 / 966 / +966 prefix (the API strips it).
const SAUDI_MOBILE = /^(\+?966|0)?5\d{8}$/;

/** Add a trainee, or edit the selected one (no password field when editing). */
@Component({
  selector: 'app-trainee-form',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './trainee-form.html',
  styleUrl: './trainee-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TraineeFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  readonly store = inject(AdminTraineesStore);

  readonly trainee = this.store.selected();
  readonly showPassword = signal(false);

  readonly form = this.fb.group({
    name: [this.trainee?.name ?? '', [Validators.required, Validators.minLength(2)]],
    email: [this.trainee?.email ?? '', [Validators.required, Validators.email]],
    phone: [this.trainee?.phone ?? '', [Validators.required, Validators.pattern(SAUDI_MOBILE)]],
    password: [
      '',
      this.trainee
        ? []
        : [Validators.required, Validators.minLength(PASSWORD_MIN_LENGTH), Validators.pattern(PASSWORD_PATTERN)],
    ],
  });

  hasError(field: 'name' | 'email' | 'phone' | 'password', error: string): boolean {
    const control = this.form.controls[field];
    return control.touched && control.hasError(error);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { password, ...details } = this.form.getRawValue();
    if (this.trainee) {
      this.store.update(this.trainee.id, details);
    } else {
      this.store.create({ ...details, password });
    }
  }
}
