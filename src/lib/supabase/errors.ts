import type { AuthError, PostgrestError } from '@supabase/supabase-js';

/** Erro normalizado que o resto do app consome. Nunca vaze o erro cru do SDK para a UI. */
export type AppError = {
  /** Código estável para decisões de UI (ex.: 'auth/invalid-credentials'). */
  code: string;
  /** Mensagem já legível para o usuário. */
  message: string;
  cause?: unknown;
};

export class SupabaseNotConfiguredError extends Error {
  constructor() {
    super('Supabase não configurado. Defina as variáveis em .env.local.');
    this.name = 'SupabaseNotConfiguredError';
  }
}

function isPostgrestError(error: unknown): error is PostgrestError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'details' in error
  );
}

function isAuthError(error: unknown): error is AuthError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    (error as { name: unknown }).name === 'AuthApiError'
  );
}

/** Converte qualquer erro (SDK, rede, desconhecido) em `AppError`. */
export function toAppError(error: unknown): AppError {
  if (error instanceof SupabaseNotConfiguredError) {
    return { code: 'supabase/not-configured', message: error.message, cause: error };
  }
  if (isAuthError(error)) {
    return { code: `auth/${error.code ?? 'unknown'}`, message: error.message, cause: error };
  }
  if (isPostgrestError(error)) {
    return { code: `db/${error.code}`, message: error.message, cause: error };
  }
  if (error instanceof Error) {
    return { code: 'unknown', message: error.message, cause: error };
  }
  return { code: 'unknown', message: 'Algo deu errado. Tente novamente.', cause: error };
}
