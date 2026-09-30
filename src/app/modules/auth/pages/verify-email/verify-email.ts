import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthStore } from '../../../../shared/services/auth.store';
import { LanguageStoreService } from '../../../../shared/services/language/language-store.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyEmailComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  readonly authStore = inject(AuthStore);
  readonly lang = inject(LanguageStoreService).currentLanguage;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // From the email link: /{lang}/auth/verify-email?token=… — kept in memory only, see ngOnInit.
  readonly token = this.route.snapshot.queryParamMap.get('token');

  readonly resendForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor() {
    this.authStore.reset();
    if (this.token) {
      this.authStore.verifyEmail(this.token);
    }
  }

  ngOnInit(): void {
    // Hide the token: drop it from the address bar and the browser history.
    this.router.navigate([], { relativeTo: this.route, queryParams: {}, replaceUrl: true });
  }

  hasError(error: string): boolean {
    const control = this.resendForm.controls.email;
    return control.touched && control.hasError(error);
  }

  resend(): void {
    if (this.resendForm.invalid) {
      this.resendForm.markAllAsTouched();
      return;
    }
    this.authStore.resendVerifyEmail(this.resendForm.getRawValue().email);
  }
}
