import { ExecutorSummary } from './provider-bookings.types';
import { LocationType } from './provider-services.types';

export type AdminBookingStatus =
  | 'PENDING_PROVIDER'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REJECTED'
  | 'NO_SHOW';

export type AdminClientType = 'CLIENT_INDIVIDUAL' | 'CLIENT_COMPANY_MANAGER' | 'GUEST';
export type AdminPaymentMethod = 'CASH' | 'ONLINE';
export type AdminPaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED';

export interface AdminBookingSummary {
  id: number;
  serviceNameAr: string;
  serviceNameEn: string;
  clientName: string;
  clientPhone: string;
  scheduledDate: string;
  scheduledTime: string;
  status: AdminBookingStatus;
  clientType: AdminClientType;
  quotedPrice: number;
  paymentMethod: AdminPaymentMethod;
  paymentStatus: AdminPaymentStatus;
  createdAt: string;
}

export interface AdminBookingDetail {
  id: number;
  serviceId: number;
  serviceNameAr: string;
  serviceNameEn: string;
  providerCompanyName: string;
  executor: ExecutorSummary | null;
  clientType: AdminClientType;
  clientName: string;
  clientPhone: string;
  clientNationalId: string | null;
  clientNotes: string | null;
  scheduledDate: string;
  scheduledTime: string;
  locationType: LocationType;
  city: string | null;
  district: string | null;
  street: string | null;
  buildingNo: string | null;
  unitNo: string | null;
  status: AdminBookingStatus;
  quotedPrice: number;
  finalPrice: number | null;
  paymentMethod: AdminPaymentMethod;
  paymentStatus: AdminPaymentStatus;
  cancelledReason: string | null;
  confirmedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminBookingsPage {
  content: AdminBookingSummary[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
