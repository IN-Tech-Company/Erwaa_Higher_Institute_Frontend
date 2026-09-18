export type CategoryTargetType = 'INDIVIDUAL' | 'COMPANY' | 'BOTH';

export interface CategoryResponse {
  id: number;
  nameAr: string;
  nameEn: string;
  iconUrl: string | null;
  targetType: CategoryTargetType;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
