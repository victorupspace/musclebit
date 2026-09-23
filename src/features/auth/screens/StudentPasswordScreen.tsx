import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { Button, PasswordField, Screen } from '@/shared/components/ui';
import { useTheme } from '@/theme';

import { STUDENT_SIGNUP_STEPS } from './StudentProfileScreen';
import { PasswordRequirements } from '../components/PasswordRequirements';
import { SignupHeader } from '../components/SignupHeader';
import { type PasswordForm, passwordSchema } from '../schemas/password';

export type StudentPasswordScreenProps = {
  onBack?: () => void;
  /** Chamado com a senha válida. Ela não fica na store: vai direto para a criação da conta. */
  onContinue?: (password: string) => void;
};

/** Etapa 2 de 2 do cadastro do aluno: senha e confirmação. */
export function StudentPasswordScreen({ onBack, onContinue }: StudentPasswordScreenProps) {
  const { spacing } = useTheme();

  const { control, handleSubmit } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    mode: 'onBlur',
    defaultValues: { password: '', confirmPassword: '' },
  });
  const password = useWatch({ control, name: 'password' });

  const styles = useMemo(
    () =>
      StyleSheet.create({
        flex: { flex: 1 },
        content: { flexGrow: 1, paddingHorizontal: spacing[6] },
        form: { marginTop: spacing[8], gap: spacing[5] },
        requirements: { marginTop: spacing[8] },
        spacer: { flex: 1, minHeight: spacing[8] },
        footer: { paddingBottom: spacing[4] },
      }),
    [spacing],
  );

  const submit = handleSubmit((values) => onContinue?.(values.password));

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
          <SignupHeader
            step={2}
            totalSteps={STUDENT_SIGNUP_STEPS}
            title="Agora escolha uma senha"
            subtitle="Só o essencial para começar. Dá para editar depois."
            onBack={onBack}
          />

          <View style={styles.form}>
            <Controller
              control={control}
              name="password"
              render={({ field, fieldState }) => (
                <PasswordField
                  label="Crie sua senha"
                  placeholder="Mínimo de 8 caracteres"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                  textContentType="newPassword"
                  autoComplete="new-password"
                  returnKeyType="next"
                />
              )}
            />
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <PasswordField
                  label="Informe sua senha novamente"
                  placeholder="Repita a senha"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                  textContentType="newPassword"
                  autoComplete="new-password"
                  returnKeyType="done"
                  onSubmitEditing={submit}
                />
              )}
            />
          </View>

          <View style={styles.requirements}>
            <PasswordRequirements password={password} />
          </View>

          <View style={styles.spacer} />

          <View style={styles.footer}>
            <Button label="Continuar" variant="primary" size="lg" fullWidth onPress={submit} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
