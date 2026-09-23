import * as ExpoSplashScreen from 'expo-splash-screen';

// Precisa rodar no escopo do módulo, antes de qualquer componente montar: segura a splash nativa
// até a camada JS estar pintada. `app/_layout.tsx` importa este módulo antes de tudo.
ExpoSplashScreen.preventAutoHideAsync().catch(() => {
  // Já escondida ou plataforma sem splash nativa (web). Não bloqueia o app.
});
