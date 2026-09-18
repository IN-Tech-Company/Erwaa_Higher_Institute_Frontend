import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthBrandService } from '../../../../shared/services/auth-brand.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { LanguageStoreService } from '../../../../shared/services/language-store.service';
import { TokenService } from '../../../../shared/services/token.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  private readonly brand = inject(AuthBrandService);
  private readonly langStore = inject(LanguageStoreService);
  private readonly authService = inject(AuthService);
  private readonly tokenService = inject(TokenService);
  private readonly toast = inject(ToastService);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);

  readonly lang = this.langStore.currentLanguage;

  readonly email = signal('');
  readonly password = signal('');
  readonly showPassword = signal(false);
  readonly submitted = signal(false);
  readonly loading = signal(false);
  // `ToastService` exists but nothing in the app renders its toasts yet (no
  // toast-container component anywhere) — shown inline here too so a failed
  // login is actually visible; see docs/project-brief.md.
  readonly apiError = signal<string | null>(null);

  ngOnInit(): void {
    // Real institute photos (see docs/project-brief.md) — the old
    // auth-*.png files referenced here never existed on disk (broken
    // background), a leftover from the previous template.
    this.brand.set([
      {
        image: '/assets/images/hero/hero-offline-sesstion.png',
        title: 'AUTH.BRAND.SLIDE1_TITLE',
        desc: 'AUTH.BRAND.SLIDE1_DESC',
      },
      {
        image: '/assets/images/hero/hero-online-cource.png',
        title: 'AUTH.BRAND.SLIDE2_TITLE',
        desc: 'AUTH.BRAND.SLIDE2_DESC',
      },
      {
        image: '/assets/images/hero/hero-certificate.png',
        title: 'AUTH.BRAND.SLIDE3_TITLE',
        desc: 'AUTH.BRAND.SLIDE3_DESC',
      },
    ]);
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  onEmailInput(event: Event): void {
    this.email.set((event.target as HTMLInputElement).value);
  }

  onPasswordInput(event: Event): void {
    this.password.set((event.target as HTMLInputElement).value);
  }

  submit(event: Event): void {
    event.preventDefault();
    this.submitted.set(true);
    this.apiError.set(null);
    if (!this.email() || !this.password()) return;

    this.loading.set(true);
    this.authService.login({ username: this.email(), password: this.password() }).subscribe({
      next: (res) => {
        this.loading.set(false);
        // `LoginResponseData`'s real field names aren't confirmed yet (see
        // docs/project-brief.md) — try the common ones defensively instead
        // of assuming, so a wrong guess fails loudly instead of silently.
        const body = res.body as unknown as Record<string, unknown> | null;
        const accessToken = (body?.['accessToken'] ?? body?.['token']) as string | undefined;
        const refreshToken = body?.['refreshToken'] as string | undefined;

        if (!accessToken) {
          console.error('[Login] Expected an access token in the response body, got:', body);
          const message = this.translate.instant('AUTH.ERRORS.GENERIC');
          this.apiError.set(message);
          this.toast.error(message);
          return;
        }

        if (refreshToken) {
          this.tokenService.setTokens(accessToken, refreshToken);
        } else {
          this.tokenService.setToken(accessToken);
        }
        this.router.navigate(['/', this.lang(), 'app']);
      },
      error: (err) => {
        this.loading.set(false);
        const message = err?.error?.message ?? this.translate.instant('AUTH.ERRORS.INVALID_CREDS');
        this.apiError.set(message);
        this.toast.error(message);
      },
    });
  }
}
