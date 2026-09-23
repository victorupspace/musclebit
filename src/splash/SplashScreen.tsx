import * as ExpoSplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Image, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { useTheme } from '@/theme';

import { SPLASH_NATIVE_HIDE_FALLBACK_MS } from './constants';

// Mesmo arquivo configurado no plugin `expo-splash-screen` em app.config.ts.
// A camada JS precisa ser visualmente idêntica à nativa para a troca ser invisível.
// Gerado por scripts/generate-splash-icon.py a partir de assets/musclebit.png.
const splashImage = require('../../assets/splash-icon.png');
// Proporção lida do próprio asset: a altura acompanha a largura do tema sem número mágico.
// Largura e altura são passadas explicitamente ao estilo: só `aspectRatio` não bastou no RN 0.86,
// a imagem era renderizada no tamanho intrínseco. Sem dimensões no registro, cai em 1:1.
const splashImageSource = Image.resolveAssetSource(splashImage);
const splashImageAspectRatio =
  splashImageSource?.width > 0 && splashImageSource?.height > 0
    ? splashImageSource.width / splashImageSource.height
    : 1;

type SplashScreenProps = {
  /** Quando `true`, inicia a animação de saída. */
  exiting: boolean;
  /** Chamado ao fim da animação (ou imediatamente, com movimento reduzido). */
  onExitComplete: () => void;
};

/**
 * Splash em JS: replica a splash nativa e faz a saída animada.
 * A nativa é escondida assim que esta camada estiver pintada com a imagem carregada.
 */
export function SplashScreen({ exiting, onExitComplete }: SplashScreenProps) {
  const { colors, sizes, motion } = useTheme();
  // Lê AccessibilityInfo.isReduceMotionEnabled() e reage a mudanças.
  const reducedMotion = useReducedMotion();
  const progress = useSharedValue(0);
  const nativeHidden = useRef(false);

  const hideNative = useCallback(() => {
    if (nativeHidden.current) return;
    nativeHidden.current = true;
    ExpoSplashScreen.hideAsync().catch(() => {
      // Sem splash nativa para esconder (web, ou já escondida). Não é erro do app.
    });
  }, []);

  // Fallback: se o onLoadEnd da imagem não disparar, esconde a nativa mesmo assim.
  useEffect(() => {
    const timer = setTimeout(hideNative, SPLASH_NATIVE_HIDE_FALLBACK_MS);
    return () => clearTimeout(timer);
  }, [hideNative]);

  useEffect(() => {
    if (!exiting) return;
    if (reducedMotion) {
      onExitComplete();
      return;
    }
    progress.value = withTiming(
      1,
      { duration: motion.duration.slow, easing: Easing.out(Easing.cubic) },
      (finished) => {
        if (finished) scheduleOnRN(onExitComplete);
      },
    );
  }, [exiting, motion.duration.slow, onExitComplete, progress, reducedMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [{ scale: 1 + progress.value * (motion.splashExitScale - 1) }],
  }));

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: {
          backgroundColor: colors.brand,
          alignItems: 'center',
          justifyContent: 'center',
        },
        logo: {
          width: sizes.splashLogoWidth,
          height: sizes.splashLogoWidth / splashImageAspectRatio,
        },
      }),
    [colors.brand, sizes.splashLogoWidth],
  );

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents={exiting ? 'none' : 'auto'}
      style={[StyleSheet.absoluteFill, styles.root, animatedStyle]}
    >
      <Image
        source={splashImage}
        resizeMode="contain"
        style={styles.logo}
        onLoadEnd={hideNative}
        accessibilityIgnoresInvertColors
      />
    </Animated.View>
  );
}
