import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageStoreService } from '../../../../shared/services/language-store.service';

// Trainee registration only — the teacher application is a fully separate
// flow/page (RegisterTeacherComponent), not a tab here. See project-brief.md
// for why they were split.
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './register.html',
  styleUrl: './register.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private readonly langStore = inject(LanguageStoreService);

  readonly lang = this.langStore.currentLanguage;

  readonly fullName = signal('');
  readonly email = signal('');
  readonly phone = signal('');
  readonly nationalId = signal('');
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

  onFullNameInput(event: Event): void {
    this.fullName.set((event.target as HTMLInputElement).value);
  }

  onEmailInput(event: Event): void {
    this.email.set((event.target as HTMLInputElement).value);
  }

  onPhoneInput(event: Event): void {
    this.phone.set((event.target as HTMLInputElement).value);
  }

  onNationalIdInput(event: Event): void {
    this.nationalId.set((event.target as HTMLInputElement).value);
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
      !!this.fullName() &&
      !!this.email() &&
      !!this.phone() &&
      !!this.nationalId() &&
      !!this.password() &&
      !!this.confirmPassword() &&
      this.password() === this.confirmPassword() &&
      this.agreeTerms();

    if (!valid) return;
    // TODO: wire to the real registration API once the backend is ready.
  }
}
