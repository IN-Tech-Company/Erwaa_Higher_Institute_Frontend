import { Injectable, inject, signal } from '@angular/core';
import {
  CreateTraineeRequest,
  SetTraineePasswordRequest,
  Trainee,
  UpdateTraineeRequest,
} from '../../../../shared/models/admin-trainees.models';
import { AdminTraineesService } from '../../../../shared/services/admin-trainees.service';

export type TraineeDialog = 'create' | 'edit' | 'password' | 'delete';

/** State for the admin trainees page — provided by that page, so it starts fresh on every visit. */
@Injectable()
export class AdminTraineesStore {
  private readonly api = inject(AdminTraineesService);

  // List
  readonly trainees = signal<Trainee[]>([]);
  readonly total = signal(0);
  readonly totalPages = signal(0);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  // Filters
  readonly search = signal('');
  readonly enabled = signal<boolean | null>(null);
  readonly page = signal(0);

  // Dialogs (add / edit / password / delete)
  readonly dialog = signal<TraineeDialog | null>(null);
  readonly selected = signal<Trainee | null>(null);
  readonly saving = signal(false);
  readonly dialogError = signal<string | null>(null);

  // Green message at the top of the page after an action
  readonly notice = signal<string | null>(null);

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.list({ search: this.search(), enabled: this.enabled(), page: this.page() }).subscribe({
      next: (res) => {
        this.trainees.set(res.content);
        this.total.set(res.totalElementsCount);
        this.totalPages.set(res.totalPagesCount);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'AUTH.ERRORS.GENERIC');
        this.loading.set(false);
      },
    });
  }

  setSearch(search: string): void {
    this.search.set(search);
    this.page.set(0);
    this.load();
  }

  setEnabled(enabled: boolean | null): void {
    this.enabled.set(enabled);
    this.page.set(0);
    this.load();
  }

  goToPage(page: number): void {
    this.page.set(page);
    this.load();
  }

  openDialog(dialog: TraineeDialog, trainee: Trainee | null = null): void {
    this.selected.set(trainee);
    this.dialogError.set(null);
    this.dialog.set(dialog);
  }

  closeDialog(): void {
    this.dialog.set(null);
    this.selected.set(null);
  }

  create(body: CreateTraineeRequest): void {
    this.saving.set(true);
    this.dialogError.set(null);

    this.api.create(body).subscribe({
      next: () => {
        this.saving.set(false);
        this.closeDialog();
        this.notice.set('ADMIN_TRAINEES.NOTICE_CREATED');
        this.page.set(0);
        this.load();
      },
      error: (err) => {
        this.dialogError.set(err.error?.message ?? 'AUTH.ERRORS.GENERIC');
        this.saving.set(false);
      },
    });
  }

  update(id: number, body: UpdateTraineeRequest): void {
    this.saving.set(true);
    this.dialogError.set(null);

    this.api.update(id, body).subscribe({
      next: (trainee) => {
        this.replace(trainee);
        this.saving.set(false);
        this.closeDialog();
        this.notice.set('ADMIN_TRAINEES.NOTICE_UPDATED');
      },
      error: (err) => {
        this.dialogError.set(err.error?.message ?? 'AUTH.ERRORS.GENERIC');
        this.saving.set(false);
      },
    });
  }

  setPassword(trainee: Trainee, body: SetTraineePasswordRequest): void {
    this.saving.set(true);
    this.dialogError.set(null);

    this.api.setPassword(trainee.id, body).subscribe({
      next: () => {
        this.saving.set(false);
        this.closeDialog();
        this.notice.set('ADMIN_TRAINEES.NOTICE_PASSWORD');
        // Per the doc: a trainee who never confirmed their email can't sign in until enabled.
        if (!trainee.emailVerified) {
          this.api.enable(trainee.id).subscribe({ next: (updated) => this.replace(updated) });
        }
      },
      error: (err) => {
        this.dialogError.set(err.error?.message ?? 'AUTH.ERRORS.GENERIC');
        this.saving.set(false);
      },
    });
  }

  remove(id: number): void {
    this.saving.set(true);
    this.dialogError.set(null);

    this.api.delete(id).subscribe({
      next: () => {
        this.saving.set(false);
        this.closeDialog();
        this.notice.set('ADMIN_TRAINEES.NOTICE_DELETED');
        this.load();
      },
      error: (err) => {
        this.dialogError.set(err.error?.message ?? 'AUTH.ERRORS.GENERIC');
        this.saving.set(false);
      },
    });
  }

  toggleEnabled(trainee: Trainee): void {
    const request$ = trainee.enabled ? this.api.disable(trainee.id) : this.api.enable(trainee.id);
    this.error.set(null);

    request$.subscribe({
      next: (updated) => this.replace(updated),
      error: (err) => this.error.set(err.error?.message ?? 'AUTH.ERRORS.GENERIC'),
    });
  }

  private replace(trainee: Trainee): void {
    this.trainees.update((list) => list.map((t) => (t.id === trainee.id ? trainee : t)));
  }
}
