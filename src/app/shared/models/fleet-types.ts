export interface FleetMember {
  teamMemberId: number;
  name: string;
  phone: string;
  providerCompanyId: number;
  providerCompanyName: string;
  available: boolean;
  lat: number | null;
  lon: number | null;
  positionUpdatedAt: string;
  activeRequestId: number | null;
  activeRequestStatus: string | null;
}
