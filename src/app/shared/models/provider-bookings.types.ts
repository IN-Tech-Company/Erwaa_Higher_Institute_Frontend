import { BookingStatus } from './public-services.types';
import { LocationType } from './provider-services.types';

export type BookingClientType = 'INDIVIDUAL' | 'COMPANY';
export type PaymentMethod    = 'CASH' | 'CARD' | 'ONLINE' | 'INSURANCE';
export type PaymentStatus    = 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED';

export interface ExecutorSummary {
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

export interface BookingDetail {
  id: number;
  serviceId: number;
  serviceNameAr: string;
  serviceNameEn: string;
  providerCompanyName: string;
  executor: ExecutorSummary | null;
  clientType: BookingClientType;
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
  paymentMethod: PaymentMethod | null;
  paymentStatus: PaymentStatus | null;
  cancelledReason: string | null;
  confirmedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ProviderTimelineActorType = 'CLIENT' | 'PROVIDER_MANAGER' | 'EXECUTOR' | 'SYSTEM';

export interface ProviderBookingTimelineEvent {
  status:     BookingStatus;
  actorType:  ProviderTimelineActorType;
  actorName:  string | null;
  note:       string | null;
  occurredAt: string;
}

export type ChatSenderType = 'CLIENT' | 'PROVIDER_MANAGER' | 'EXECUTOR' | 'SYSTEM';

export interface BookingChatMessage {
  id:         number;
  senderId:   number;
  senderType: ChatSenderType;
  senderName: string;
  channel:    'INTERNAL' | 'CLIENT_EXECUTOR';
  content:    string | null;
  imageUrl:   string | null;
  replyToId:  number | null;
  createdAt:  string;
}

export interface BookingLocation {
  bookingId:    number;
  executorName: string;
  lat:          number;
  lng:          number;
  updatedAt:    string;
}

export interface UpdateBookingRequest {
  scheduledDate?:    string;
  scheduledTime?:    string;
  executorId?:       number;
  locationType?:     LocationType;
  city?:             string;
  district?:         string;
  street?:           string;
  buildingNo?:       string;
  unitNo?:           string;
  clientName?:       string;
  clientPhone?:      string;
  clientNationalId?: string;
  clientNotes?:      string;
  finalPrice?:       number;
  paymentMethod?:    PaymentMethod;
}

export interface ServiceTeamMember {
  executorId: number;
  fullName: string;
  specialization: string | null;
  isAvailable: boolean;
  assignedAt: string;
}

export interface AvailableExecutor {
  executorId: number;
  fullName: string;
  specialization: string | null;
  available: boolean;
}

export interface ServiceTeamNote {
  id: number;
  authorId: number;
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMemberAvailability {
  executorId: number;
  firstName: string;
  lastName: string;
  available: boolean;
  todayBookingsCount: number;
  activeBookingId: number | null;
}

export interface ProviderBookingsPage {
  content: import('./public-services.types').BookingSummary[];
  totalElements: number;
  totalPages: number;
  last: boolean;
  number: number;
}

export type { BookingStatus };
