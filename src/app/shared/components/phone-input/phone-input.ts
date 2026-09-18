import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { SAUDI_PHONE } from '../../utills/phone.utils';
import { LanguageStoreService } from '../../services/language-store.service';

@Component({
  selector: 'app-phone-input',
  standalone: true,
  imports: [],
  templateUrl: './phone-input.html',
  styleUrl: './phone-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PhoneInputComponent),
      multi: true,
    },
  ],
})
export class PhoneInputComponent implements ControlValueAccessor, Validator {
  private readonly lang = inject(LanguageStoreService).currentLanguage;

  readonly label = input<string | undefined>(undefined);
  readonly placeholder = input<string>('5xxxxxxxx');

  readonly effectiveLabel = computed(() =>
    this.label() ?? (this.lang() === 'ar' ? 'رقم الهاتف' : 'Mobile Number')
  );

  readonly displayValue = signal('');
  readonly touched = signal(false);
  readonly disabled = signal(false);

  private onChange: (v: string) => void = () => { };
  private onTouched: () => void = () => { };

  // ── ControlValueAccessor ──────────────────────────────────────────────────

  writeValue(value: string): void {
    this.displayValue.set(this.toDisplay(value));
  }

  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(d: boolean): void { this.disabled.set(d); }

  // ── Validator ─────────────────────────────────────────────────────────────

  validate(control: AbstractControl): ValidationErrors | null {
    const val = (control.value as string) ?? '';
    if (!val) return null;
    return SAUDI_PHONE.test(val) ? null : { saudiPhone: true };
  }

  // ── Events ────────────────────────────────────────────────────────────────

  onInput(event: Event): void {
    const el = event.target as HTMLInputElement;
    // digits only, strip any leading country code the user may have pasted
    let digits = el.value.replace(/\D/g, '');
    if (digits.startsWith('966')) digits = digits.slice(3);
    if (digits.startsWith('0')) digits = digits.slice(1);
    if (digits.length > 9) digits = digits.slice(0, 9);
    el.value = digits;
    this.displayValue.set(digits);
    this.onChange(digits);
  }

  onBlur(): void {
    this.touched.set(true);
    this.onTouched();
  }

  // ── Error helpers ─────────────────────────────────────────────────────────

  get showError(): boolean {
    return this.touched() && !SAUDI_PHONE.test(this.displayValue());
  }

  get errorText(): string {
    return this.lang() === 'ar'
      ? (this.displayValue() ? 'رقم الهاتف غير صحيح' : 'مطلوب')
      : (this.displayValue() ? 'Invalid phone number' : 'Required');
  }

  // ── Private ───────────────────────────────────────────────────────────────

  private toDisplay(value: string): string {
    if (!value) return '';
    if (value.startsWith('+966')) return value.slice(4);
    if (value.startsWith('966')) return value.slice(3);
    if (value.startsWith('0')) return value.slice(1);
    return value;
  }
}
