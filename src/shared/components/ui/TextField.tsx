import { type ReactNode, useMemo, useState } from 'react';
import { StyleSheet, TextInput, type TextInputProps, View } from 'react-native';

import { useTheme } from '@/theme';

import { Text } from './Text';

export type TextFieldProps = Omit<TextInputProps, 'style'> & {
  label: string;
  /** Mensagem de erro; quando presente, a borda fica vermelha e o texto aparece abaixo. */
  error?: string;
  /** Texto auxiliar abaixo do campo (ignorado quando há erro). */
  hint?: string;
  /** Elemento à direita, dentro do campo (ícone, botão de mostrar senha). */
  accessory?: ReactNode;
};

/** Campo de texto com rótulo em caixa alta, borda fina e estados de foco e erro. */
export function TextField({
  label,
  error,
  hint,
  accessory,
  onFocus,
  onBlur,
  editable,
  ...rest
}: TextFieldProps) {
  const { colors, radius, sizes, spacing, typography } = useTheme();
  const [focused, setFocused] = useState(false);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { gap: spacing[3] },
        field: {
          height: sizes.controlHeight.lg,
          paddingLeft: spacing[4],
          paddingRight: accessory ? spacing[3] : spacing[4],
          borderRadius: radius.xl,
          borderWidth: sizes.borderWidth.hairline,
          borderColor: error ? colors.danger : focused ? colors.primary : colors.border,
          backgroundColor: colors.background,
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing[2],
        },
        input: { ...typography.input, flex: 1, height: '100%', color: colors.text },
        disabled: { opacity: 0.5 },
      }),
    [accessory, colors, error, focused, radius.xl, sizes, spacing, typography.input],
  );

  const helper = error ?? hint;

  return (
    <View style={styles.root}>
      <Text variant="fieldLabel">{label}</Text>
      <View style={[styles.field, editable === false && styles.disabled]}>
        <TextInput
          {...rest}
          editable={editable}
          accessibilityLabel={label}
          placeholderTextColor={colors.textSubtle}
          selectionColor={colors.primary}
          style={styles.input}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
        />
        {accessory}
      </View>
      {helper ? (
        <Text variant="caption" color={error ? 'danger' : 'textMuted'}>
          {helper}
        </Text>
      ) : null}
    </View>
  );
}
