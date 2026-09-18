export interface AdminEmergencyService {
  id: string;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  imageUrl: string | null;
  active: boolean;
}

export interface ApiAdminEmergencyService extends Omit<AdminEmergencyService, 'id'> {
  id: number;
  createdAt: string;
}

export interface ServiceFormValue {
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  active: boolean;
  /** New image file to upload; omit/null to keep the current image unchanged. */
  imageFile: File | null;
}

export interface ServiceSavePayload {
  editing: AdminEmergencyService | null;
  value: ServiceFormValue;
}
