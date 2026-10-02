import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageStoreService } from '../../../../shared/services/language/language-store.service';
import { AdminTraineesStore } from '../../../../shared/stores/admin-trainees.store';
import { TraineePasswordFormComponent } from '../../components/trainee-password-form/trainee-password-form';

/** Admin → set a new password for a trainee (`/:id/password`). */
@Component({
  selector: 'app-admin-trainee-password',
  standalone: true,
  imports: [RouterLink, TranslatePipe, TraineePasswordFormComponent],
  templateUrl: './admin-trainee-password.html',
  styleUrl: './admin-trainee-password.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTraineePasswordComponent {
  readonly store = inject(AdminTraineesStore);
  readonly lang = inject(LanguageStoreService).currentLanguage;

  readonly id = Number(inject(ActivatedRoute).snapshot.paramMap.get('id'));

  constructor() {
    this.store.formError.set(null);
    this.store.loadOne(this.id);
  }
}
