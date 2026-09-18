import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DashboardSideBarControlStoreService {
  isOpen = signal(false);
  currentAction = signal<string | null>(null);

  openSidebar(action?: string) {
    if (action) {
      this.currentAction.set(action);
    }
    this.isOpen.set(true);
  }

  closeSidebar() {
    this.isOpen.set(false);
    this.currentAction.set(null);
  }

  getCurrentAction() {
    return this.currentAction();
  }
}
