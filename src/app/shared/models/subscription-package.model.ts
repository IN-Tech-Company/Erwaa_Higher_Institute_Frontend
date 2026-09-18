export type BillingCycle = 'MONTHLY' | 'QUARTERLY' | 'YEARLY';

export interface PackageCategoryRef {
  id: number;
  nameAr: string;
  nameEn: string;
}

export interface PackageResponse {
  id: number;
  nameAr: string;
  nameEn: string;
  descriptionAr: string | null;
  maxRequests: number;
  allowedCategories: PackageCategoryRef[];
  billingCycle: BillingCycle;
  price: number;
  originalPrice: number | null;
  discountPercentage: number | null;
  sloganAr: string | null;
  sloganEn: string | null;
  badgeLabelAr: string | null;
  badgeLabelEn: string | null;
  isFeatured: boolean;
  isFree: boolean;
  isActive: boolean;
  isCurrentPlan: boolean;
  activeSubscriptionsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PackageRequestPayload {
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  maxRequests: number;
  allowedCategoryIds: number[];
  billingCycle: BillingCycle;
  price: number;
  originalPrice?: number;
  sloganAr?: string;
  sloganEn?: string;
  badgeLabelAr?: string;
  badgeLabelEn?: string;
  isFeatured?: boolean;
  isFree?: boolean;
}
