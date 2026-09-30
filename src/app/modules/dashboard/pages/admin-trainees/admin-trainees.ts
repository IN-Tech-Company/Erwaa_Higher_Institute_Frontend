import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ModalComponent } from '../../../../shared/components/modal/modal';
import { AdminTraineesStore, TraineeDialog } from './admin-trainees.store';
import { TraineeFormComponent } from './components/trainee-form/trainee-form';
import { TraineePasswordFormComponent } from './components/trainee-password-form/trainee-password-form';
import { TraineesTableComponent } from './components/trainees-table/trainees-table';

const DIALOG_TITLES: Record<TraineeDialog, string> = {
  create: 'ADMIN_TRAINEES.ADD_TITLE',
  edit: 'ADMIN_TRAINEES.EDIT_TITLE',
  password: 'ADMIN_TRAINEES.PASSWORD_TITLE',
  delete: 'ADMIN_TRAINEES.DELETE_TITLE',
};

/** Admin → trainees: list, search, add, edit, password, enable/disable, delete. */
@Component({
  selector: 'app-admin-trainees',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    ModalComponent,
    TraineesTableComponent,
    TraineeFormComponent,
    TraineePasswordFormComponent,
  ],
  providers: [AdminTraineesStore],
  templateUrl: './admin-trainees.html',
  styleUrl: './admin-trainees.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTraineesComponent {
  readonly store = inject(AdminTraineesStore);
  readonly search = new FormControl('', { nonNullable: true });

  readonly dialogTitle = computed(() => {
    const dialog = this.store.dialog();
    return dialog ? DIALOG_TITLES[dialog] : '';
  });

  constructor() {
    this.store.load();

    // Search a moment after the admin stops typing, not on every key.
    this.search.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((value) => this.store.setSearch(value.trim()));
  }

  onStatusChange(value: string): void {
    this.store.setEnabled(value === '' ? null : value === 'true');
  }
}
