import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { IconButton, Text } from '@/shared/components/ui';
import { useTheme } from '@/theme';

export type OnboardingHeaderProps = {
  /** Texto curto em caixa alta ao lado do botão de voltar. */
  overline: string;
  title: string;
  subtitle: string;
  onBack?: () => void;
};

/** Cabeçalho padrão das etapas de entrada: voltar + overline, título e subtítulo. */
export function OnboardingHeader({ overline, title, subtitle, onBack }: OnboardingHeaderProps) {
  const { spacing } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        topBar: {
          marginTop: spacing[3],
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing[6],
        },
        header: { marginTop: spacing[4], gap: spacing[4] },
      }),
    [spacing],
  );

  return (
    <View>
      <View style={styles.topBar}>
        {onBack ? (
          <IconButton icon="arrow_back" accessibilityLabel="Voltar" onPress={onBack} />
        ) : null}
        <Text variant="overline" color="textSubtle">
          {overline}
        </Text>
      </View>
      <View style={styles.header}>
        <Text variant="display" color="primary">
          {title}
        </Text>
        <Text variant="body" color="textMuted">
          {subtitle}
        </Text>
      </View>
    </View>
  );
}
