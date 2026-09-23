import { focusManager, QueryClient } from '@tanstack/react-query';
import { AppState, Platform } from 'react-native';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Dado considerado fresco por 1 min: navegar entre telas não refaz a mesma query.
      staleTime: 60 * 1000,
      // Cache mantido por 5 min após a última tela que o usava desmontar.
      gcTime: 5 * 60 * 1000,
      // Rede móvel oscila: uma nova tentativa antes de mostrar erro.
      retry: 1,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: 0,
    },
  },
});

// Em app nativo, "foco" é o AppState voltar a 'active'. Sem isso o refetchOnWindowFocus não age.
if (Platform.OS !== 'web') {
  focusManager.setEventListener((handleFocus) => {
    const subscription = AppState.addEventListener('change', (state) => {
      handleFocus(state === 'active');
    });
    return () => subscription.remove();
  });
}

// Persistência offline: quando for necessária, adicione aqui um persister com
// `@tanstack/query-async-storage-persister` + `PersistQueryClientProvider` e o
// `onlineManager` ligado ao `@react-native-community/netinfo`.
