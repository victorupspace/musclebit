import { useMemo } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Text, type TextColor } from '@/shared/components/ui';
import { useTheme } from '@/theme';

import { AppleLogo, GoogleLogo } from './BrandLogos';

export type SocialProvider = 'google' | 'apple';

export type SocialButtonProps = {
  provider: SocialProvider;
  onPress?: () => void;
  disabled?: boolean;
};

const LABELS: Record<SocialProvider, string> = {
  google: 'Continuar com Google',
  apple: 'Continuar com Apple',
};

/** Botão de login social: Google em contorno claro, Apple em contraste sólido (padrão HIG). */
export function SocialButton({ provider, onPress, disabled }: SocialButtonProps) {
  const { colors, radius, sizes, spacing } = useTheme();
  const labelColor: TextColor = provider === 'apple' ? 'onContrast' : 'text';

  const styles = useMemo(
    () =>
      StyleSheet.create({
        base: {
          height: sizes.controlHeight.lg,
          borderRadius: radius.xl,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing[3],
          paddingHorizontal: spacing[6],
        },
        google: {
          backgroundColor: colors.surface,
          borderWidth: sizes.borderWidth.hairline,
          borderColor: colors.border,
        },
        apple: { backgroundColor: colors.contrast },
        pressed: { opacity: 0.85 },
        disabled: { opacity: 0.5 },
      }),
    [colors, radius.xl, sizes, spacing],
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={LABELS[provider]}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[provider],
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      {provider === 'google' ? (
        <GoogleLogo size={sizes.icon.md} />
      ) : (
        <AppleLogo size={sizes.icon.md} />
      )}
      <Text variant="button" color={labelColor}>
        {LABELS[provider]}
      </Text>
    </Pressable>
  );
}
