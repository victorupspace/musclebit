import { useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { useTheme } from '@/theme';

import { Text } from './Text';

export type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  /** Chamado quando todos os dígitos foram preenchidos. */
  onComplete?: (value: string) => void;
  error?: string;
  autoFocus?: boolean;
};

/**
 * Código de verificação em caixas. Por baixo há um único TextInput invisível: é ele que recebe o
 * teclado numérico e o preenchimento automático do código vindo por SMS ou e-mail (iOS).
 */
export function OtpInput({
  value,
  onChange,
  length = 6,
  onComplete,
  error,
  autoFocus = false,
}: OtpInputProps) {
  const { colors, radius, sizes, spacing } = useTheme();
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);
  const digits = value.replace(/\D/g, '').slice(0, length);
  const activeIndex = Math.min(digits.length, length - 1);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { gap: spacing[3] },
        row: { flexDirection: 'row', gap: spacing[3] },
        box: {
          flex: 1,
          aspectRatio: 1,
          borderRadius: radius.xl,
          borderWidth: sizes.borderWidth.hairline,
          borderColor: colors.border,
          backgroundColor: colors.background,
          alignItems: 'center',
          justifyContent: 'center',
        },
        boxActive: { borderColor: colors.primary },
        boxError: { borderColor: colors.danger },
        hidden: { position: 'absolute', opacity: 0, width: 1, height: 1 },
      }),
    [colors, radius.xl, sizes.borderWidth.hairline, spacing],
  );

  const handleChange = (raw: string) => {
    const next = raw.replace(/\D/g, '').slice(0, length);
    onChange(next);
    if (next.length === length) onComplete?.(next);
  };

  return (
    <View style={styles.root}>
      <Pressable
        style={styles.row}
        onPress={() => inputRef.current?.focus()}
        accessibilityRole="none"
        accessibilityLabel={`Código de verificação, ${digits.length} de ${length} dígitos`}
      >
        {Array.from({ length }, (_, i) => {
          const isActive = focused && i === activeIndex;
          return (
            <View
              key={i}
              style={[styles.box, isActive && styles.boxActive, error && styles.boxError]}
            >
              <Text variant="title" color="primary">
                {digits[i] ?? ''}
              </Text>
            </View>
          );
        })}
      </Pressable>
      <TextInput
        ref={inputRef}
        value={digits}
        onChangeText={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        keyboardType="number-pad"
        inputMode="numeric"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        maxLength={length}
        autoFocus={autoFocus}
        caretHidden
        style={styles.hidden}
        accessibilityLabel="Código de verificação"
      />
      {error ? (
        <Text variant="caption" color="danger" align="center">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
