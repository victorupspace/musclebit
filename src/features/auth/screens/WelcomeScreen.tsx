import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button, Divider, Screen, Text } from '@/shared/components/ui';
import { useTheme } from '@/theme';

import { BrandLockup } from '../components/BrandLockup';
import { SocialButton, type SocialProvider } from '../components/SocialButton';

export type WelcomeScreenProps = {
  /** "Começar agora": inicia o cadastro. */
  onStart?: () => void;
  /** Google ou Apple: entra ou cria conta pelo provedor. */
  onSocialLogin?: (provider: SocialProvider) => void;
  /** "Já tenho uma conta": vai para o login. */
  onLogin?: () => void;
};

/** Primeira tela para quem está desconectado: marca no alto, ações de entrada na base. */
export function WelcomeScreen({ onStart, onSocialLogin, onLogin }: WelcomeScreenProps) {
  const { spacing } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { paddingHorizontal: spacing[6] },
        hero: { flex: 1, justifyContent: 'center' },
        actions: { gap: spacing[3] },
        divider: { marginTop: spacing[6] },
        login: { alignSelf: 'center', marginTop: spacing[6], marginBottom: spacing[6] },
      }),
    [spacing],
  );

  return (
    <Screen padded={false} style={styles.root}>
      <View style={styles.hero}>
        <BrandLockup tagline="Progresso gratuito e divertido." />
      </View>

      <View style={styles.actions}>
        <Button label="Começar agora" variant="primary" size="lg" fullWidth onPress={onStart} />
        <SocialButton provider="google" onPress={() => onSocialLogin?.('google')} />
        <SocialButton provider="apple" onPress={() => onSocialLogin?.('apple')} />
      </View>

      <View style={styles.divider}>
        <Divider label="ou" />
      </View>

      <Pressable
        accessibilityRole="link"
        onPress={onLogin}
        style={styles.login}
        hitSlop={spacing[2]}
      >
        <Text variant="link" color="primary">
          Já tenho uma conta
        </Text>
      </Pressable>
    </Screen>
  );
}
