export type ServiceStatus      = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
export type ServiceType        = 'EMERGENCY' | 'INDIVIDUAL' | 'COMPANY';
export type PriceType          = 'FIXED' | 'STARTING_FROM';
export type LocationType       = 'HOME' | 'CENTER' | 'BOTH';
export type GenderRestriction  = 'ANY' | 'MALE' | 'FEMALE';

export interface ServiceImageResponse {
  id: number;
  imageUrl: string;
  createdAt: string;
}

export interface ProviderServiceSummary {
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
  genderRestriction: GenderRestriction;
  averageRating: number;
  reviewCount: number;
  images: string[];
  displayOrder: number;
  status: ServiceStatus;
  active: boolean;
  reviewNotes: string | null;
  createdAt: string;
}

export interface ProviderServicesPage {
  content: ProviderServiceSummary[];
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ProviderServiceDetail extends Omit<ProviderServiceSummary, 'images'> {
  images: ServiceImageResponse[];
  descriptionAr: string | null;
  descriptionEn: string | null;
  providerTypeLabel: string | null;
  notesAr: string | null;
  notesEn: string | null;
  teamSize: number | null;
  minAdvanceHours: number;
  maxAdvanceDays: number;
  cancellationWindowHours: number;
  bufferMinutesBetweenBookings: number;
  reviewedById: number | null;
  reviewedByName: string | null;
  reviewedAt: string | null;
  updatedAt: string | null;
}

export type DayOfWeek = 'SUNDAY' | 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY';

export interface AvailabilityResponse {
  id: number;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface AvailabilityUpdateDto {
  availability: {
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    isActive: boolean;
  }[];
}

export interface ServiceCreateDto {
  nameAr: string;
  nameEn: string;
  categoryId: number;
  serviceType: ServiceType;
  price: number;
  priceType: PriceType;
  durationMinutes: number;
  locationType: LocationType;
  genderRestriction: GenderRestriction;
  descriptionAr?: string;
  descriptionEn?: string;
  providerTypeLabel?: string;
  notesAr?: string;
  notesEn?: string;
  images?: string[];
  minAdvanceHours: number;
  maxAdvanceDays: number;
  cancellationWindowHours: number;
  bufferMinutesBetweenBookings: number;
  displayOrder?: number;
}
