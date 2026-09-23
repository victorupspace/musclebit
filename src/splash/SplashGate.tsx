import { StatusBar } from 'expo-status-bar';
import type { PropsWithChildren } from 'react';

import { useSession } from '@/lib/supabase';
import { useTheme, useThemeFonts } from '@/theme';

import { SplashScreen } from './SplashScreen';
import { useSplash } from './useSplash';

/**
 * Monta o app por baixo da splash em JS e decide quando ela sai.
 * Para adicionar uma condição de readiness, inclua um item no array de `conditions`.
 */
export function SplashGate({ children }: PropsWithChildren) {
  const { isDark, isResolved } = useTheme();
  const [fontsLoaded, fontsError] = useThemeFonts();
  const { carregando: sessionLoading, erro: sessionError } = useSession();

  const splash = useSplash({
    conditions: [
      { key: 'fonts', ready: fontsLoaded, error: fontsError },
      { key: 'theme', ready: isResolved },
      { key: 'session', ready: !sessionLoading, error: sessionError },
    ],
  });

  // Só monta o app com as fontes resolvidas: evita o primeiro render com fonte de fallback.
  // A splash continua por cima até `onExitComplete`.
  const fontsSettled = fontsLoaded || fontsError !== null;

  return (
    <>
      <StatusBar style={splash.isVisible || isDark ? 'light' : 'dark'} />
      {fontsSettled ? children : null}
      {splash.isVisible ? (
        <SplashScreen exiting={splash.isExiting} onExitComplete={splash.onExitComplete} />
      ) : null}
    </>
  );
}
