import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';

import { BottomSheet } from './BottomSheet';
import { Icon } from './Icon';
import { Text } from './Text';

export type SelectOption<T extends string> = { value: T; label: string };

export type SelectProps<T extends string> = {
  label: string;
  options: readonly SelectOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  placeholder?: string;
  error?: string;
};

/**
 * Seleção única com aparência de campo. Abre uma folha inferior com as opções.
 * Genérico no tipo do valor, então `onChange` devolve o union do domínio, não string solta.
 */
export function Select<T extends string>({
  label,
  options,
  value,
  onChange,
  placeholder = 'Selecione',
  error,
}: SelectProps<T>) {
  const { colors, radius, sizes, spacing } = useTheme();
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value) ?? null;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { gap: spacing[3] },
        trigger: {
          height: sizes.controlHeight.lg,
          paddingHorizontal: spacing[4],
          borderRadius: radius.xl,
          borderWidth: sizes.borderWidth.hairline,
          borderColor: error ? colors.danger : open ? colors.primary : colors.border,
          backgroundColor: colors.background,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing[2],
        },
        triggerPressed: { backgroundColor: colors.secondary },
        option: {
          minHeight: sizes.controlHeight.lg,
          paddingHorizontal: spacing[6],
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing[3],
        },
        optionPressed: { backgroundColor: colors.secondary },
      }),
    [colors, error, open, radius.xl, sizes, spacing],
  );

  return (
    <View style={styles.root}>
      <Text variant="fieldLabel">{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityValue={{ text: selected?.label ?? placeholder }}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [styles.trigger, pressed && styles.triggerPressed]}
      >
        <Text variant="input" color={selected ? 'text' : 'textSubtle'}>
          {selected?.label ?? placeholder}
        </Text>
        <Icon name="expand_more" color="text" />
      </Pressable>
      {error ? (
        <Text variant="caption" color="danger">
          {error}
        </Text>
      ) : null}

      <BottomSheet visible={open} onClose={() => setOpen(false)} title={label}>
        <FlatList
          data={options}
          keyExtractor={(o) => o.value}
          bounces={false}
          renderItem={({ item }) => {
            const isSelected = item.value === value;
            return (
              <Pressable
                accessibilityRole="radio"
                accessibilityState={{ checked: isSelected }}
                onPress={() => {
                  onChange(item.value);
                  setOpen(false);
                }}
                style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
              >
                <Text variant="input" color={isSelected ? 'primary' : 'text'}>
                  {item.label}
                </Text>
                {isSelected ? <Icon name="check" color="primary" /> : null}
              </Pressable>
            );
          }}
        />
      </BottomSheet>
    </View>
  );
}
