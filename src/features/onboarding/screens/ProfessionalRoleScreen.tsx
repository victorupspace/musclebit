import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, type IconName, OptionCard, Screen } from '@/shared/components/ui';
import { useTheme } from '@/theme';

import { OnboardingHeader } from '../components/OnboardingHeader';
import { useOnboardingStore } from '../store/useOnboardingStore';
import type { ProfessionalRole } from '../types';

export type ProfessionalRoleScreenProps = {
  /** Volta para a seleção de perfil. */
  onBack?: () => void;
  /** Chamado com a atuação escolhida ao tocar em "Continuar". */
  onContinue?: (role: ProfessionalRole) => void;
};

type Option = { value: ProfessionalRole; icon: IconName; title: string; description: string };

const OPTIONS: Option[] = [
  {
    value: 'nutricionista',
    icon: 'nutrition',
    title: 'Nutricionista',
    description: 'Monte planos alimentares e acompanhe a adesão dos seus alunos.',
  },
  {
    value: 'personal',
    icon: 'exercise',
    title: 'Personal Trainer',
    description: 'Monte treinos e acompanhe a evolução de cada aluno.',
  },
  {
    value: 'personal_nutricionista',
    icon: 'ecg_heart',
    title: 'Personal + Nutricionista',
    description: 'Treino e dieta em um só lugar para atender seus alunos.',
  },
];

/** Segundo passo do cadastro profissional: qual é a atuação. */
export function ProfessionalRoleScreen({ onBack, onContinue }: ProfessionalRoleScreenProps) {
  const { spacing } = useTheme();
  const role = useOnboardingStore((s) => s.professionalRole);
  const setRole = useOnboardingStore((s) => s.setProfessionalRole);

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
        overline="Profissional"
        title="Qual é a sua atuação?"
        subtitle="Isso define as ferramentas que você vai ter no backoffice."
        onBack={onBack}
      />

      <View style={styles.options} accessibilityRole="radiogroup">
        {OPTIONS.map((option) => (
          <OptionCard
            key={option.value}
            icon={option.icon}
            title={option.title}
            description={option.description}
            selected={role === option.value}
            dimmed={role !== null && role !== option.value}
            onPress={() => setRole(option.value)}
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
          disabled={role === null}
          onPress={() => {
            if (role !== null) onContinue?.(role);
          }}
        />
      </View>
    </Screen>
  );
}
