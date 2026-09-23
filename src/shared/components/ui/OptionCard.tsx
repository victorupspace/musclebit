import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';

import { Icon, type IconName } from './Icon';
import { Radio } from './Radio';
import { Text, type TextColor } from './Text';

export type OptionCardProps = {
  icon: IconName;
  title: string;
  description: string;
  /** Esta opção é a escolhida: card em navy com textos claros. */
  selected: boolean;
  /** Outra opção foi escolhida: esta fica apagada (textos e ícone em cinza). */
  dimmed?: boolean;
  onPress: () => void;
};

type Tone = { title: TextColor; description: TextColor; icon: TextColor };

function resolveTone(selected: boolean, dimmed: boolean): Tone {
  if (selected) return { title: 'onPrimary', description: 'onPrimaryMuted', icon: 'onPrimary' };
  if (dimmed) return { title: 'textSubtle', description: 'textSubtle', icon: 'textSubtle' };
  return { title: 'text', description: 'textMuted', icon: 'primary' };
}

/**
 * Card de escolha única com ícone, título, descrição e rádio. Usado em listas onde só uma opção
 * pode ser marcada (perfil, atuação, planos). O pai controla `selected` e `dimmed`.
 */
export function OptionCard({
  icon,
  title,
  description,
  selected,
  dimmed = false,
  onPress,
}: OptionCardProps) {
  const { colors, radius, sizes, spacing } = useTheme();
  const tone = resolveTone(selected, dimmed);

  const styles = useMemo(() => {
    const iconBox = sizes.controlHeight.md;
    return StyleSheet.create({
      card: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[4],
        padding: spacing[5],
        borderRadius: radius.xl,
        borderWidth: sizes.borderWidth.hairline,
        borderColor: selected ? colors.primary : colors.border,
        backgroundColor: selected ? colors.primary : colors.surface,
      },
      pressed: { backgroundColor: selected ? colors.primary : colors.secondary },
      iconBox: {
        width: iconBox,
        height: iconBox,
        borderRadius: radius.md,
        backgroundColor: selected
          ? colors.onPrimarySubtle
          : dimmed
            ? colors.secondary
            : colors.primarySubtle,
        alignItems: 'center',
        justifyContent: 'center',
      },
      body: { flex: 1, gap: spacing[1] },
    });
  }, [colors, dimmed, radius, selected, sizes, spacing]);

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${title}. ${description}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.iconBox}>
        <Icon name={icon} color={tone.icon} size="lg" />
      </View>
      <View style={styles.body}>
        <Text variant="heading" color={tone.title}>
          {title}
        </Text>
        <Text variant="body" color={tone.description}>
          {description}
        </Text>
      </View>
      <Radio selected={selected} tone={selected ? 'onPrimary' : 'primary'} />
    </Pressable>
  );
}
