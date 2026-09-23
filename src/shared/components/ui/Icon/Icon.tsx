import { useMemo } from 'react';
import { StyleSheet, Text, type TextProps } from 'react-native';

import { useTheme } from '@/theme';

import type { TextColor } from '../Text';
import { codepoints, type IconName } from './codepoints';

export type IconSize = 'sm' | 'md' | 'lg';

export type IconProps = Omit<TextProps, 'children' | 'style'> & {
  /** Nome do ícone no Material Symbols (https://fonts.google.com/icons). */
  name: IconName;
  size?: IconSize;
  color?: TextColor;
};

/**
 * Ícone do Material Symbols Rounded, renderizado por codepoint a partir do subconjunto em
 * assets/fonts. Todo ícone do app passa por aqui; nomes fora da lista falham no typecheck.
 *
 * A fonte gerada tem métricas verticais normalizadas (ascendente = em, descendente 0), então
 * `lineHeight` igual ao `fontSize` centraliza o glifo na caixa quadrada sem ajuste manual.
 */
export function Icon({ name, size = 'md', color = 'text', ...rest }: IconProps) {
  const { colors, sizes, typography } = useTheme();
  const px = sizes.icon[size];
  const hidden = rest.accessibilityLabel === undefined;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        glyph: {
          fontFamily: typography.icon.fontFamily,
          fontSize: px,
          lineHeight: px,
          width: px,
          height: px,
          textAlign: 'center',
          color: colors[color],
          includeFontPadding: false,
        },
      }),
    [color, colors, px, typography.icon.fontFamily],
  );

  return (
    <Text
      {...rest}
      accessibilityElementsHidden={hidden}
      importantForAccessibility={hidden ? 'no' : 'yes'}
      allowFontScaling={false}
      numberOfLines={1}
      style={styles.glyph}
    >
      {String.fromCodePoint(codepoints[name])}
    </Text>
  );
}
