import { ChangeDetectionStrategy, Component, computed, model } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

export type LoginMethod = 'magic-link' | 'password';

@Component({
  selector: 'app-login-method-switch',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './login-method-switch.html',
  styleUrl: './login-method-switch.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginMethodSwitchComponent {
  readonly method = model<LoginMethod>('magic-link');

  readonly target = computed(() =>
    this.method() === 'magic-link'
      ? { value: 'password' as const, icon: 'password', label: 'AUTH.LOGIN.USE_PASSWORD' }
      : { value: 'magic-link' as const, icon: 'mark_email_read', label: 'AUTH.LOGIN.USE_MAGIC_LINK' }
  );
}
