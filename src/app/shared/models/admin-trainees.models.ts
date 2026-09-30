// Admin trainee management — see docs/12-administration.md.

export interface Trainee {
  id: number;
  userId: number;
  name: string;
  email: string;
  phone: string; // 5XXXXXXXX
  nationalId: string | null;
  studyLevelId: number | null;
  studyLevel: string | null;
  emailVerified: boolean;
  enabled: boolean;
  createdAt: string;
}

export interface TraineeFilters {
  search: string;
  enabled: boolean | null; // null = all
  page: number;
}

export interface CreateTraineeRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export type UpdateTraineeRequest = Omit<CreateTraineeRequest, 'password'>;

export interface SetTraineePasswordRequest {
  newPassword: string;
  confirmPassword: string;
}
