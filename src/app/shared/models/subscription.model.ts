import { BillingCycle, PackageCategoryRef } from './subscription-package.model';

export type SubscriptionStatus = 'PENDING_PAYMENT' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED';

export type SubscriptionAuditAction =
  | 'CREATED'
  | 'EXTENDED'
  | 'QUOTA_MODIFIED'
  | 'CANCELLED'
  | 'AUTO_RENEW_CHANGED'
  | 'UPGRADED';

export interface SubscriptionDetailResponse {
  id: number;
  companyId: number;
  companyName: string;
  companyOrganizationId: string;
  packageId: number;
  packageName: string;
  pricePaid: number;
  allowedCategories: PackageCategoryRef[];
  billingCycle: BillingCycle;
  status: SubscriptionStatus;
  usedRequests: number;
  maxRequests: number;
  quotaPercentage: number;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  autoRenew: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionListItemResponse {
  id: number;
  companyName: string;
  companyOrganizationId: string;
  packageId: number;
  packageName: string;
  pricePaid: number;
  billingCycle: BillingCycle;
  status: SubscriptionStatus;
  usedRequests: number;
  maxRequests: number;
  quotaPercentage: number;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  autoRenew: boolean;
}

export interface SubscriptionStats {
  totalActive: number;
  totalRevenue: number;
}

export interface AuditLogResponse {
  id: number;
  action: SubscriptionAuditAction;
  reason: string | null;
  performedById: number;
  performedByName: string;
  createdAt: string;
}

export interface SubscribeRequest {
  packageId: number;
}

export interface UpgradeRequest {
  newPackageId: number;
}

export interface CancelRequest {
  reason?: string;
}

export interface ExtendRequest {
  daysToAdd: number;
  reason: string;
}

export interface QuotaRequest {
  newMaxRequests: number;
  reason: string;
}

export interface AdminCreateSubscriptionRequest {
  companyId: number;
  packageId: number;
  pricePaid?: number | null;
  maxRequests?: number | null;
  durationDays?: number | null;
  autoRenew?: boolean;
  reason: string;
}

export interface AdminSubscriptionFilters {
  status?: SubscriptionStatus;
  packageId?: number;
  companyId?: number;
  from?: string;
  to?: string;
  page?: number;
  size?: number;
}
