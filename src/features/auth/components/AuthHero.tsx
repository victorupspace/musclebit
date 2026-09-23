import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconButton, Text } from '@/shared/components/ui';
import { useTheme } from '@/theme';

export type AuthHeroProps = {
  title: string;
  overline?: string;
  /** Mostra o botão de voltar sobre o navy. */
  onBack?: () => void;
};

/** Bloco navy do topo das telas de acesso: círculos decorativos, voltar opcional, overline e título. */
export function AuthHero({ title, overline, onBack }: AuthHeroProps) {
  const { colors, radius, sizes, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  const styles = useMemo(() => {
    // Círculos decorativos, proporcionais a um controle para escalar com o tema.
    const unit = sizes.controlHeight.md;
    const ring = unit * 8;
    const disc = unit * 6;
    return StyleSheet.create({
      root: {
        backgroundColor: colors.primary,
        paddingTop: insets.top + spacing[4],
        paddingHorizontal: spacing[6],
        paddingBottom: spacing[6],
        overflow: 'hidden',
      },
      ring: {
        position: 'absolute',
        top: -ring / 2 + unit,
        right: -ring / 4,
        width: ring,
        height: ring,
        borderRadius: radius.full,
        borderWidth: sizes.borderWidth.hairline,
        borderColor: colors.onPrimarySubtle,
      },
      disc: {
        position: 'absolute',
        top: -disc / 2,
        right: -disc / 3,
        width: disc,
        height: disc,
        borderRadius: radius.full,
        backgroundColor: colors.onPrimarySubtle,
      },
      back: { marginBottom: spacing[6] },
      title: { marginTop: spacing[2] },
    });
  }, [colors, insets.top, radius, sizes, spacing]);

  return (
    <View style={styles.root}>
      <View style={styles.ring} pointerEvents="none" />
      <View style={styles.disc} pointerEvents="none" />
      {onBack ? (
        <View style={styles.back}>
          <IconButton
            icon="arrow_back"
            variant="onPrimary"
            accessibilityLabel="Voltar"
            onPress={onBack}
          />
        </View>
      ) : null}
      {overline ? (
        <Text variant="overline" color="onPrimaryMuted">
          {overline}
        </Text>
      ) : null}
      <Text variant="display" color="onPrimary" style={overline ? styles.title : undefined}>
        {title}
      </Text>
    </View>
  );
}
