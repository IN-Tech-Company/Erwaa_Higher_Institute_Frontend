import { Directive, HostListener, Injector, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'input[formControlName], textarea[formControlName]',
  standalone: true
})
export class TrimInputDirective {
  private injector = inject(Injector);

  @HostListener('blur', ['$event.target'])
  onBlur(target: EventTarget | null) {
    if (!target || !(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
    
    const value = target.value;
    const ngControl = this.injector.get(NgControl, null);
    
    if (ngControl && ngControl.control) {
      ngControl.control.setValue(value.trim());
    }
  }
}
