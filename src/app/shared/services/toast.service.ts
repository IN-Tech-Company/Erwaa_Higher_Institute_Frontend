import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast{
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  isRtl?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
    private toastsSubject = new BehaviorSubject<Toast[]>([]);
    public toasts$ = this.toastsSubject.asObservable();

    show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success', duration: number = 4000) {
      const id = Date.now();
      const isRtl = this.isArabic(message);
      const toast: Toast = { id, message, type, isRtl };

      const currentToasts = this.toastsSubject.value;
      this.toastsSubject.next([...currentToasts, toast]);

      setTimeout(() => this.remove(id), duration);
    }

  success(message: string, duration?: number) {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number) {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration?: number) {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration?: number) {
    this.show(message, 'info', duration);
  }

  remove(id: number) {
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next(currentToasts.filter(toast => toast.id !== id));
  }

  private isArabic(text: string): boolean {
    const arabicPattern = /[\u0600-\u06FF]/;
    return arabicPattern.test(text);
  }
}