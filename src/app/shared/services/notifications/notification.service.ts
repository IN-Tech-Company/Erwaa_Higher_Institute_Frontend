import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { RequestService, RequestOptions } from '../request.service';
import { NotificationDto, NotificationsPage, PaginationMeta, UnreadCountDto } from './notification.types';
import { FcmTokenRegisterDto, FcmTokenResponseDto } from './fcm.types';

type Opts = Pick<RequestOptions, 'showLoader'>;

interface PageableApiResponseShape<T> {
  status: number;
  success: boolean;
  message: string;
  data: T[];
  pagination: PaginationMeta;
}

interface ApiResponseShape<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly request = inject(RequestService);
  private readonly base = '/notifications';

  list(page = 0, size = 20, unreadOnly = false, opts: Opts = { showLoader: false }): Observable<NotificationsPage> {
    return this.request
      .get<PageableApiResponseShape<NotificationDto>>(this.base, {
        ...opts,
        params: { page, size, unreadOnly, sort: 'createdAt,desc' },
      })
      .pipe(map(r => ({ items: r.data ?? [], meta: r.pagination })));
  }

  unreadCount(opts: Opts = { showLoader: false }): Observable<number> {
    return this.request
      .get<ApiResponseShape<UnreadCountDto>>(`${this.base}/unread-count`, opts)
      .pipe(map(r => r.data?.count ?? 0));
  }

  markRead(id: number, opts: Opts = { showLoader: false }): Observable<void> {
    return this.request.patch<void>(`${this.base}/${id}/read`, {}, opts);
  }

  markAllRead(opts: Opts = { showLoader: false }): Observable<void> {
    return this.request.patch<void>(`${this.base}/read-all`, {}, opts);
  }

  registerDevice(dto: FcmTokenRegisterDto, opts: Opts = { showLoader: false }): Observable<FcmTokenResponseDto> {
    return this.request
      .post<ApiResponseShape<FcmTokenResponseDto>>(`${this.base}/devices`, dto, opts)
      .pipe(map(r => r.data));
  }

  deregisterDevice(token: string, opts: Opts = { showLoader: false }): Observable<void> {
    return this.request.delete<void>(`${this.base}/devices`, {
      ...opts,
      params: { token },
    });
  }
}
