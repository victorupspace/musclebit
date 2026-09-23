import { z } from 'zod';

/**
 * Leitura e validação das variáveis de ambiente.
 *
 * O Expo só inclui no bundle variáveis com prefixo `EXPO_PUBLIC_` e só quando acessadas de forma
 * estática (`process.env.EXPO_PUBLIC_X`, nunca `process.env[nome]`). Por isso o objeto `raw` lista
 * cada variável explicitamente.
 *
 * Regras:
 * - Variável ausente NÃO derruba o app: o Supabase fica desativado e `env.supabase` é `null`.
 * - Variável presente mas inválida (URL malformada, chave vazia) derruba com mensagem clara.
 */
const envSchema = z.object({
  EXPO_PUBLIC_SUPABASE_URL: z.url({ message: 'EXPO_PUBLIC_SUPABASE_URL precisa ser uma URL' }),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, { message: 'EXPO_PUBLIC_SUPABASE_ANON_KEY não pode ser vazia' }),
});

const raw = {
  EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
};

export type SupabaseEnv = {
  url: string;
  anonKey: string;
};

export type Env = {
  /** `null` quando as credenciais não foram configuradas. */
  supabase: SupabaseEnv | null;
};

function isBlank(value: string | undefined): boolean {
  return value === undefined || value.trim() === '';
}

function loadEnv(): Env {
  const nothingConfigured = Object.values(raw).every(isBlank);
  if (nothingConfigured) {
    if (__DEV__) {
      console.info(
        '[env] Supabase não configurado. Copie .env.example para .env.local para ativar o backend.',
      );
    }
    return { supabase: null };
  }

  const parsed = envSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(
      `[env] Variáveis de ambiente inválidas em .env.local:\n${z.prettifyError(parsed.error)}`,
    );
  }

  return {
    supabase: {
      url: parsed.data.EXPO_PUBLIC_SUPABASE_URL,
      anonKey: parsed.data.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    },
  };
}

export const env: Env = loadEnv();
