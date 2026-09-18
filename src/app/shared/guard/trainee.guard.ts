import { UserRole } from '../models/user-role.enum';
import { roleGuard } from './role.guard';

export const traineeGuard = roleGuard(UserRole.Trainee);
