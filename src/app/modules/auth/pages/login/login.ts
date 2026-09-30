import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthBrandService } from '../../../../shared/services/auth-brand.service';
import { LanguageStoreService } from '../../../../shared/services/language/language-store.service';
import { LoginMethod, LoginMethodSwitchComponent } from '../../components/login-method-switch/login-method-switch';
import { LoginMagicLinkFormComponent } from '../../components/login-magic-link-form/login-magic-link-form';
import { LoginPasswordFormComponent } from '../../components/login-password-form/login-password-form';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, TranslatePipe, LoginPasswordFormComponent, LoginMagicLinkFormComponent, LoginMethodSwitchComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  private readonly brand = inject(AuthBrandService);

  readonly lang = inject(LanguageStoreService).currentLanguage;
  readonly method = signal<LoginMethod>('magic-link');

  ngOnInit(): void {

    this.brand.set([
      {
        image: '/assets/images/hero/hero-offline-sesstion.webp',
        title: 'AUTH.BRAND.SLIDE1_TITLE',
        desc: 'AUTH.BRAND.SLIDE1_DESC',
      },
      {
        image: '/assets/images/hero/hero-online-cource.webp',
        title: 'AUTH.BRAND.SLIDE2_TITLE',
        desc: 'AUTH.BRAND.SLIDE2_DESC',
      },
      {
        image: '/assets/images/hero/hero-certificate.webp',
        title: 'AUTH.BRAND.SLIDE3_TITLE',
        desc: 'AUTH.BRAND.SLIDE3_DESC',
      },
    ]);
  }
}
