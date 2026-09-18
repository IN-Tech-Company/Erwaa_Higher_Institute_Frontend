import { ChangeDetectionStrategy, Component, ElementRef, effect, inject, viewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageStoreService } from '../../../../shared/services/language-store.service';
import { NotificationStoreService } from '../../../../shared/services/notifications/notification-store.service';
import { NotificationDto, NotificationType } from '../../../../shared/services/notifications/notification.types';

@Component({
  selector: 'app-notifications-dropdown',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './notifications-dropdown.html',
  styleUrl: './notifications-dropdown.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsDropdownComponent {
  readonly store = inject(NotificationStoreService);
  private readonly langStore = inject(LanguageStoreService);

  readonly lang = this.langStore.currentLanguage;

  private readonly sentinel = viewChild<ElementRef<HTMLElement>>('sentinel');

  constructor() {
    effect(onCleanup => {
      const el = this.sentinel()?.nativeElement;
      if (!el) return;
      const observer = new IntersectionObserver(
        entries => {
          if (entries.some(e => e.isIntersecting)) this.store.loadMore();
        },
        { rootMargin: '120px' }
      );
      observer.observe(el);
      onCleanup(() => observer.disconnect());
    });
  }

  iconFor(n: NotificationDto): string {
    return iconForType(n.type);
  }

  timeFor(n: NotificationDto): string {
    return formatTimeAgo(n.createdAt, this.lang());
  }

  onItemClick(n: NotificationDto): void {
    if (!n.read) this.store.markRead(n.id);
  }

  onMarkAllRead(): void { this.store.markAllRead(); }
}

function iconForType(type: NotificationType): string {
  switch (type) {
    case 'ORDER_STATUS_UPDATED': return 'bx bx-package';
    default: return 'bx bx-bell';
  }
}

function formatTimeAgo(iso: string, lang: 'ar' | 'en'): string {
  const sec = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);

  if (lang === 'ar') {
    if (sec < 60) return 'الآن';
    if (min < 60) return `منذ ${min} د`;
    if (hr < 24) return `منذ ${hr} س`;
    if (day < 30) return `منذ ${day} ي`;
    return new Date(iso).toLocaleDateString('ar-SA');
  }
  if (sec < 60) return 'just now';
  if (min < 60) return `${min}m ago`;
  if (hr < 24) return `${hr}h ago`;
  if (day < 30) return `${day}d ago`;
  return new Date(iso).toLocaleDateString('en-US');
}
