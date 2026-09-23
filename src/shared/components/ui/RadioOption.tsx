import { useMemo } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { useTheme } from '@/theme';

import { Radio } from './Radio';
import { Text } from './Text';

export type RadioOptionProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

/** Rádio com rótulo ao lado, para escolhas curtas em linha (Sim / Não). O pai controla `selected`. */
export function RadioOption({ label, selected, onPress }: RadioOptionProps) {
  const { spacing } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { flexDirection: 'row', alignItems: 'center', gap: spacing[3] },
        pressed: { opacity: 0.7 },
      }),
    [spacing],
  );

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
      hitSlop={spacing[2]}
      onPress={onPress}
      style={({ pressed }) => [styles.root, pressed && styles.pressed]}
    >
      <Radio selected={selected} />
      <Text variant="body">{label}</Text>
    </Pressable>
  );
}
