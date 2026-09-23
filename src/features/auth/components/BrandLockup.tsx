import { useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Text } from '@/shared/components/ui';
import { useTheme } from '@/theme';

// Gerados por scripts/generate-brand-assets.py a partir de assets/musclebit.png, no mesmo fator
// de escala. Por isso a razão entre larguras dos assets é a razão entre larguras da arte original.
const dumbbellImage = require('../../../../assets/dumbbell.png');
const wordmarkDarkImage = require('../../../../assets/wordmark-dark.png');
const wordmarkLightImage = require('../../../../assets/wordmark-light.png');

const dumbbell = Image.resolveAssetSource(dumbbellImage);
const wordmark = Image.resolveAssetSource(wordmarkLightImage);

/** Altura de um asset para uma largura dada, preservando a proporção. */
function heightFor(width: number, source: { width: number; height: number }): number {
  return source.width > 0 ? (width * source.height) / source.width : width;
}

type BrandLockupProps = {
  /** Linha curta abaixo do wordmark. */
  tagline?: string;
};

/**
 * Halter + wordmark "MUSCLEBIT", ambos em pixel art da arte original, no mesmo fator de escala.
 * O wordmark troca de cor com o tema (navy no claro, branco no escuro); o "BIT" é sempre coral.
 */
export function BrandLockup({ tagline }: BrandLockupProps) {
  const { isDark, sizes, spacing } = useTheme();

  const styles = useMemo(() => {
    const dumbbellWidth = sizes.heroLogoWidth;
    // Mesmo pixel da arte original ⇒ mesma escala em pontos para o wordmark.
    const wordmarkWidth =
      dumbbell.width > 0 ? (dumbbellWidth * wordmark.width) / dumbbell.width : 0;
    return StyleSheet.create({
      root: { alignItems: 'center' },
      dumbbell: {
        width: dumbbellWidth,
        height: heightFor(dumbbellWidth, dumbbell),
        marginBottom: spacing[4],
      },
      wordmark: { width: wordmarkWidth, height: heightFor(wordmarkWidth, wordmark) },
      tagline: { marginTop: spacing[3] },
    });
  }, [sizes.heroLogoWidth, spacing]);

  return (
    <View style={styles.root} accessibilityRole="header" accessibilityLabel="MuscleBit">
      <Image
        source={dumbbellImage}
        resizeMode="contain"
        style={styles.dumbbell}
        accessibilityIgnoresInvertColors
      />
      <Image
        source={isDark ? wordmarkDarkImage : wordmarkLightImage}
        resizeMode="contain"
        style={styles.wordmark}
        accessibilityIgnoresInvertColors
      />
      {tagline ? (
        <Text variant="overline" color="textMuted" align="center" style={styles.tagline}>
          {tagline}
        </Text>
      ) : null}
    </View>
  );
}
