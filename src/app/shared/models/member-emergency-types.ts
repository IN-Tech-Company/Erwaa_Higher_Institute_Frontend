export type MemberRequestStatus = 'ACCEPTED' | 'ON_THE_WAY' | 'ARRIVED' | 'COMPLETED' | 'CANCELLED';

export interface MemberEmergencyRequest {
  id: number;
  clientName: string;
  clientPhone: string;
  city: string;
  district: string;
  street: string;
  buildingNo: string;
  unitNo: string;
  lat: number;
  lon: number;
  estimatedPrice: number;
  status: MemberRequestStatus;
  serviceNameAr: string;
  serviceNameEn: string;
  providerName: string;
  providerPhone: string;
  createdAt: string;
}

export interface MemberTrackingDetails {
  id: number;
  clientName: string;
  clientPhone: string;
  lat: number;
  lon: number;
  city: string;
  district: string;
  street: string;
  buildingNo: string;
  unitNo: string;
  status: MemberRequestStatus;
  serviceNameAr: string;
  serviceNameEn: string;
  estimatedPrice: number;
  createdAt: string;
  myLat: number | null;
  myLon: number | null;
  myPositionUpdatedAt: string | null;
  distanceKm: number | null;
  etaMinutes: number | null;
}

// allowed forward transitions per status
export const MEMBER_STATUS_NEXT: Partial<Record<MemberRequestStatus, MemberRequestStatus>> = {
  ACCEPTED:   'ON_THE_WAY',
  ON_THE_WAY: 'ARRIVED',
  ARRIVED:    'COMPLETED',
};

// includes CANCELLED as an always-available second option
export const MEMBER_STATUS_TRANSITIONS: Partial<Record<MemberRequestStatus, MemberRequestStatus[]>> = {
  ACCEPTED:   ['ON_THE_WAY', 'CANCELLED'],
  ON_THE_WAY: ['ARRIVED',    'CANCELLED'],
  ARRIVED:    ['COMPLETED',  'CANCELLED'],
};
