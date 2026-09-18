import { Injectable, inject, signal } from '@angular/core';
import { initializeApp, FirebaseApp, getApps } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging, Unsubscribe } from 'firebase/messaging';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { NotificationService } from './notification.service';
import { NotificationStoreService } from './notification-store.service';
import { TokenService } from '../token.service';

@Injectable({ providedIn: 'root' })
export class FcmService {
  private readonly api = inject(NotificationService);
  private readonly store = inject(NotificationStoreService);
  private readonly tokenService = inject(TokenService);

  readonly permissionState = signal<NotificationPermission | 'unsupported'>(
    typeof Notification === 'undefined' ? 'unsupported' : Notification.permission,
  );
  readonly currentToken = signal<string | null>(null);

  private app: FirebaseApp | null = null;
  private messaging: Messaging | null = null;
  private initialized = false;
  private unsubscribeOnMessage: Unsubscribe | null = null;

  async init(): Promise<void> {
    console.log('[FCM] init() called');
    if (this.initialized) { console.log('[FCM] already initialized — skipping'); return; }
    if (!this.tokenService.isAuthenticated()) { console.log('[FCM] not authenticated — skipping'); return; }
    if (!this.isSupported()) { console.warn('[FCM] browser does not support notifications/service worker'); return; }

    console.log('[FCM] current permission:', Notification.permission);

    try {
      const permission = await Notification.requestPermission();
      console.log('[FCM] requestPermission result:', permission);
      this.permissionState.set(permission);
      if (permission !== 'granted') { console.warn('[FCM] permission not granted — stopping'); return; }

      this.app = getApps()[0] ?? initializeApp(environment.firebase);
      this.messaging = getMessaging(this.app);
      console.log('[FCM] firebase initialized');

      const swReg = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('[FCM] service worker registered:', swReg);

      const token = await getToken(this.messaging, {
        vapidKey: environment.firebase.vapidKey,
        serviceWorkerRegistration: swReg,
      });
      console.log('[FCM] token:', token);
      if (!token) { console.warn('[FCM] getToken returned empty'); return; }

      this.currentToken.set(token);
      await this.registerWithBackend(token);
      console.log('[FCM] backend registration complete');
      this.subscribeForeground();
      this.initialized = true;
      console.log('[FCM] init complete ✓');
    } catch (err) {
      console.error('[FCM] init failed', err);
    }
  }

  async deregisterCurrent(): Promise<void> {
    const token = this.currentToken();
    if (!token) return;
    try {
      await firstValueFrom(this.api.deregisterDevice(token));
    } catch (err) {
      console.warn('[FCM] deregister failed', err);
    } finally {
      this.currentToken.set(null);
      this.initialized = false;
      this.unsubscribeOnMessage?.();
      this.unsubscribeOnMessage = null;
    }
  }

  private isSupported(): boolean {
    return (
      typeof Notification !== 'undefined' &&
      typeof navigator !== 'undefined' &&
      'serviceWorker' in navigator
    );
  }

  private async registerWithBackend(token: string): Promise<void> {
    const deviceName = navigator.userAgent.slice(0, 128);
    await firstValueFrom(this.api.registerDevice({ token, platform: 'WEB', deviceName }));
  }

  private subscribeForeground(): void {
    if (!this.messaging) return;
    this.unsubscribeOnMessage = onMessage(this.messaging, (payload) => {
      console.log('[FCM] foreground message received', payload);
      const title = payload.notification?.title ?? 'Nabd Plus';
      const body = payload.notification?.body ?? '';
      const icon = payload.notification?.icon ?? '/assets/images/logo/icon.png';

      if (Notification.permission === 'granted') {
        new Notification(title, { body, icon });
      }
      this.store.refreshUnreadCount();
      this.store.refresh();
    });
  }
}
