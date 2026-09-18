
export type ContactStatus = 'PENDING' | 'CONTACTED';
export type SenderType = 'INDIVIDUAL' | 'PROVIDER' | 'SELLER' | 'OTHER';

export interface ContactDto {
  id: number;
  name: string;
  phone: string;
  message: string;
  senderType: SenderType;
  status: ContactStatus;
  contactNote: string | null;
  createdAt: string;
}

export interface UpdateContactStatusPayload {
  status: ContactStatus;
  contactNote?: string;
}
