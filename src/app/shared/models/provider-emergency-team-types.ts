export interface ProviderTeamPoint {
  id: number;
  userId?: number;
  firstName: string;
  lastName: string;
  phone: string;
  locationName: string;
  city?: string;
  district?: string;
  street?: string;
  buildingNo?: string;
  lat?: number;
  lon?: number;
  pricePerKm: number;
  available: boolean;
  serviceIds: number[];
  updatedAt?: string;
}

export type ApiProviderTeamPoint = ProviderTeamPoint;

export interface ProviderService {
  id: number;
  nameAr: string;
  nameEn: string;
  enrolled: boolean;
}

export interface MemberService {
  id: number;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  icon: string;
  active: boolean;
  createdAt: string;
}

export interface ProviderTeamFormValue {
  firstName: string;
  lastName: string;
  phone: string;
  password?: string;
  locationName: string;
  lat?: number;
  lon?: number;
  city?: string;
  district?: string;
  street?: string;
  buildingNo?: string;
  pricePerKm: number;
  available: boolean;
  serviceIds: number[];
}
