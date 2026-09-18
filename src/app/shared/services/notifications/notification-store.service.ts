import { Injectable, computed, inject, signal } from '@angular/core';
import { NotificationService } from './notification.service';
import { NotificationDto } from './notification.types';
import { TokenService } from '../token.service';

const PAGE_SIZE = 20;

@Injectable({ providedIn: 'root' })
export class NotificationStoreService {
  private readonly api = inject(NotificationService);
  private readonly token = inject(TokenService);

  readonly items = signal<NotificationDto[]>([]);
  readonly unreadCount = signal(0);
  readonly loading = signal(false);
  readonly loadingMore = signal(false);
  readonly hasMore = signal(true);

  private page = 0;

  readonly hasUnread = computed(() => this.unreadCount() > 0);

  constructor() {
    if (this.token.isAuthenticated()) this.refreshUnreadCount();
  }

  ensureLoaded(): void {
    if (this.items().length === 0 && !this.loading()) this.refresh();
  }

  refresh(): void {
    this.loading.set(true);
    this.page = 0;
    this.api.list(0, PAGE_SIZE).subscribe({
      next: ({ items, meta }) => {
        this.items.set(items);
        this.hasMore.set(!meta?.last);
        this.loading.set(false);
      },
      error: () => {
        this.items.set([]);
        this.hasMore.set(false);
        this.loading.set(false);
      },
    });
  }

  loadMore(): void {
    if (this.loadingMore() || this.loading() || !this.hasMore()) return;
    this.loadingMore.set(true);
    const next = this.page + 1;
    this.api.list(next, PAGE_SIZE).subscribe({
      next: ({ items, meta }) => {
        this.page = next;
        this.items.update(list => [...list, ...items]);
        this.hasMore.set(!meta?.last);
        this.loadingMore.set(false);
      },
      error: () => this.loadingMore.set(false),
    });
  }

  markRead(id: number): void {
    const target = this.items().find(n => n.id === id);
    if (!target || target.read) return;
    this.items.update(list =>
      list.map(n => (n.id === id ? { ...n, read: true, readAt: new Date().toISOString() } : n))
    );
    this.unreadCount.update(c => Math.max(0, c - 1));
    this.api.markRead(id).subscribe({ error: () => this.refreshUnreadCount() });
  }

  markAllRead(): void {
    if (this.unreadCount() === 0) return;
    this.items.update(list => list.map(n => (n.read ? n : { ...n, read: true, readAt: new Date().toISOString() })));
    this.unreadCount.set(0);
    this.api.markAllRead().subscribe({ error: () => this.refreshUnreadCount() });
  }

  refreshUnreadCount(): void {
    this.api.unreadCount().subscribe({
      next: count => this.unreadCount.set(count),
    });
  }
}
