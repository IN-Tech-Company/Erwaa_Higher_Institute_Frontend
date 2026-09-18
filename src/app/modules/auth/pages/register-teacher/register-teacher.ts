import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageStoreService } from '../../../../shared/services/language-store.service';

// Teacher application — a fully separate page/flow from trainee registration
// (RegisterComponent). Deliberately not a tab on the same form: teacher
// accounts go through admin review and have nothing to do with students.
// See project-brief.md for the decision.
@Component({
  selector: 'app-register-teacher',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './register-teacher.html',
  styleUrl: './register-teacher.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterTeacherComponent {
  private readonly langStore = inject(LanguageStoreService);

  readonly lang = this.langStore.currentLanguage;

  readonly firstName = signal('');
  readonly lastName = signal('');
  readonly email = signal('');
  readonly phone = signal('');
  readonly specialization = signal('');
  readonly yearsOfExperience = signal('');
  readonly password = signal('');
  readonly confirmPassword = signal('');
  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);
  readonly agreeTerms = signal(false);

  readonly submitted = signal(false);

  readonly passwordMismatch = computed(
    () => this.confirmPassword().length > 0 && this.password() !== this.confirmPassword()
  );

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update((v) => !v);
  }

  toggleTerms(): void {
    this.agreeTerms.update((v) => !v);
  }

  onFirstNameInput(event: Event): void {
    this.firstName.set((event.target as HTMLInputElement).value);
  }

  onLastNameInput(event: Event): void {
    this.lastName.set((event.target as HTMLInputElement).value);
  }

  onEmailInput(event: Event): void {
    this.email.set((event.target as HTMLInputElement).value);
  }

  onPhoneInput(event: Event): void {
    this.phone.set((event.target as HTMLInputElement).value);
  }

  onSpecializationInput(event: Event): void {
    this.specialization.set((event.target as HTMLInputElement).value);
  }

  onYearsOfExperienceInput(event: Event): void {
    this.yearsOfExperience.set((event.target as HTMLInputElement).value);
  }

  onPasswordInput(event: Event): void {
    this.password.set((event.target as HTMLInputElement).value);
  }

  onConfirmPasswordInput(event: Event): void {
    this.confirmPassword.set((event.target as HTMLInputElement).value);
  }

  submit(event: Event): void {
    event.preventDefault();
    this.submitted.set(true);

    const valid =
      !!this.firstName() &&
      !!this.lastName() &&
      !!this.email() &&
      !!this.phone() &&
      !!this.specialization() &&
      !!this.yearsOfExperience() &&
      !!this.password() &&
      !!this.confirmPassword() &&
      this.password() === this.confirmPassword() &&
      this.agreeTerms();

    if (!valid) return;
    // TODO: wire to the real teacher-application API once the backend is
    // ready — this goes through admin review, not instant activation (see
    // AUTH.REGISTER.TEACHER_DESC copy).
  }
}
