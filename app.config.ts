import type { ConfigContext, ExpoConfig } from 'expo/config';

// Valores visuais vêm do tema, para a splash nativa ser idêntica à splash em JS.
// Estes dois módulos não importam nada do React Native e por isso podem ser lidos aqui (Node).
// A extensão `.ts` é obrigatória: este arquivo é avaliado pelo Node, que só resolve TypeScript
// com extensão explícita (type stripping nativo, Node >= 22.18). O `eas.json` fixa a versão.
import { SPLASH_BACKGROUND_COLOR } from './src/theme/colors.ts';
import { sizes } from './src/theme/sizes.ts';

const splashScreenConfig = {
  image: './assets/splash-icon.png',
  imageWidth: sizes.splashLogoWidth,
  resizeMode: 'contain',
  backgroundColor: SPLASH_BACKGROUND_COLOR,
  // A splash é sempre navy: momento de marca, independente do tema.
  dark: {
    image: './assets/splash-icon.png',
    backgroundColor: SPLASH_BACKGROUND_COLOR,
  },
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'MuscleBit',
  slug: 'musclebit',
  version: '1.0.0',
  orientation: 'portrait',
  scheme: 'musclebit',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  // Cor da view raiz nativa antes do primeiro render do React. Evita o flash branco.
  backgroundColor: SPLASH_BACKGROUND_COLOR,
  ios: {
    supportsTablet: false,
    // Identificadores nativos, exigidos pelo EAS Build. Ajuste ANTES do primeiro build: depois
    // dele, trocar o identificador significa publicar outro app.
    bundleIdentifier: 'com.musclebit.app',
  },
  android: {
    package: 'com.musclebit.app',
    adaptiveIcon: {
      backgroundColor: SPLASH_BACKGROUND_COLOR,
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    bundler: 'metro',
    favicon: './assets/favicon.png',
  },
  plugins: ['expo-router', ['expo-splash-screen', splashScreenConfig], 'expo-font'],
  experiments: {
    typedRoutes: true,
  },
  // Vínculo com o projeto EAS @victorupspace/musclebit (criado por `eas init`).
  owner: 'victorupspace',
  extra: {
    eas: {
      projectId: '8476752e-aff5-4031-99ec-e135ebcad960',
    },
  },
});
