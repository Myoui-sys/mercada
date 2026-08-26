import type { ApiError } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export class ApiRequestError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'ApiRequestError';
    this.statusCode = statusCode;
  }
}

interface RequestOptions extends RequestInit {
  token?: string | null;
}

/**
 * Wrapper fino sobre fetch para falar com a API NestJS.
 *
 * Centraliza três coisas que, senão, se repetiriam em toda chamada:
 * montar a URL a partir de NEXT_PUBLIC_API_URL, anexar o Bearer token
 * quando presente, e traduzir o formato de erro padronizado da API
 * (ver HttpExceptionFilter no backend) em uma exceção tipada.
 */
async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options;

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    cache: 'no-store',
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const errorBody = body as ApiError | null;
    const message = Array.isArray(errorBody?.message)
      ? errorBody!.message.join(' ')
      : errorBody?.message ?? 'Ocorreu um erro inesperado. Tente novamente.';

    throw new ApiRequestError(message, response.status);
  }

  return body as T;
}

export const api = {
  get: <T>(path: string, token?: string | null) =>
    apiFetch<T>(path, { method: 'GET', token }),

  post: <T>(path: string, data?: unknown, token?: string | null) =>
    apiFetch<T>(path, {
      method: 'POST',
      body: data !== undefined ? JSON.stringify(data) : undefined,
      token,
    }),

  patch: <T>(path: string, data?: unknown, token?: string | null) =>
    apiFetch<T>(path, {
      method: 'PATCH',
      body: data !== undefined ? JSON.stringify(data) : undefined,
      token,
    }),

  delete: <T>(path: string, token?: string | null) =>
    apiFetch<T>(path, { method: 'DELETE', token }),
};
