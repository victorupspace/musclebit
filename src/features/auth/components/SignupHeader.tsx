import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { IconButton, StepProgress, Text } from '@/shared/components/ui';
import { useTheme } from '@/theme';

export type SignupHeaderProps = {
  step: number;
  totalSteps: number;
  title: string;
  subtitle: string;
  onBack?: () => void;
};

/** Cabeçalho das etapas de cadastro: voltar + progresso, "Passo N de M", título e subtítulo. */
export function SignupHeader({ step, totalSteps, title, subtitle, onBack }: SignupHeaderProps) {
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
        header: { marginTop: spacing[8], gap: spacing[3] },
        subtitle: { marginTop: spacing[1] },
      }),
    [spacing],
  );

  return (
    <View>
      <View style={styles.topBar}>
        <IconButton icon="arrow_back" accessibilityLabel="Voltar" onPress={onBack} />
        <StepProgress total={totalSteps} current={step} />
      </View>
      <View style={styles.header}>
        <Text variant="overline" color="textSubtle">
          {`Passo ${step} de ${totalSteps}`}
        </Text>
        <Text variant="display" color="primary">
          {title}
        </Text>
        <Text variant="body" color="textMuted" style={styles.subtitle}>
          {subtitle}
        </Text>
      </View>
    </View>
  );
}
