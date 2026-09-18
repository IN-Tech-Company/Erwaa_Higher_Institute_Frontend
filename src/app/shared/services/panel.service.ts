import { computed, inject, Injectable, signal, Type } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export interface PanelConfig {
  titleAr: string;
  titleEn: string;
  component: Type<unknown>;
  inputs?: Record<string, unknown>;
}

@Injectable({ providedIn: 'root' })
export class PanelService {
  private readonly doc = inject(DOCUMENT);
  private closeTimer: ReturnType<typeof setTimeout> | null = null;

  private readonly _config = signal<PanelConfig | null>(null);
  private readonly _open = signal(false);
  private readonly _locked = signal(false);

  readonly config = this._config.asReadonly();
  readonly isOpen = this._open.asReadonly();
  readonly isLocked = this._locked.asReadonly();
  readonly hasConfig = computed(() => this._config() !== null);

  open(cfg: PanelConfig): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
    this._config.set(cfg);
    this._locked.set(false);
    this.doc.body.style.overflow = 'hidden';
    // Defer so the @if renders the component before the open class triggers the animation
    setTimeout(() => this._open.set(true), 16);
  }

  lock(): void { this._locked.set(true); }
  unlock(): void { this._locked.set(false); }

  close(): void {
    if (this._locked()) return;
    this._open.set(false);
    this.doc.body.style.overflow = '';
    this.closeTimer = setTimeout(() => {
      this._config.set(null);
      this.closeTimer = null;
    }, 320);
  }
}
