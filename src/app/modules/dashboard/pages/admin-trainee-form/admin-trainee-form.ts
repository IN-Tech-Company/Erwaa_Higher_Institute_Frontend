import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageStoreService } from '../../../../shared/services/language/language-store.service';
import { AdminTraineesStore } from '../../../../shared/stores/admin-trainees.store';
import { TraineeFormComponent } from '../../components/trainee-form/trainee-form';

/** Admin → add a trainee (`/new`) or edit one (`/:id/edit`). */
@Component({
  selector: 'app-admin-trainee-form',
  standalone: true,
  imports: [RouterLink, TranslatePipe, TraineeFormComponent],
  templateUrl: './admin-trainee-form.html',
  styleUrl: './admin-trainee-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTraineeFormPageComponent {
  readonly store = inject(AdminTraineesStore);
  readonly lang = inject(LanguageStoreService).currentLanguage;

  // No id = add a new trainee.
  readonly id = Number(inject(ActivatedRoute).snapshot.paramMap.get('id')) || null;

  constructor() {
    this.store.formError.set(null);
    if (this.id) this.store.loadOne(this.id);
  }

  backLink(): (string | number)[] {
    const list = ['/', this.lang(), 'app', 'admin', 'trainees'];
    return this.id ? [...list, this.id] : list;
  }
}
