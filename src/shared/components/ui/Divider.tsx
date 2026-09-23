import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';

import { Text } from './Text';

export type DividerProps = {
  /** Texto no meio da linha (ex.: "ou"). */
  label?: string;
};

/** Linha divisória, com rótulo opcional centralizado. */
export function Divider({ label }: DividerProps) {
  const { colors, sizes, spacing } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { flexDirection: 'row', alignItems: 'center', gap: spacing[4] },
        line: { flex: 1, height: sizes.borderWidth.hairline, backgroundColor: colors.border },
      }),
    [colors.border, sizes.borderWidth.hairline, spacing],
  );

  return (
    <View style={styles.root} accessibilityElementsHidden importantForAccessibility="no">
      <View style={styles.line} />
      {label ? (
        <>
          <Text variant="body" color="textSubtle">
            {label}
          </Text>
          <View style={styles.line} />
        </>
      ) : null}
    </View>
  );
}
