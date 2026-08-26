import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Extrai o usuário autenticado (anexado pelo JwtAuthGuard) diretamente do
 * request, evitando repetir `req.user` em cada controller.
 *
 * Uso: `@CurrentUser() user: AuthenticatedUser`
 */
export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: string;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
