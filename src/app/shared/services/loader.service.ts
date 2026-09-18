import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  readonly isLoading = signal(false);

  private _count = 0;

  show(): void {
    this._count++;
    this.isLoading.set(true);
  }

  hide(): void {
    this._count = Math.max(0, this._count - 1);
    if (this._count === 0) {
      setTimeout(() => this.isLoading.set(false), 200);
    }
  }

}