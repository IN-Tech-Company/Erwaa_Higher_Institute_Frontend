import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { LanguageStoreService } from '../../../../shared/services/language/language-store.service';
import { AdminTraineesStore } from '../../../../shared/stores/admin-trainees.store';
import { TraineesTableComponent } from '../../components/trainees-table/trainees-table';

/** Admin → trainees list: search, filter, table and pages. */
@Component({
  selector: 'app-admin-trainees',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe, TraineesTableComponent],
  templateUrl: './admin-trainees.html',
  styleUrl: './admin-trainees.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTraineesComponent {
  readonly store = inject(AdminTraineesStore);
  readonly lang = inject(LanguageStoreService).currentLanguage;

  // Starts from the saved search, so coming back from a trainee keeps it.
  readonly search = new FormControl(this.store.search(), { nonNullable: true });

  constructor() {
    this.store.load();

    // Search a moment after the admin stops typing, not on every key.
    this.search.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((value) => this.store.setSearch(value.trim()));

    inject(DestroyRef).onDestroy(() => this.store.notice.set(null));
  }

  onStatusChange(value: string): void {
    this.store.setEnabled(value === '' ? null : value === 'true');
  }
}
