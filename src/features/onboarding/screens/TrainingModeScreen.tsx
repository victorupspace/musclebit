import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, type IconName, OptionCard, Screen } from '@/shared/components/ui';
import { useTheme } from '@/theme';

import { OnboardingHeader } from '../components/OnboardingHeader';
import { useOnboardingStore } from '../store/useOnboardingStore';
import type { TrainingMode } from '../types';

export type TrainingModeScreenProps = {
  /** Volta para a seleção de perfil. */
  onBack?: () => void;
  /** Chamado com o modo escolhido ao tocar em "Continuar". */
  onContinue?: (trainingMode: TrainingMode) => void;
};

type Option = { value: TrainingMode; icon: IconName; title: string; description: string };

const OPTIONS: Option[] = [
  {
    value: 'com_profissional',
    icon: 'handshake',
    title: 'Tenho um profissional',
    description: 'Já tenho um personal ou nutricionista.',
  },
  {
    value: 'sozinho',
    icon: 'exercise',
    title: 'Faço tudo sozinho',
    description: 'Não tenho profissional. Treino e monto minhas dietas sozinho.',
  },
];

/** Etapa do aluno logo após "Sou Aluno": treina com um profissional ou por conta própria. */
export function TrainingModeScreen({ onBack, onContinue }: TrainingModeScreenProps) {
  const { spacing } = useTheme();
  const trainingMode = useOnboardingStore((s) => s.trainingMode);
  const setTrainingMode = useOnboardingStore((s) => s.setTrainingMode);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { paddingHorizontal: spacing[6] },
        options: { marginTop: spacing[8], gap: spacing[3] },
        spacer: { flex: 1 },
        footer: { paddingBottom: spacing[4] },
      }),
    [spacing],
  );

  return (
    <Screen padded={false} style={styles.root}>
      <OnboardingHeader
        overline="Bem-vindo ao MuscleBit"
        title="Como você vai treinar?"
        subtitle="Escolha o perfil que mais combina com você. Dá para ajustar isso depois."
        onBack={onBack}
      />

      <View style={styles.options} accessibilityRole="radiogroup">
        {OPTIONS.map((option) => (
          <OptionCard
            key={option.value}
            icon={option.icon}
            title={option.title}
            description={option.description}
            selected={trainingMode === option.value}
            dimmed={trainingMode !== null && trainingMode !== option.value}
            onPress={() => setTrainingMode(option.value)}
          />
        ))}
      </View>

      <View style={styles.spacer} />

      <View style={styles.footer}>
        <Button
          label="Continuar"
          variant="primary"
          size="lg"
          fullWidth
          disabled={trainingMode === null}
          onPress={() => {
            if (trainingMode !== null) onContinue?.(trainingMode);
          }}
        />
      </View>
    </Screen>
  );
}
