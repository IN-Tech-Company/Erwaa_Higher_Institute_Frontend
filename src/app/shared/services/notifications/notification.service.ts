import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { NotificationDto, NotificationsPage, PaginationMeta, UnreadCountDto } from './notification.types';
import { FcmTokenRegisterDto, FcmTokenResponseDto } from './fcm.types';

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
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/notifications`;

  list(page = 0, size = 20, unreadOnly = false): Observable<NotificationsPage> {
    return this.http
      .get<PageableApiResponseShape<NotificationDto>>(this.base, {
        params: { page, size, unreadOnly, sort: 'createdAt,desc' },
      })
      .pipe(map(r => ({ items: r.data ?? [], meta: r.pagination })));
  }

  unreadCount(): Observable<number> {
    return this.http
      .get<ApiResponseShape<UnreadCountDto>>(`${this.base}/unread-count`)
      .pipe(map(r => r.data?.count ?? 0));
  }

  markRead(id: number): Observable<void> {
    return this.http.patch<void>(`${this.base}/${id}/read`, {});
  }

  markAllRead(): Observable<void> {
    return this.http.patch<void>(`${this.base}/read-all`, {});
  }

  registerDevice(dto: FcmTokenRegisterDto): Observable<FcmTokenResponseDto> {
    return this.http
      .post<ApiResponseShape<FcmTokenResponseDto>>(`${this.base}/devices`, dto)
      .pipe(map(r => r.data));
  }

  deregisterDevice(token: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/devices`, { params: { token } });
  }
}
