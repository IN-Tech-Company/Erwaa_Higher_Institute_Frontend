export interface CompanyTeamMember {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  active: boolean;
  confirmed: boolean;
  profileImageUrl: string | null;
}

export interface Permission {
  id: number;
  roleName: string;
  name: string;
  description: string | null;
}
