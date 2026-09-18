
export type TreatmentAbroadStatus = 'PENDING' | 'CONTACTED';

export interface TreatmentAbroadRequestDto {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  specialty: string;
  diagnosis: string;
  destination: string;
  budget: string | null;
  consent: boolean;
  status: TreatmentAbroadStatus;
  adminNote: string | null;
  createdAt: string;
}

export interface UpdateTreatmentAbroadStatusPayload {
  status: TreatmentAbroadStatus;
  adminNote?: string;
}
