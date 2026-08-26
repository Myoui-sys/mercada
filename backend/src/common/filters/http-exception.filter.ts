import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Filtro global de exceções.
 *
 * Padroniza o formato de erro da API para que qualquer cliente (frontend,
 * Postman, testes automatizados) saiba exatamente o que esperar quando algo
 * dá errado — isso importa bastante para quem for testar a API depois.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = isHttpException
      ? exception.getResponse()
      : 'Erro interno do servidor';

    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as { message?: string | string[] }).message ??
          'Erro inesperado';

    if (!isHttpException) {
      this.logger.error(exception);
    }

    response.status(status).json({
      statusCode: status,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
      message,
    });
  }
}
