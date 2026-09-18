export type Gender = 'MALE' | 'FEMALE';

export interface NationalAddressDto {
  id: number;
  city: string;
  region: string;
  district: string;
  streetName: string;
  buildingNo: string;
  postalCode: string;
}

export type AccountStatus = 'PENDING_DOCUMENTS' | 'UNDER_REVIEW' | 'ACTIVE' | 'REJECTED';

export interface CompanyDataDto {
  id: number;
  name: string;
  organizationId: string;
  accountStatus: AccountStatus;
}

export interface UserDataDto {
  id: number;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: string;
  active: boolean;
  confirmed: boolean;
  company: CompanyDataDto | null;
  profileImageUrl: string | null;
}

export type BackendRole =
  | 'ADMIN'
  | 'CLIENT_INDIVIDUAL'
  | 'CLIENT_COMPANY_MANAGER'
  | 'PROVIDER_COMPANY_MANAGER'
  | 'PROVIDER_COMPANY_EMPLOYEE'
  | 'EMERGENCY_TEAM_MEMBER'
  | 'SELLER'
  | 'CUSTOMER_SUPPORT';

export interface CurrentPlanDto {
  packageId: number;
  packageNameAr: string;
  packageNameEn: string;
  status: string;
  usedRequests: number;
  maxRequests: number;
  endDate: string;
  isFree: boolean;
}

export interface UserProfileDto {
  id: number;
  firstName: string;
  lastName: string;
  phone: string | null;
  email: string | null;
  role: BackendRole;
  gender: Gender | null;
  dateOfBirth: string | null;
  jobTitle?: string | null;
  nationalId?: string | null;
  active: boolean;
  confirmed: boolean;
  company: CompanyDataDto | null;
  currentPlan: CurrentPlanDto | null;
  profileImageUrl: string | null;
  address: NationalAddressDto | null;
}

export interface UpdateUserRequestDto {
  firstName: string;
  lastName: string;
  email: string;
  gender: Gender | null;
  dateOfBirth: string | null;
  jobTitle?: string | null;
  nationalId?: string | null;
}

export interface CompanyInfoDto {
  companyId: number;
  name: string;
  organizationId: string;
  companyType: string;
  accountStatus: AccountStatus;
  rejectionReason: string | null;
  logoUrl: string | null;
  createdAt: string;
}

export interface SubscriptionDto {
  packageId: number;
  packageNameAr: string;
  packageNameEn: string;
  status: string;
  usedRequests: number;
  maxRequests: number;
  endDate: string;
  isFree: boolean;
}

export interface Permission {
  name: string;
  description: string;
  type: 'ADD' | 'REMOVE';
}

export interface PrivacyDto {
  role: BackendRole;
  active: boolean;
  confirmed: boolean;
  jobTitle: string | null;
  createdAt: string;
  permissions: Permission[];
}

export interface StoreInfoDto {
  storeName: string;
  commercialRegistrationNumber: string;
  imageUrl?: string | null;
}

export interface EmergencyMemberDto {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  phone: string;
  locationName: string;
  lat: number;
  lon: number;
  city: string;
  district: string;
  street: string;
  buildingNo: string;
  pricePerKm: number;
  available: boolean;
  serviceIds: number[];
  updatedAt: string;
}
