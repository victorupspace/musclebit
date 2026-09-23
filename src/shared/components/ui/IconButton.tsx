import { useMemo } from 'react';
import { Pressable, type PressableProps, StyleSheet } from 'react-native';

import { useTheme } from '@/theme';

import { Icon, type IconName, type IconSize } from './Icon';
import type { TextColor } from './Text';

export type IconButtonVariant = 'soft' | 'ghost' | 'onPrimary';

export type IconButtonProps = Omit<PressableProps, 'style' | 'children'> & {
  icon: IconName;
  /** Obrigatório: um botão só com ícone precisa de nome para leitores de tela. */
  accessibilityLabel: string;
  variant?: IconButtonVariant;
  color?: TextColor;
  /** Spec: caixa de 40 com padding vertical 12 deixa 16 para o glifo (`sm`). */
  iconSize?: IconSize;
};

/**
 * Botão só com ícone, 40×40 e raio 12 (spec de design).
 * `soft` tem fundo suave (voltar, fechar); `ghost` é só o ícone; `onPrimary` é a versão para
 * fundos na cor primária (herói navy), com véu claro e ícone claro.
 */
export function IconButton({
  icon,
  accessibilityLabel,
  variant = 'soft',
  color = variant === 'onPrimary' ? 'onPrimary' : 'text',
  iconSize = 'sm',
  disabled,
  ...rest
}: IconButtonProps) {
  const { colors, radius, sizes, spacing } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        base: {
          width: sizes.controlHeight.sm,
          height: sizes.controlHeight.sm,
          paddingVertical: spacing[3],
          borderRadius: radius.lg,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor:
            variant === 'soft'
              ? colors.secondary
              : variant === 'onPrimary'
                ? colors.onPrimarySubtle
                : 'transparent',
        },
        pressed: {
          backgroundColor:
            variant === 'soft'
              ? colors.secondaryPressed
              : variant === 'onPrimary'
                ? colors.onPrimaryMuted
                : colors.primarySubtle,
        },
        disabled: { opacity: 0.5 },
      }),
    [colors, radius.lg, sizes.controlHeight.sm, spacing, variant],
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      hitSlop={sizes.icon.sm / 2}
      style={({ pressed }) => [styles.base, pressed && styles.pressed, disabled && styles.disabled]}
      {...rest}
    >
      <Icon name={icon} color={color} size={iconSize} />
    </Pressable>
  );
}
