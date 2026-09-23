import { type PropsWithChildren, useMemo } from 'react';
import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native';
import { type Edge, SafeAreaView } from 'react-native-safe-area-context';

import { type ThemeColors, useTheme } from '@/theme';

export type ScreenBackground = Extract<keyof ThemeColors, 'background' | 'surface' | 'brand'>;

export type ScreenProps = PropsWithChildren<{
  /** Cor de fundo, por token. */
  background?: ScreenBackground;
  /** Aplica padding horizontal e vertical padrão. */
  padded?: boolean;
  /** Bordas que respeitam a safe area. */
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
}>;

const DEFAULT_EDGES: Edge[] = ['top', 'bottom', 'left', 'right'];

export function Screen({
  children,
  background = 'background',
  padded = true,
  edges = DEFAULT_EDGES,
  style,
}: ScreenProps) {
  const { colors, spacing } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { flex: 1, backgroundColor: colors[background] },
        padded: { paddingHorizontal: spacing[4], paddingVertical: spacing[4] },
      }),
    [background, colors, spacing],
  );

  return (
    <SafeAreaView edges={edges} style={[styles.root, padded && styles.padded, style]}>
      {children}
    </SafeAreaView>
  );
}
