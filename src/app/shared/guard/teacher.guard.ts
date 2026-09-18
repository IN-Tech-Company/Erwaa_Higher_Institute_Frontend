import { UserRole } from '../models/user-role.enum';
import { roleGuard } from './role.guard';

export const teacherGuard = roleGuard(UserRole.Teacher);
