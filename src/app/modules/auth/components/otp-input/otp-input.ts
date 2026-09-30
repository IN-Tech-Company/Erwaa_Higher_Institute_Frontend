import { ChangeDetectionStrategy, Component, ElementRef, computed, input, model, viewChildren } from '@angular/core';

/**
 * Row of single-digit boxes for a verification code — auto-advances on
 * input, steps back on Backspace, and accepts a pasted code. The code is
 * exposed as one string through `[(value)]`.
 */
@Component({
  selector: 'app-otp-input',
  standalone: true,
  templateUrl: './otp-input.html',
  styleUrl: './otp-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpInputComponent {
  readonly length = input(6);
  readonly invalid = input(false);
  readonly ariaLabel = input('');
  readonly value = model('');

  readonly boxes = viewChildren<ElementRef<HTMLInputElement>>('box');
  readonly digits = computed(() =>
    Array.from({ length: this.length() }, (_, i) => this.value()[i] ?? '')
  );

  focus(): void {
    this.focusBox(Math.min(this.value().length, this.length() - 1));
  }

  clear(): void {
    this.value.set('');
    this.focusBox(0);
  }

  onInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const digit = input.value.replace(/\D/g, '').slice(-1);
    const current = this.value();
    // Typing past the first empty box lands in that box instead, so the
    // code never has gaps.
    const target = Math.min(index, current.length);
    input.value = this.digits()[index];

    if (!digit) {
      this.value.set(current.slice(0, target));
      return;
    }
    this.value.set(current.slice(0, target) + digit + current.slice(target + 1));
    this.focusBox(target + 1);
  }

  onKeydown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.digits()[index]) {
      this.focusBox(index - 1);
    }
  }

  onPaste(event: ClipboardEvent): void {
    const pasted = event.clipboardData?.getData('text').replace(/\D/g, '').slice(0, this.length()) ?? '';
    if (!pasted) return;
    event.preventDefault();
    this.value.set(pasted);
    this.focusBox(pasted.length - 1);
  }

  private focusBox(index: number): void {
    const clamped = Math.max(0, Math.min(index, this.length() - 1));
    this.boxes()[clamped]?.nativeElement.focus();
  }
}
