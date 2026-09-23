import { zodResolver } from '@hookform/resolvers/zod';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { Button, Screen, Text, TextField } from '@/shared/components/ui';
import { useTheme } from '@/theme';

import { AuthHero } from '../components/AuthHero';
import { PasswordRequirements } from '../components/PasswordRequirements';
import { type PasswordForm, passwordSchema } from '../schemas/password';

export type ResetPasswordScreenProps = {
  onBack?: () => void;
  /** Chamado com a nova senha válida. A troca real entra com o Supabase. */
  onReset?: (password: string) => void;
};

/** Recuperação de senha, etapa 3: definir a nova senha após o código validado. */
export function ResetPasswordScreen({ onBack, onReset }: ResetPasswordScreenProps) {
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
        content: { flexGrow: 1 },
        body: { paddingHorizontal: spacing[6], paddingTop: spacing[6], gap: spacing[5] },
        requirements: { paddingHorizontal: spacing[6], marginTop: spacing[6] },
        spacer: { flex: 1, minHeight: spacing[8] },
        footer: { paddingHorizontal: spacing[6], paddingBottom: spacing[4] },
      }),
    [spacing],
  );

  const submit = handleSubmit((values) => onReset?.(values.password));

  return (
    <Screen padded={false} edges={['bottom', 'left', 'right']}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthHero title="Crie uma nova senha" onBack={onBack} />

          <View style={styles.body}>
            <Text variant="body" color="textMuted">
              Escolha uma senha forte para manter sua conta segura.
            </Text>
            <Controller
              control={control}
              name="password"
              render={({ field, fieldState }) => (
                <TextField
                  label="Nova senha"
                  placeholder="Mínimo de 8 caracteres"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="newPassword"
                  autoComplete="new-password"
                  returnKeyType="next"
                  autoFocus
                />
              )}
            />
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <TextField
                  label="Confirmar nova senha"
                  placeholder="Repita a nova senha"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
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
            <Button
              label="Redefinir senha"
              variant="primary"
              size="lg"
              fullWidth
              onPress={submit}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
