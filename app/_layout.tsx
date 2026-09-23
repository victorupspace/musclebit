// Primeiro import, sem binding: chama SplashScreen.preventAutoHideAsync() no escopo do módulo.
import '@/splash/preventAutoHide';

import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '@/lib/query';
import { SessionProvider } from '@/lib/supabase';
import { RootStack } from '@/shared/components/RootStack';
import { SplashGate } from '@/splash';
import { ThemeProvider } from '@/theme';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <SplashGate>
            <RootStack />
          </SplashGate>
        </SessionProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
