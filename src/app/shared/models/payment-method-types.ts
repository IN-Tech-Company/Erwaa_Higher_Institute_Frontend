export interface PaymentMethod {
  id: number;
  nameAr: string;
  nameEn: string;
  imageUrl: string | null;
  active: boolean;
  createdAt: string;
}

export interface PaymentMethodFormValue {
  nameAr: string;
  nameEn: string;
  image: File | null;
}

export interface PaymentMethodSavePayload {
  editing: PaymentMethod | null;
  value: PaymentMethodFormValue;
}
