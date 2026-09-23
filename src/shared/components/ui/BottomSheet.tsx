import { type PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { useTheme } from '@/theme';

import { Text } from './Text';

export type BottomSheetProps = PropsWithChildren<{
  visible: boolean;
  onClose: () => void;
  title?: string;
}>;

/**
 * Folha inferior com fundo em fade e deslize suavizado. A saída anima antes de desmontar o Modal,
 * e com "reduzir movimento" ativo a folha aparece e some sem animação.
 */
export function BottomSheet({ visible, onClose, title, children }: BottomSheetProps) {
  const { colors, motion, radius, sizes, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const reducedMotion = useReducedMotion();

  // `exiting` mantém o Modal montado durante a animação de saída. É ajustado durante o render
  // quando `visible` muda (padrão "derivar estado de prop" do React), e zerado no callback da
  // animação, nunca de forma síncrona dentro de um effect.
  const [prevVisible, setPrevVisible] = useState(visible);
  const [exiting, setExiting] = useState(false);
  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (!visible) setExiting(true);
  }
  const [sheetHeight, setSheetHeight] = useState(windowHeight);
  const progress = useSharedValue(0);

  const animateTo = useCallback(
    (value: 0 | 1, onDone?: () => void) => {
      if (reducedMotion) {
        progress.set(value);
        onDone?.();
        return;
      }
      progress.set(
        withTiming(
          value,
          {
            duration: value === 1 ? motion.duration.slow : motion.duration.base,
            easing: value === 1 ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
          },
          (finished) => {
            if (finished && onDone) scheduleOnRN(onDone);
          },
        ),
      );
    },
    [motion.duration.base, motion.duration.slow, progress, reducedMotion],
  );

  useEffect(() => {
    if (visible) {
      // Começa fora da tela; anima no próximo frame, quando a folha já estiver montada.
      progress.set(0);
      const frame = requestAnimationFrame(() => animateTo(1));
      return () => cancelAnimationFrame(frame);
    }
    if (exiting) animateTo(0, () => setExiting(false));
    return undefined;
  }, [animateTo, exiting, progress, visible]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - progress.value) * sheetHeight }],
  }));

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { flex: 1, justifyContent: 'flex-end' },
        backdrop: {
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: colors.overlay,
        },
        sheet: {
          backgroundColor: colors.surface,
          borderTopLeftRadius: radius.xl,
          borderTopRightRadius: radius.xl,
          paddingTop: spacing[2],
          paddingBottom: insets.bottom + spacing[4],
          maxHeight: windowHeight * 0.85,
        },
        grabber: {
          alignSelf: 'center',
          width: spacing[10],
          height: sizes.progressBar,
          borderRadius: radius.full,
          backgroundColor: colors.borderStrong,
          marginBottom: spacing[3],
        },
        title: { paddingHorizontal: spacing[6], paddingBottom: spacing[2] },
      }),
    [colors, insets.bottom, radius, sizes.progressBar, spacing, windowHeight],
  );

  if (!visible && !exiting) return null;

  return (
    <Modal visible transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={onClose}
            accessibilityLabel="Fechar"
          />
        </Animated.View>
        <Animated.View
          style={[styles.sheet, sheetStyle]}
          onLayout={(e) => setSheetHeight(e.nativeEvent.layout.height)}
          accessibilityViewIsModal
        >
          <View style={styles.grabber} />
          {title ? (
            <View style={styles.title}>
              <Text variant="heading">{title}</Text>
            </View>
          ) : null}
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}
