import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

import { env } from '@/config/env';

import type { Database } from './database.types';

export type AppSupabaseClient = SupabaseClient<Database>;

function createSupabaseClient(): AppSupabaseClient | null {
  if (env.supabase === null) return null;

  return createClient<Database>(env.supabase.url, env.supabase.anonKey, {
    auth: {
      // Decisão: AsyncStorage, não SecureStore. O SecureStore tem limite de 2048 bytes por chave
      // no Android; sessões com JWT maiores (claims, provedores OAuth) estouram esse limite e
      // exigiriam fatiar o valor manualmente. Se um dia for necessário criptografar, a troca é
      // só neste adapter.
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      // Não há URL de callback em app nativo; o deep link é tratado explicitamente pelo Expo Router.
      detectSessionInUrl: false,
    },
  });
}

/**
 * Client do Supabase. É `null` quando as credenciais não estão configuradas (ver `config/env.ts`).
 * Fora de `src/lib/supabase`, importe de `"@/lib/supabase"`.
 */
export const supabase: AppSupabaseClient | null = createSupabaseClient();

// Renova o token só com o app em primeiro plano. Em background o timer é parado para economizar
// bateria e evitar refresh com rede suspensa.
if (supabase !== null && Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      void supabase.auth.startAutoRefresh();
    } else {
      void supabase.auth.stopAutoRefresh();
    }
  });
}
