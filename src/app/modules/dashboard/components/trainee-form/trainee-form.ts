import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Trainee } from '../../../../shared/models/admin-trainees.models';
import { LanguageStoreService } from '../../../../shared/services/language/language-store.service';
import { AdminTraineesStore } from '../../../../shared/stores/admin-trainees.store';
import { PASSWORD_MIN_LENGTH, PASSWORD_PATTERN } from '../../../../shared/utills/password-rules';

// Saudi mobile: 5XXXXXXXX, with an optional 0 / 966 / +966 prefix (the API strips it).
const SAUDI_MOBILE = /^(\+?966|0)?5\d{8}$/;

/** Add a trainee, or edit one when `trainee` is given (no password field when editing). */
@Component({
  selector: 'app-trainee-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './trainee-form.html',
  styleUrl: './trainee-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TraineeFormComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  readonly store = inject(AdminTraineesStore);
  readonly lang = inject(LanguageStoreService).currentLanguage;

  readonly trainee = input<Trainee | null>(null);
  readonly showPassword = signal(false);

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(SAUDI_MOBILE)]],
    password: [
      '',
      [Validators.required, Validators.minLength(PASSWORD_MIN_LENGTH), Validators.pattern(PASSWORD_PATTERN)],
    ],
  });

  ngOnInit(): void {
    const trainee = this.trainee();
    if (trainee) {
      this.form.patchValue({ name: trainee.name, email: trainee.email, phone: trainee.phone });
      // The password isn't changed from this form when editing.
      this.form.controls.password.clearValidators();
      this.form.controls.password.updateValueAndValidity();
    }
  }

  hasError(field: 'name' | 'email' | 'phone' | 'password', error: string): boolean {
    const control = this.form.controls[field];
    return control.touched && control.hasError(error);
  }

  cancelLink(): (string | number)[] {
    const base = ['/', this.lang(), 'app', 'admin', 'trainees'];
    const trainee = this.trainee();
    return trainee ? [...base, trainee.id] : base;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { password, ...details } = this.form.getRawValue();
    const trainee = this.trainee();
    if (trainee) {
      this.store.update(trainee.id, details);
    } else {
      this.store.create({ ...details, password });
    }
  }
}
