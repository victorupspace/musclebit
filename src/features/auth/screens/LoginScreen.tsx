import { zodResolver } from '@hookform/resolvers/zod';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { Button, Divider, Screen, Text, TextField } from '@/shared/components/ui';
import { useTheme } from '@/theme';

import { AuthHero } from '../components/AuthHero';
import { SocialButton, type SocialProvider } from '../components/SocialButton';
import { type LoginForm, loginSchema } from '../schemas/login';

export type LoginScreenProps = {
  /** Chamado com e-mail/ID e senha válidos. A autenticação entra quando o Supabase existir. */
  onLogin?: (values: LoginForm) => void;
  onForgotPassword?: () => void;
  onSocialLogin?: (provider: SocialProvider) => void;
  /** "Criar conta": volta ao início do cadastro. */
  onSignup?: () => void;
};

/** Entrada na conta: herói navy, e-mail ou ID + senha, login social e link para o cadastro. */
export function LoginScreen({
  onLogin,
  onForgotPassword,
  onSocialLogin,
  onSignup,
}: LoginScreenProps) {
  const { spacing } = useTheme();

  const { control, handleSubmit } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: { identifier: '', password: '' },
  });

  const styles = useMemo(
    () =>
      StyleSheet.create({
        flex: { flex: 1 },
        content: { flexGrow: 1 },
        body: { paddingHorizontal: spacing[6], paddingTop: spacing[5], gap: spacing[4] },
        forgot: { alignSelf: 'flex-end' },
        divider: { marginVertical: spacing[2] },
        social: { gap: spacing[3] },
        spacer: { flex: 1, minHeight: spacing[8] },
        footer: {
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: spacing[2],
          paddingBottom: spacing[4],
        },
      }),
    [spacing],
  );

  const submit = handleSubmit((values) => onLogin?.(values));

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
          <AuthHero overline="Bem-vindo de volta" title="Entrar na sua conta" />

          <View style={styles.body}>
            <Text variant="body" color="textMuted">
              Acesse para continuar seu treino e manter sua sequência viva.
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
                  returnKeyType="next"
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field, fieldState }) => (
                <TextField
                  label="Senha"
                  placeholder="Sua senha"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="current-password"
                  textContentType="password"
                  returnKeyType="done"
                  onSubmitEditing={submit}
                />
              )}
            />

            <Pressable
              accessibilityRole="link"
              onPress={onForgotPassword}
              style={styles.forgot}
              hitSlop={spacing[2]}
            >
              <Text variant="link" color="primary">
                Esqueci minha senha
              </Text>
            </Pressable>

            <Button label="Entrar" variant="primary" size="lg" fullWidth onPress={submit} />

            <View style={styles.divider}>
              <Divider label="ou" />
            </View>

            <View style={styles.social}>
              <SocialButton provider="google" onPress={() => onSocialLogin?.('google')} />
              <SocialButton provider="apple" onPress={() => onSocialLogin?.('apple')} />
            </View>
          </View>

          <View style={styles.spacer} />

          <View style={styles.footer}>
            <Text variant="body" color="textSubtle">
              Não tem conta?
            </Text>
            <Pressable accessibilityRole="link" onPress={onSignup} hitSlop={spacing[2]}>
              <Text variant="link" color="primary">
                Criar conta
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
