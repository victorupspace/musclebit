import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { type ThemeColors, type TypographyVariant, useTheme } from '@/theme';

/** Subconjunto dos tokens de cor que fazem sentido para texto. */
export type TextColor = Extract<
  keyof ThemeColors,
  | 'text'
  | 'textMuted'
  | 'textSubtle'
  | 'textInverse'
  | 'primary'
  | 'onPrimary'
  | 'onPrimaryMuted'
  | 'onSecondary'
  | 'accent'
  | 'onAccent'
  | 'onContrast'
  | 'success'
  | 'danger'
  | 'brandText'
>;

export type TextAlign = 'left' | 'center' | 'right';

export type TextProps = RNTextProps & {
  variant?: TypographyVariant;
  color?: TextColor;
  align?: TextAlign;
};

export function Text({ variant = 'body', color = 'text', align, style, ...rest }: TextProps) {
  const { colors, typography } = useTheme();

  return (
    <RNText
      {...rest}
      style={[typography[variant], { color: colors[color] }, align && { textAlign: align }, style]}
    />
  );
}
