import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { Button, OtpInput, Screen, Text } from '@/shared/components/ui';
import { formatCountdown } from '@/shared/utils/format';
import { useTheme } from '@/theme';

import { AuthHero } from '../components/AuthHero';

export const VERIFICATION_CODE_LENGTH = 6;
/** Tempo até liberar o reenvio do código. */
export const RESEND_COOLDOWN_SECONDS = 45;

export type VerifyCodeScreenProps = {
  /** Destino já mascarado, ex.: "jo***@email.com". */
  destination: string;
  onBack?: () => void;
  /** Chamado com o código completo ao tocar em "Verificar" (ou ao preencher o último dígito). */
  onVerify?: (code: string) => void;
  onResend?: () => void;
  /** Erro vindo da verificação (código inválido, expirado). */
  error?: string;
};

/** Recuperação de senha, etapa 2: código de 6 dígitos enviado por e-mail. */
export function VerifyCodeScreen({
  destination,
  onBack,
  onVerify,
  onResend,
  error,
}: VerifyCodeScreenProps) {
  const { spacing } = useTheme();
  const [code, setCode] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        flex: { flex: 1 },
        content: { flexGrow: 1 },
        body: { paddingHorizontal: spacing[6], paddingTop: spacing[6], gap: spacing[6] },
        resend: {
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: spacing[2],
        },
        spacer: { flex: 1, minHeight: spacing[8] },
        footer: { paddingHorizontal: spacing[6], paddingBottom: spacing[4] },
      }),
    [spacing],
  );

  const canSubmit = code.length === VERIFICATION_CODE_LENGTH;
  const submit = () => {
    if (canSubmit) onVerify?.(code);
  };
  const resend = () => {
    setCode('');
    setSecondsLeft(RESEND_COOLDOWN_SECONDS);
    onResend?.();
  };

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
          <AuthHero title="Confira seu e-mail" onBack={onBack} />

          <View style={styles.body}>
            <Text variant="body" color="textMuted">
              {`Enviamos um código de ${VERIFICATION_CODE_LENGTH} dígitos para ${destination}.`}
            </Text>

            <OtpInput
              value={code}
              onChange={setCode}
              length={VERIFICATION_CODE_LENGTH}
              onComplete={(full) => onVerify?.(full)}
              error={error}
              autoFocus
            />

            {secondsLeft > 0 ? (
              <View style={styles.resend} accessibilityLiveRegion="polite">
                <Text variant="body" color="textSubtle">
                  Reenviar código em
                </Text>
                <Text variant="bodyStrong" color="primary">
                  {formatCountdown(secondsLeft)}
                </Text>
              </View>
            ) : (
              <Pressable
                accessibilityRole="link"
                onPress={resend}
                style={styles.resend}
                hitSlop={spacing[2]}
              >
                <Text variant="link" color="primary">
                  Reenviar código
                </Text>
              </Pressable>
            )}
          </View>

          <View style={styles.spacer} />

          <View style={styles.footer}>
            <Button
              label="Verificar"
              variant="primary"
              size="lg"
              fullWidth
              disabled={!canSubmit}
              onPress={submit}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
