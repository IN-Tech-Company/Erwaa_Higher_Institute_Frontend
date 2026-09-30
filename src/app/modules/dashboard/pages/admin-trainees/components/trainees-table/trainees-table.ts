import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Trainee } from '../../../../../../shared/models/admin-trainees.models';
import { LanguageStoreService } from '../../../../../../shared/services/language/language-store.service';
import { AdminTraineesStore } from '../../admin-trainees.store';

@Component({
  selector: 'app-trainees-table',
  standalone: true,
  imports: [DatePipe, TranslatePipe],
  templateUrl: './trainees-table.html',
  styleUrl: './trainees-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TraineesTableComponent {
  readonly store = inject(AdminTraineesStore);
  readonly lang = inject(LanguageStoreService).currentLanguage;

  status(trainee: Trainee): 'active' | 'unverified' | 'disabled' {
    if (!trainee.enabled) return 'disabled';
    return trainee.emailVerified ? 'active' : 'unverified';
  }
}
