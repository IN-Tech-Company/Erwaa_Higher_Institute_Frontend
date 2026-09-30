import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthStore } from '../../../../shared/services/auth.store';
import { LanguageStoreService } from '../../../../shared/services/language/language-store.service';

@Component({
  selector: 'app-magic-link',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './magic-link.html',
  styleUrl: './magic-link.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MagicLinkComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  readonly lang = inject(LanguageStoreService).currentLanguage;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // From the email link: /{lang}/auth/magic-link?token=… — kept in memory only, see ngOnInit.
  readonly token = this.route.snapshot.queryParamMap.get('token');

  constructor() {
    this.authStore.reset();
    if (this.token) {
      this.authStore.verifyMagicLink(this.token);
    }
  }

  ngOnInit(): void {
    // Hide the token: drop it from the address bar and the browser history.
    this.router.navigate([], { relativeTo: this.route, queryParams: {}, replaceUrl: true });
  }
}
