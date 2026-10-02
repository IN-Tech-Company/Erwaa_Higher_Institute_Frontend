import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  CreateTraineeRequest,
  SetTraineePasswordRequest,
  Trainee,
  UpdateTraineeRequest,
} from '../models/admin-trainees.models';
import { AdminTraineesService } from '../services/admin-trainees.service';
import { LanguageStoreService } from '../services/language/language-store.service';

@Injectable({ providedIn: 'root' })
export class AdminTraineesStore {
  private readonly api = inject(AdminTraineesService);
  private readonly router = inject(Router);
  private readonly lang = inject(LanguageStoreService).currentLanguage;

  // List page
  readonly trainees = signal<Trainee[]>([]);
  readonly total = signal(0);
  readonly totalPages = signal(0);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  // Filters (kept while moving between the list and a trainee's pages)
  readonly search = signal('');
  readonly enabled = signal<boolean | null>(null);
  readonly page = signal(0);

  // One trainee (details / edit / password pages)
  readonly trainee = signal<Trainee | null>(null);
  readonly traineeLoading = signal(false);
  readonly traineeError = signal<string | null>(null);

  // Forms and actions
  readonly saving = signal(false);
  readonly formError = signal<string | null>(null);

  // Green message after an action
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

  loadOne(id: number): void {
    // Show the row we already have from the list straight away, then refresh it.
    this.trainee.set(this.trainees().find((t) => t.id === id) ?? null);
    this.traineeLoading.set(true);
    this.traineeError.set(null);

    this.api.get(id).subscribe({
      next: (trainee) => {
        this.trainee.set(trainee);
        this.traineeLoading.set(false);
      },
      error: (err) => {
        this.traineeError.set(err.error?.message ?? 'AUTH.ERRORS.GENERIC');
        this.traineeLoading.set(false);
      },
    });
  }

  create(body: CreateTraineeRequest): void {
    this.saving.set(true);
    this.formError.set(null);

    this.api.create(body).subscribe({
      next: (trainee) => {
        this.saving.set(false);
        this.trainee.set(trainee);
        this.goTo([trainee.id], 'ADMIN_TRAINEES.NOTICE_CREATED');
      },
      error: (err) => {
        this.formError.set(err.error?.message ?? 'AUTH.ERRORS.GENERIC');
        this.saving.set(false);
      },
    });
  }

  update(id: number, body: UpdateTraineeRequest): void {
    this.saving.set(true);
    this.formError.set(null);

    this.api.update(id, body).subscribe({
      next: (trainee) => {
        this.saving.set(false);
        this.replace(trainee);
        this.goTo([id], 'ADMIN_TRAINEES.NOTICE_UPDATED');
      },
      error: (err) => {
        this.formError.set(err.error?.message ?? 'AUTH.ERRORS.GENERIC');
        this.saving.set(false);
      },
    });
  }

  setPassword(trainee: Trainee, body: SetTraineePasswordRequest): void {
    this.saving.set(true);
    this.formError.set(null);

    this.api.setPassword(trainee.id, body).subscribe({
      next: () => {
        this.saving.set(false);
        this.goTo([trainee.id], 'ADMIN_TRAINEES.NOTICE_PASSWORD');
        // Per the doc: a trainee who never confirmed their email can't sign in until enabled.
        if (!trainee.emailVerified) {
          this.api.enable(trainee.id).subscribe({ next: (updated) => this.replace(updated) });
        }
      },
      error: (err) => {
        this.formError.set(err.error?.message ?? 'AUTH.ERRORS.GENERIC');
        this.saving.set(false);
      },
    });
  }

  toggleEnabled(trainee: Trainee): void {
    const request$ = trainee.enabled ? this.api.disable(trainee.id) : this.api.enable(trainee.id);
    this.saving.set(true);
    this.formError.set(null);

    request$.subscribe({
      next: (updated) => {
        this.saving.set(false);
        this.replace(updated);
        this.notice.set(updated.enabled ? 'ADMIN_TRAINEES.NOTICE_ENABLED' : 'ADMIN_TRAINEES.NOTICE_DISABLED');
      },
      error: (err) => {
        this.formError.set(err.error?.message ?? 'AUTH.ERRORS.GENERIC');
        this.saving.set(false);
      },
    });
  }

  remove(id: number): void {
    this.saving.set(true);
    this.formError.set(null);

    this.api.delete(id).subscribe({
      next: () => {
        this.saving.set(false);
        this.trainee.set(null);
        this.goTo([], 'ADMIN_TRAINEES.NOTICE_DELETED');
      },
      error: (err) => {
        this.formError.set(err.error?.message ?? 'AUTH.ERRORS.GENERIC');
        this.saving.set(false);
      },
    });
  }

  /** Update the trainee everywhere it's shown (list row + open trainee). */
  private replace(trainee: Trainee): void {
    this.trainees.update((list) => list.map((t) => (t.id === trainee.id ? trainee : t)));
    if (this.trainee()?.id === trainee.id) this.trainee.set(trainee);
  }

  /** Go to a trainees page, then show the notice there (set after, so the old page doesn't clear it). */
  private goTo(path: (string | number)[], notice: string): void {
    this.router
      .navigate(['/', this.lang(), 'app', 'admin', 'trainees', ...path])
      .then(() => this.notice.set(notice));
  }
}
