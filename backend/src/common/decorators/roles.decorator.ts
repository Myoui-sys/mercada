import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../modules/users/entities/user.entity';

export const ROLES_KEY = 'roles';

/**
 * Marca uma rota como restrita a determinados papéis (ex: apenas admin).
 * Precisa ser combinado com o RolesGuard para de fato bloquear o acesso.
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
