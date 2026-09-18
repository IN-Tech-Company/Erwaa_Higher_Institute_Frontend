export interface PendingCompany {
  companyId: number;
  companyName: string;
  pendingCount: number;
}

export type ServiceStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
export type ReviewAction = 'APPROVE' | 'REJECT';

export interface ServiceSummary {
  id: number;
  nameAr: string;
  nameEn?: string | null;
  type?: string | null;
  price?: number | null;
  status: ServiceStatus;
  categoryNameAr?: string | null;
  createdAt: string;
}

export interface ServicesPage {
  content: ServiceSummary[];
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ServiceDetail {
  id: number;
  nameAr: string;
  nameEn?: string | null;
  descriptionAr?: string | null;
  descriptionEn?: string | null;
  notesAr?: string | null;
  notesEn?: string | null;
  type?: string | null;
  serviceType?: string | null;
  locationType?: string | null;
  priceType?: string | null;
  price?: number | null;
  durationMinutes?: number | null;
  genderRestriction?: string | null;
  providerTypeLabel?: string | null;
  active?: boolean;
  status: ServiceStatus;
  categoryId?: number | null;
  categoryNameAr?: string | null;
  categoryNameEn?: string | null;
  companyName?: string | null;
  companyId: number;
  providerCompanyName?: string | null;
  providerCompanyId?: number | null;
  bufferMinutesBetweenBookings?: number | null;
  cancellationWindowHours?: number | null;
  minAdvanceHours?: number | null;
  maxAdvanceDays?: number | null;
  averageRating?: number | null;
  reviewCount?: number | null;
  reviewNotes?: string | null;
  reviewedAt?: string | null;
  reviewedById?: number | null;
  reviewedByName?: string | null;
  images?: string[];
  displayOrder?: number | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface ReviewRequest {
  action: ReviewAction;
  reviewNotes?: string;
}
