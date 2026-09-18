export type NotificationType = 'ORDER_STATUS_UPDATED' | string;

export interface NotificationDto {
  id: number;
  title: string;
  body: string;
  type: NotificationType;
  entityId: string | null;
  read: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface UnreadCountDto {
  count: number;
}

export interface PaginationMeta {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface NotificationsPage {
  items: NotificationDto[];
  meta: PaginationMeta;
}
