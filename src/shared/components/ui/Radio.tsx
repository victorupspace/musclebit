import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';

export type RadioTone = 'primary' | 'onPrimary';

export type RadioProps = {
  selected: boolean;
  /** `onPrimary` quando o rádio está sobre um fundo na cor primária (card selecionado). */
  tone?: RadioTone;
};

/** Proporção do miolo em relação ao anel, da spec de design. */
const DOT_RATIO = 0.6;

/** Indicador visual de seleção única. Não trata toque: o pai (card, linha) é o alvo. */
export function Radio({ selected, tone = 'primary' }: RadioProps) {
  const { colors, sizes, radius } = useTheme();

  const styles = useMemo(() => {
    const outer = sizes.icon.md;
    const activeColor = colors[tone];
    return StyleSheet.create({
      outer: {
        width: outer,
        height: outer,
        borderRadius: radius.full,
        borderWidth: sizes.borderWidth.thick,
        borderColor: selected ? activeColor : colors.borderStrong,
        alignItems: 'center',
        justifyContent: 'center',
      },
      inner: {
        width: outer * DOT_RATIO,
        height: outer * DOT_RATIO,
        borderRadius: radius.full,
        backgroundColor: activeColor,
      },
    });
  }, [colors, radius.full, selected, sizes.borderWidth.thick, sizes.icon.md, tone]);

  return <View style={styles.outer}>{selected ? <View style={styles.inner} /> : null}</View>;
}
