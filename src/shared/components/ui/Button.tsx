import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  type StyleProp,
  StyleSheet,
  type ViewStyle,
} from 'react-native';

import { type Theme, useTheme } from '@/theme';

import { Text, type TextColor } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'inverse';
export type ButtonSize = 'md' | 'lg';

export type ButtonProps = Omit<PressableProps, 'style' | 'children'> & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

type VariantStyle = {
  container: ViewStyle;
  /** Aplicado em hover (web) e pressionado (toque). Sem valor, cai no escurecimento por opacidade. */
  active?: ViewStyle;
  labelColor: TextColor;
};

function resolveVariant(theme: Theme, variant: ButtonVariant): VariantStyle {
  const { colors } = theme;
  switch (variant) {
    case 'primary':
      return { container: { backgroundColor: colors.primary }, labelColor: 'onPrimary' };
    case 'secondary':
      return {
        container: { backgroundColor: colors.secondary },
        active: { backgroundColor: colors.secondaryPressed },
        labelColor: 'onSecondary',
      };
    case 'ghost':
      return {
        container: { backgroundColor: 'transparent' },
        active: { backgroundColor: colors.primarySubtle },
        labelColor: 'primary',
      };
    case 'inverse':
      // Sobre fundos na cor primária: botão claro com texto na cor primária.
      return { container: { backgroundColor: colors.onPrimary }, labelColor: 'primary' };
    case 'danger':
      return { container: { backgroundColor: colors.danger }, labelColor: 'onAccent' as TextColor };
  }
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const { colors, spacing, radius, sizes } = theme;
  const resolved = useMemo(() => resolveVariant(theme, variant), [theme, variant]);
  const isDisabled = disabled || loading;
  // Hover só existe no web; no toque, o mesmo estilo entra pelo `pressed` do Pressable.
  const [hovered, setHovered] = useState(false);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        base: {
          height: sizes.controlHeight[size],
          paddingHorizontal: size === 'lg' ? spacing[6] : spacing[4],
          borderRadius: radius.xl,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: spacing[2],
        },
        fullWidth: { alignSelf: 'stretch' },
        pressed: { opacity: 0.8 },
        disabled: { opacity: 0.5 },
      }),
    [radius.xl, size, sizes.controlHeight, spacing],
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={({ pressed }) => [
        styles.base,
        resolved.container,
        fullWidth && styles.fullWidth,
        (pressed || hovered) && (resolved.active ?? styles.pressed),
        isDisabled && styles.disabled,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={colors[resolved.labelColor]} />
      ) : (
        <Text
          variant={size === 'lg' ? 'button' : 'label'}
          color={resolved.labelColor}
          align="center"
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}
