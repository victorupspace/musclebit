import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { AnimatedCheckBadge, Button, Icon, Screen, Text } from '@/shared/components/ui';
import { useTheme } from '@/theme';

export type SuccessLayoutProps = {
  /** Texto da pílula acima do título (ex.: "Tudo pronto"). */
  badge: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  onCta?: () => void;
};

/**
 * Tela cheia de confirmação sobre navy: badge animado, pílula, título, subtítulo e CTA claro.
 * Os textos entram depois que o check terminou de se desenhar.
 */
export function SuccessLayout({ badge, title, subtitle, ctaLabel, onCta }: SuccessLayoutProps) {
  const { colors, motion, radius, sizes, spacing } = useTheme();
  const reducedMotion = useReducedMotion();
  const reveal = useSharedValue(reducedMotion ? 1 : 0);

  useEffect(() => {
    if (reducedMotion) return;
    const delay = motion.celebrate.stagger * 3 + motion.celebrate.draw;
    reveal.set(
      withDelay(
        delay,
        withTiming(1, { duration: motion.duration.slow, easing: Easing.out(Easing.cubic) }),
      ),
    );
  }, [motion, reducedMotion, reveal]);

  const revealStyle = useAnimatedStyle(() => ({
    opacity: reveal.get(),
    transform: [{ translateY: (1 - reveal.get()) * spacing[4] }],
  }));

  const styles = useMemo(() => {
    const unit = sizes.controlHeight.md;
    return StyleSheet.create({
      root: { paddingHorizontal: spacing[6], overflow: 'hidden' },
      ring: {
        position: 'absolute',
        top: -unit * 2,
        left: -unit * 2,
        width: unit * 8,
        height: unit * 8,
        borderRadius: radius.full,
        borderWidth: sizes.borderWidth.hairline,
        borderColor: colors.onPrimarySubtle,
      },
      disc: {
        position: 'absolute',
        bottom: -unit * 2,
        right: -unit * 3,
        width: unit * 8,
        height: unit * 8,
        borderRadius: radius.full,
        backgroundColor: colors.onPrimarySubtle,
      },
      hero: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing[6] },
      texts: { alignItems: 'center', gap: spacing[4] },
      // Sem gap: a entrelinha do display (40 para 28pt) já deixa ar entre título e subtítulo.
      copy: { alignItems: 'center', gap: spacing[0] },
      pill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[2],
        height: sizes.controlHeight.sm,
        paddingHorizontal: spacing[5],
        borderRadius: radius.full,
        backgroundColor: colors.onPrimarySubtle,
      },
      footer: { paddingBottom: spacing[4] },
    });
  }, [colors, radius.full, sizes, spacing]);

  return (
    <Screen padded={false} background="brand" style={styles.root}>
      <StatusBar style="light" />
      <View style={styles.ring} pointerEvents="none" />
      <View style={styles.disc} pointerEvents="none" />

      <View style={styles.hero}>
        <AnimatedCheckBadge />
        <Animated.View style={[styles.texts, revealStyle]}>
          <View style={styles.pill}>
            <Icon name="kid_star" size="sm" color="onPrimary" />
            <Text variant="label" color="onPrimary">
              {badge}
            </Text>
          </View>
          <View style={styles.copy}>
            <Text variant="display" color="onPrimary" align="center">
              {title}
            </Text>
            <Text variant="body" color="onPrimaryMuted" align="center">
              {subtitle}
            </Text>
          </View>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <Button label={ctaLabel} variant="inverse" size="lg" fullWidth onPress={onCta} />
      </View>
    </Screen>
  );
}
