import type { Session, User } from '@supabase/supabase-js';
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { supabase } from './client';
import { type AppError, toAppError } from './errors';

export type SessionContextValue = {
  session: Session | null;
  user: User | null;
  /** `true` até a sessão inicial ser lida do storage. Condição de readiness da splash. */
  carregando: boolean;
  /** Erro ao ler a sessão inicial, já normalizado. Não bloqueia a splash. */
  erro: AppError | null;
  /** `false` quando o app roda sem credenciais do Supabase. */
  configurado: boolean;
};

const SessionContext = createContext<SessionContextValue | null>(null);

/**
 * Resolve a sessão inicial e acompanha mudanças de autenticação.
 * Sem credenciais, resolve imediatamente com `session = null` e `configurado = false`.
 *
 * Grupos de rota `(auth)` e `(app)` ficam para a etapa de autenticação: ver README.
 */
export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [carregando, setCarregando] = useState(supabase !== null);
  const [erro, setErro] = useState<AppError | null>(null);

  useEffect(() => {
    if (supabase === null) return;
    let ativo = true;

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!ativo) return;
        if (error) setErro(toAppError(error));
        setSession(data.session);
      })
      .catch((error: unknown) => {
        if (ativo) setErro(toAppError(error));
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (ativo) setSession(nextSession);
    });

    return () => {
      ativo = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      carregando,
      erro,
      configurado: supabase !== null,
    }),
    [session, carregando, erro],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const value = useContext(SessionContext);
  if (value === null) {
    throw new Error('useSession() precisa ser usado dentro de <SessionProvider>.');
  }
  return value;
}
