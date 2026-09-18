export type AdminRequestStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'ON_THE_WAY'
  | 'ARRIVED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface AdminEmergencyRequest {
  id: number;
  serviceName: string;
  teamMemberName: string;
  clientName: string;
  clientPhone: string;
  clientNationalId: string;
  city: string;
  district: string;
  street: string | null;
  lat: number;
  lon: number;
  status: AdminRequestStatus;
  estimatedPrice: number;
  finalPrice: number | null;
  createdAt: string;
}
