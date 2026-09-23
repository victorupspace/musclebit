import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { Button, RadioOption, Screen, Text, TextField } from '@/shared/components/ui';
import { formatUserId } from '@/shared/utils/format';
import { userIdSchema } from '@/shared/utils/validation';
import { useTheme } from '@/theme';

import { OnboardingHeader } from '../components/OnboardingHeader';
import { useOnboardingStore } from '../store/useOnboardingStore';
import type { ProfessionalLink } from '../types';

export type ProfessionalLinkScreenProps = {
  /** Volta para "Como você vai treinar?". */
  onBack?: () => void;
  /** Chamado com o vínculo válido ao tocar em "Continuar". */
  onContinue?: (link: ProfessionalLink) => void;
};

/** Etapa do aluno com profissional: ele já usa o MuscleBit? Se sim, qual é a ID dele. */
export function ProfessionalLinkScreen({ onBack, onContinue }: ProfessionalLinkScreenProps) {
  const { spacing } = useTheme();
  const saved = useOnboardingStore((s) => s.professionalLink);
  const setProfessionalLink = useOnboardingStore((s) => s.setProfessionalLink);

  const [onApp, setOnApp] = useState<boolean | null>(saved?.onApp ?? null);
  const [professionalId, setProfessionalId] = useState(saved?.onApp ? saved.professionalId : '');
  const [error, setError] = useState<string | undefined>(undefined);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        flex: { flex: 1 },
        content: { flexGrow: 1, paddingHorizontal: spacing[6] },
        choices: { marginTop: spacing[6], flexDirection: 'row', gap: spacing[8] },
        details: { marginTop: spacing[10], gap: spacing[6] },
        spacer: { flex: 1, minHeight: spacing[8] },
        footer: { paddingBottom: spacing[4] },
      }),
    [spacing],
  );

  const validateId = () => {
    const result = userIdSchema.safeParse(professionalId);
    setError(result.success ? undefined : result.error.issues[0]?.message);
    return result.success;
  };

  const canContinue = onApp === false || (onApp === true && professionalId.length > 1);

  const submit = () => {
    if (onApp === null) return;
    const link: ProfessionalLink = onApp ? { onApp, professionalId } : { onApp };
    if (link.onApp && !validateId()) return;
    setProfessionalLink(link);
    onContinue?.(link);
  };

  return (
    <Screen padded={false}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <OnboardingHeader
            overline="Bem-vindo ao MuscleBit"
            title="Agora nos diga..."
            subtitle="O seu profissional, nutricionista ou personal, já usa o MuscleBit?"
            onBack={onBack}
          />

          <View style={styles.choices} accessibilityRole="radiogroup">
            <RadioOption label="Sim" selected={onApp === true} onPress={() => setOnApp(true)} />
            <RadioOption label="Não" selected={onApp === false} onPress={() => setOnApp(false)} />
          </View>

          {onApp ? (
            <View style={styles.details}>
              <Text variant="body" color="textMuted">
                Isso é muito legal. Como ele já utiliza nosso app, nos diga qual:
              </Text>
              <TextField
                label="ID do profissional"
                placeholder="@idprofissional"
                value={professionalId}
                onChangeText={(v) => {
                  setProfessionalId(formatUserId(v));
                  if (error) setError(undefined);
                }}
                onBlur={() => {
                  if (professionalId.length > 1) validateId();
                }}
                error={error}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={submit}
                autoFocus
              />
            </View>
          ) : null}

          <View style={styles.spacer} />

          <View style={styles.footer}>
            <Button
              label="Continuar"
              variant="primary"
              size="lg"
              fullWidth
              disabled={!canContinue}
              onPress={submit}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
