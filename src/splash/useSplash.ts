import { useCallback, useEffect, useState } from 'react';

import { SPLASH_ESCAPE_TIMEOUT_MS, SPLASH_MIN_DURATION_MS } from './constants';

/**
 * Uma condição que precisa passar antes da splash sair.
 * Uma condição com `error` conta como resolvida (não bloqueia), mas o erro é exposto em `errors`.
 */
export type ReadinessCondition = {
  key: string;
  ready: boolean;
  error?: unknown;
};

export type SplashStatus = 'loading' | 'exiting' | 'done';

export type UseSplashOptions = {
  /** Lista extensível: acrescente condições aqui conforme o app crescer. */
  conditions: ReadinessCondition[];
  minimumDurationMs?: number;
  escapeTimeoutMs?: number;
};

export type UseSplashResult = {
  status: SplashStatus;
  /** A camada JS ainda está montada (carregando ou animando a saída). */
  isVisible: boolean;
  /** Todas as condições passaram e o tempo mínimo venceu: a splash deve animar a saída. */
  isExiting: boolean;
  /** O timeout de escape estourou com condições pendentes. */
  timedOut: boolean;
  /** Chaves das condições que ainda não passaram. */
  pendingKeys: string[];
  /** Erros reportados pelas condições, por chave. */
  errors: Record<string, unknown>;
  /** Chame quando a animação de saída terminar; desmonta a camada JS. */
  onExitComplete: () => void;
};

/**
 * Orquestra a saída da splash: espera todas as condições, respeita o tempo mínimo e escapa por
 * timeout se algo nunca resolver.
 *
 * `status` é derivado (não é estado): 'loading' → 'exiting' assim que as condições e o tempo
 * mínimo permitirem, → 'done' quando a animação avisar que terminou.
 */
export function useSplash({
  conditions,
  minimumDurationMs = SPLASH_MIN_DURATION_MS,
  escapeTimeoutMs = SPLASH_ESCAPE_TIMEOUT_MS,
}: UseSplashOptions): UseSplashResult {
  // Inicializador lazy: `Date.now()` roda uma vez, fora do caminho de re-render.
  const [mountedAt] = useState(() => Date.now());
  const [minimumElapsed, setMinimumElapsed] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [exitCompleted, setExitCompleted] = useState(false);

  const pendingKeys = conditions.filter((c) => !c.ready && c.error == null).map((c) => c.key);
  const errors = Object.fromEntries(
    conditions.filter((c) => c.error != null).map((c) => [c.key, c.error]),
  );
  const allSettled = pendingKeys.length === 0;
  // String estável para usar como dependência sem recriar arrays a cada render.
  const pendingSignature = pendingKeys.join('|');

  useEffect(() => {
    const remaining = Math.max(0, minimumDurationMs - (Date.now() - mountedAt));
    const timer = setTimeout(() => setMinimumElapsed(true), remaining);
    return () => clearTimeout(timer);
  }, [minimumDurationMs, mountedAt]);

  useEffect(() => {
    if (allSettled) return;
    const remaining = Math.max(0, escapeTimeoutMs - (Date.now() - mountedAt));
    const timer = setTimeout(() => {
      setTimedOut(true);
      if (__DEV__) {
        console.warn(`[splash] timeout de escape. Condições pendentes: ${pendingSignature}`);
      }
    }, remaining);
    return () => clearTimeout(timer);
  }, [allSettled, escapeTimeoutMs, mountedAt, pendingSignature]);

  const onExitComplete = useCallback(() => setExitCompleted(true), []);

  const canExit = (allSettled || timedOut) && minimumElapsed;
  const status: SplashStatus = exitCompleted ? 'done' : canExit ? 'exiting' : 'loading';

  return {
    status,
    isVisible: status !== 'done',
    isExiting: status === 'exiting',
    timedOut,
    pendingKeys,
    errors,
    onExitComplete,
  };
}
