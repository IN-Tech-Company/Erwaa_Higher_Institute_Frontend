import { ServiceType, PriceType, LocationType, GenderRestriction } from './provider-services.types';

export interface PublicServiceSummary {
  id: number;
  nameAr: string;
  nameEn: string;
  categoryId: number;
  categoryNameAr: string;
  categoryNameEn: string;
  providerCompanyId: number;
  providerCompanyName: string;
  serviceType: ServiceType;
  price: number;
  priceType: PriceType;
  durationMinutes: number;
  locationType: LocationType;
  genderRestriction?: GenderRestriction;
  averageRating?: number;
  reviewCount?: number;
  images?: string[];
  displayOrder: number;
  createdAt: string;
}

export interface PublicServiceDetail extends PublicServiceSummary {
  descriptionAr: string | null;
  descriptionEn: string | null;
  providerTypeLabel: string | null;
  notesAr: string | null;
  notesEn: string | null;
  minAdvanceHours: number;
  maxAdvanceDays: number;
  cancellationWindowHours: number;
  bufferMinutesBetweenBookings: number;
}

export interface PublicServicesPage {
  content: PublicServiceSummary[];
  totalElements: number;
  totalPages: number;
  last: boolean;
  number: number;
}

// ── Reviews ───────────────────────────────────────────────────────────────────

export interface ServiceReview {
  id: number;
  rating: number;
  comment: string | null;
  clientName: string;
  executorName: string | null;
  createdAt: string;
}

export interface ServiceReviewPage {
  content: ServiceReview[];
  totalElements: number;
  totalPages: number;
  last: boolean;
  number: number;
}

// ── Booking ───────────────────────────────────────────────────────────────────

export interface BookingExecutorInfo {
  id: number;
  firstName: string;
  lastName: string;
  gender: string | null;
  profileImageUrl: string | null;
  specialization: string | null;
  bio: string | null;
  averageRating: number;
  reviewCount: number;
  isAvailable: boolean;
}

export type BookingStatus =
  | 'PENDING_PROVIDER'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED_BY_CLIENT'
  | 'CANCELLED_BY_PROVIDER';

export interface BookingSlot {
  date: string;
  time: string;
}

export interface CreateBookingRequest {
  serviceId: number;
  clientType: 'INDIVIDUAL' | 'COMPANY';
  clientName: string;
  clientPhone: string;
  clientNationalId?: string;
  clientNotes?: string;
  scheduledDate: string;
  scheduledTime: string;
  locationType: 'HOME' | 'CENTER';
  city?: string;
  district?: string;
  street?: string;
  buildingNo?: string;
  unitNo?: string;
  paymentMethod: 'CASH' | 'ONLINE';
}

export interface BookingSummaryExecutor {
  id: number;
  fullName: string;
}

export interface BookingSummary {
  id: number;
  serviceId: number;
  serviceNameAr: string;
  serviceNameEn: string;
  clientName: string;
  clientPhone: string;
  scheduledDate: string;
  scheduledTime: string;
  status: BookingStatus;
  clientType: string;
  quotedPrice: number;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  executor?: BookingSummaryExecutor | null;
}

export interface BookingDetail {
  id: number;
  serviceId: number;
  serviceNameAr: string;
  serviceNameEn: string;
  providerCompanyName: string;
  executor: BookingExecutorInfo | null;
  clientType: 'INDIVIDUAL' | 'COMPANY';
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
  status: BookingStatus;
  quotedPrice: number;
  finalPrice: number | null;
  paymentMethod: 'CASH' | 'ONLINE';
  paymentStatus: string;
  cancelledReason: string | null;
  confirmedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ClientBookingsPage {
  content: BookingSummary[];
  totalElements: number;
  totalPages: number;
  last: boolean;
  number: number;
}

export type TimelineActorType = 'CLIENT' | 'PROVIDER_MANAGER' | 'EXECUTOR' | 'SYSTEM';

export interface BookingTimelineEvent {
  status:    BookingStatus;
  actorType: TimelineActorType;
  actorName: string | null;
  note:      string | null;
  occurredAt: string;
}

export interface VerifyCompletionRequest {
  bookingId: number;
  clientPhone: string;
  otp: string;
}
