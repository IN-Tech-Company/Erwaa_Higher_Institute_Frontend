export type RequestStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'ON_THE_WAY'
  | 'ARRIVED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface ProviderEmergencyRequest {
  id: number;
  clientName: string;
  serviceNameAr: string;
  serviceNameEn: string;
  teamPointName: string;
  status: RequestStatus;
  totalPrice?: number;
  createdAt: string;
}

export const STATUS_NEXT: Partial<Record<RequestStatus, RequestStatus>> = {
  ACCEPTED: 'ON_THE_WAY',
  ON_THE_WAY: 'ARRIVED',
  ARRIVED: 'COMPLETED',
};
