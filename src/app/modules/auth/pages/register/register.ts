import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageStoreService } from '../../../../shared/services/language/language-store.service';
import { RegisterFormComponent } from '../../components/register-form/register-form';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, TranslatePipe, RegisterFormComponent],
  templateUrl: './register.html',
  styleUrl: './register.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  readonly lang = inject(LanguageStoreService).currentLanguage;
}
