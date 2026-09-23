import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, type IconName, OptionCard, Screen } from '@/shared/components/ui';
import { useTheme } from '@/theme';

import { OnboardingHeader } from '../components/OnboardingHeader';
import { useOnboardingStore } from '../store/useOnboardingStore';
import type { ProfileType } from '../types';

export type ProfileTypeScreenProps = {
  /** Volta para a tela de boas-vindas. */
  onBack?: () => void;
  /** Chamado com o perfil escolhido ao tocar em "Continuar". */
  onContinue?: (profileType: ProfileType) => void;
};

type Option = { value: ProfileType; icon: IconName; title: string; description: string };

const OPTIONS: Option[] = [
  {
    value: 'aluno',
    icon: 'accessibility_new',
    title: 'Sou Aluno',
    description: 'Quero seguir treinos e dietas e evoluir todo dia.',
  },
  {
    value: 'profissional',
    icon: 'assignment',
    title: 'Sou Profissional',
    description: 'Sou nutricionista ou personal trainer e quero atender meus alunos pelo app.',
  },
];

/** Primeiro passo do cadastro: escolha entre perfil de aluno e de profissional. */
export function ProfileTypeScreen({ onBack, onContinue }: ProfileTypeScreenProps) {
  const { spacing } = useTheme();
  const profileType = useOnboardingStore((s) => s.profileType);
  const setProfileType = useOnboardingStore((s) => s.setProfileType);

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
        title="Como você vai usar o MuscleBit?"
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
            selected={profileType === option.value}
            dimmed={profileType !== null && profileType !== option.value}
            onPress={() => setProfileType(option.value)}
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
          disabled={profileType === null}
          onPress={() => {
            if (profileType !== null) onContinue?.(profileType);
          }}
        />
      </View>
    </Screen>
  );
}
