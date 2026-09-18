// The 3 real account types for the institute (see AUTH.REGISTER split between
// trainee and teacher registration). Replaces the old 8-role model inherited
// from the previous healthcare-marketplace project (Nabd Plus) — see
// docs/project-brief.md for the rebuild notes.
export enum UserRole {
  Admin = 'ADMIN',
  Teacher = 'TEACHER',
  Trainee = 'TRAINEE',
}
