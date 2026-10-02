import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageStoreService } from '../../../../shared/services/language/language-store.service';
import { AdminTraineesStore } from '../../../../shared/stores/admin-trainees.store';

/** Admin → one trainee: profile, details, actions and delete. */
@Component({
  selector: 'app-admin-trainee-details',
  standalone: true,
  imports: [DatePipe, RouterLink, TranslatePipe],
  templateUrl: './admin-trainee-details.html',
  styleUrl: './admin-trainee-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTraineeDetailsComponent {
  readonly store = inject(AdminTraineesStore);
  readonly lang = inject(LanguageStoreService).currentLanguage;

  readonly id = Number(inject(ActivatedRoute).snapshot.paramMap.get('id'));
  readonly confirmingDelete = signal(false);

  constructor() {
    this.store.formError.set(null);
    this.store.loadOne(this.id);
    inject(DestroyRef).onDestroy(() => this.store.notice.set(null));
  }

  link(...rest: string[]): (string | number)[] {
    return ['/', this.lang(), 'app', 'admin', 'trainees', ...(rest.length ? [this.id, ...rest] : [])];
  }
}
