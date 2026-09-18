import { UserRole } from '../models/user-role.enum';

/**
 * Landing route for a role, relative to `/:lang/app/`.
 * Every value here must be a route the same role is actually allowed to
 * enter — otherwise a guard redirecting to it loops back to itself forever.
 *
 * All 3 roles land on the shared dashboard home for now — there are no
 * role-specific pages built yet (see docs/project-brief.md).
 */
export function defaultRouteForRole(role: UserRole | null): string {
  switch (role) {
    case UserRole.Admin:
    case UserRole.Teacher:
    case UserRole.Trainee:
    default:
      return '';
  }
}
