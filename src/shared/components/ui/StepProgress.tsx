import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';

export type StepProgressProps = {
  /** Total de etapas. */
  total: number;
  /** Etapa atual, começando em 1. Etapas até ela ficam preenchidas. */
  current: number;
};

/** Barra segmentada de progresso por etapas (uma barra por passo). */
export function StepProgress({ total, current }: StepProgressProps) {
  const { colors, radius, sizes, spacing } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { flex: 1, flexDirection: 'row', gap: spacing[3] },
        segment: { flex: 1, height: sizes.progressBar, borderRadius: radius.full },
        done: { backgroundColor: colors.primary },
        todo: { backgroundColor: colors.border },
      }),
    [colors.border, colors.primary, radius.full, sizes.progressBar, spacing],
  );

  return (
    <View
      style={styles.root}
      accessibilityRole="progressbar"
      accessibilityLabel={`Passo ${current} de ${total}`}
      accessibilityValue={{ min: 0, max: total, now: current }}
    >
      {Array.from({ length: total }, (_, i) => (
        <View key={i} style={[styles.segment, i < current ? styles.done : styles.todo]} />
      ))}
    </View>
  );
}
