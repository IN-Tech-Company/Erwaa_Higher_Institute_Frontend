import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { AppSidebarComponent } from '../app-sidebar/app-sidebar';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [AppSidebarComponent],
  templateUrl: './confirm-modal.html',
  styleUrl: './confirm-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmModalComponent {
  // ── Inputs ─────────────────────────────────────────────────────────────────
  readonly show = input<boolean>(false);
  readonly type = input<'success' | 'danger'>('success');
  readonly icon = input<string>('bx bx-check-shield');
  readonly title = input<string>('');
  readonly message = input<string>('');
  readonly confirmLabel = input<string>('تأكيد');
  readonly cancelLabel = input<string>('إلغاء');

  /** Set to true to show a textarea (e.g. for rejection reason) */
  readonly withInput = input<boolean>(false);
  readonly inputPlaceholder = input<string>('');

  // ── Outputs ────────────────────────────────────────────────────────────────
  /** Emits the textarea value (or empty string when withInput is false) */
  readonly confirm = output<string>();
  readonly cancel = output<void>();

  // ── Internal state ─────────────────────────────────────────────────────────
  readonly inputValue = signal('');

  constructor() {
    effect(() => {
      if (!this.show()) this.inputValue.set('');
    });
  }

  get confirmDisabled(): boolean {
    return this.withInput() && !this.inputValue().trim();
  }

  onConfirm(): void {
    if (this.confirmDisabled) return;
    this.confirm.emit(this.inputValue().trim());
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
