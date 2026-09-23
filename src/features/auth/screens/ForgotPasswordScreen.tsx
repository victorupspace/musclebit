import { zodResolver } from '@hookform/resolvers/zod';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { Button, Screen, Text, TextField } from '@/shared/components/ui';
import { useTheme } from '@/theme';

import { AuthHero } from '../components/AuthHero';
import { type ForgotPasswordForm, forgotPasswordSchema } from '../schemas/login';

export type ForgotPasswordScreenProps = {
  onBack?: () => void;
  /** Chamado com o e-mail ou ID válido. O envio do código entra quando o Supabase existir. */
  onSendCode?: (identifier: string) => void;
};

/** Recuperação de senha, etapa 1: informar e-mail ou ID para receber o código. */
export function ForgotPasswordScreen({ onBack, onSendCode }: ForgotPasswordScreenProps) {
  const { spacing } = useTheme();

  const { control, handleSubmit } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onBlur',
    defaultValues: { identifier: '' },
  });

  const styles = useMemo(
    () =>
      StyleSheet.create({
        flex: { flex: 1 },
        content: { flexGrow: 1 },
        body: { paddingHorizontal: spacing[6], paddingTop: spacing[6], gap: spacing[5] },
        spacer: { flex: 1, minHeight: spacing[8] },
        footer: { paddingHorizontal: spacing[6], paddingBottom: spacing[4] },
      }),
    [spacing],
  );

  const submit = handleSubmit((values) => onSendCode?.(values.identifier));

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
          <AuthHero title="Esqueci a senha" onBack={onBack} />

          <View style={styles.body}>
            <Text variant="body" color="textMuted">
              Informe seu e-mail ou ID de usuário. Vamos enviar um código de verificação.
            </Text>
            <Controller
              control={control}
              name="identifier"
              render={({ field, fieldState }) => (
                <TextField
                  label="E-mail ou ID de usuário"
                  placeholder="seu@email.com ou @usuario"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="username"
                  textContentType="username"
                  returnKeyType="send"
                  onSubmitEditing={submit}
                  autoFocus
                />
              )}
            />
          </View>

          <View style={styles.spacer} />

          <View style={styles.footer}>
            <Button label="Enviar código" variant="primary" size="lg" fullWidth onPress={submit} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
