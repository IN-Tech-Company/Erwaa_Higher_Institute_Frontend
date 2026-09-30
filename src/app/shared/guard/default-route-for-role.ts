import { UserRole } from '../models/user-role.enum';

export function defaultRouteForRole(role: UserRole | null): string {
  switch (role) {
    case UserRole.Admin:
    case UserRole.Teacher:
    case UserRole.Trainee:
    default:
      return '';
  }
}
