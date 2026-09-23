import { useMemo } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { Icon, Text } from '@/shared/components/ui';
import { useTheme } from '@/theme';

export type AvatarPickerProps = {
  /** URI da foto escolhida; sem valor, mostra a câmera. */
  uri: string | null;
  /** Abre a escolha de foto. Ainda sem biblioteca de imagem: ligar quando ela entrar. */
  onPress?: () => void;
};

/** Círculo com a foto (ou câmera) e a ação "Adicionar foto" abaixo. */
export function AvatarPicker({ uri, onPress }: AvatarPickerProps) {
  const { colors, radius, sizes, spacing } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { alignItems: 'center', gap: spacing[4] },
        circle: {
          width: sizes.avatar.lg,
          height: sizes.avatar.lg,
          borderRadius: radius.full,
          backgroundColor: colors.secondary,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        },
        pressed: { backgroundColor: colors.secondaryPressed },
        image: { width: '100%', height: '100%' },
      }),
    [colors, radius.full, sizes.avatar.lg, spacing],
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={uri ? 'Trocar foto' : 'Adicionar foto'}
      onPress={onPress}
      style={styles.root}
    >
      {({ pressed }) => (
        <>
          <View style={[styles.circle, pressed && styles.pressed]}>
            {uri ? (
              <Image source={{ uri }} style={styles.image} accessibilityIgnoresInvertColors />
            ) : (
              <Icon name="photo_camera" color="primary" size="lg" />
            )}
          </View>
          <Text variant="link" color="primary">
            {uri ? 'Trocar foto' : 'Adicionar foto'}
          </Text>
        </>
      )}
    </Pressable>
  );
}
