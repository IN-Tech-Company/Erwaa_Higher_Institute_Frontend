import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Trainee } from '../../../../shared/models/admin-trainees.models';
import { LanguageStoreService } from '../../../../shared/services/language/language-store.service';
import { AdminTraineesStore } from '../../../../shared/stores/admin-trainees.store';

@Component({
  selector: 'app-trainees-table',
  standalone: true,
  imports: [DatePipe, RouterLink, TranslatePipe],
  templateUrl: './trainees-table.html',
  styleUrl: './trainees-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TraineesTableComponent {
  readonly store = inject(AdminTraineesStore);
  readonly lang = inject(LanguageStoreService).currentLanguage;

  readonly skeletonRows = [1, 2, 3, 4, 5];

  status(trainee: Trainee): 'active' | 'unverified' | 'disabled' {
    if (!trainee.enabled) return 'disabled';
    return trainee.emailVerified ? 'active' : 'unverified';
  }

  link(trainee: Trainee, ...rest: string[]): (string | number)[] {
    return ['/', this.lang(), 'app', 'admin', 'trainees', trainee.id, ...rest];
  }
}
