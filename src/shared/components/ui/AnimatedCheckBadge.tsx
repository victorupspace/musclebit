import { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { useTheme } from '@/theme';

const AnimatedPath = Animated.createAnimatedComponent(Path);

/** Caminho do check num viewBox 48×48 e seu comprimento aproximado, para o traço "se desenhar". */
const CHECK_PATH = 'M12 24.5 L21 33 L36.5 15.5';
const CHECK_LENGTH = 36.5;

export type AnimatedCheckBadgeProps = {
  /** Diâmetro externo. Padrão: `sizes.badge.lg`. */
  size?: number;
};

/**
 * Badge de sucesso: disco de fundo, círculo de celebração que entra com mola, check que se desenha
 * e um anel que se dissipa. Com "reduzir movimento", aparece direto no estado final.
 */
export function AnimatedCheckBadge({ size }: AnimatedCheckBadgeProps) {
  const { colors, motion, radius, sizes } = useTheme();
  const reducedMotion = useReducedMotion();
  const outer = size ?? sizes.badge.lg;
  const inner = outer * 0.74;
  const stroke = Math.max(sizes.borderWidth.thick, Math.round(outer / 26));

  const disc = useSharedValue(reducedMotion ? 1 : 0);
  const circle = useSharedValue(reducedMotion ? 1 : 0);
  const draw = useSharedValue(reducedMotion ? 1 : 0);
  const ripple = useSharedValue(reducedMotion ? 1 : 0);

  useEffect(() => {
    if (reducedMotion) return;
    const { stagger, draw: drawMs, ripple: rippleMs } = motion.celebrate;
    disc.set(withTiming(1, { duration: motion.duration.slow, easing: Easing.out(Easing.cubic) }));
    circle.set(withDelay(stagger, withSpring(1, { damping: 12, stiffness: 160, mass: 0.9 })));
    draw.set(
      withDelay(stagger * 3, withTiming(1, { duration: drawMs, easing: Easing.out(Easing.cubic) })),
    );
    ripple.set(
      withDelay(
        stagger * 3 + drawMs * 0.6,
        withSequence(
          withTiming(0.001, { duration: 0 }),
          withTiming(1, { duration: rippleMs, easing: Easing.out(Easing.quad) }),
        ),
      ),
    );
  }, [circle, disc, draw, motion, reducedMotion, ripple]);

  const discStyle = useAnimatedStyle(() => ({
    opacity: disc.get(),
    transform: [{ scale: 0.7 + 0.3 * disc.get() }],
  }));
  const circleStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, circle.get() * 2),
    transform: [{ scale: circle.get() }],
  }));
  const rippleStyle = useAnimatedStyle(() => {
    const p = ripple.get();
    return {
      opacity: p === 0 ? 0 : (1 - p) * 0.9,
      transform: [{ scale: 1 + p * 0.25 }],
    };
  });
  const checkProps = useAnimatedProps(() => ({
    strokeDashoffset: CHECK_LENGTH * (1 - draw.get()),
  }));

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { width: outer, height: outer, alignItems: 'center', justifyContent: 'center' },
        fill: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
        disc: {
          borderRadius: radius.full,
          backgroundColor: colors.onPrimarySubtle,
          borderWidth: sizes.borderWidth.hairline,
          borderColor: colors.celebrate,
        },
        ripple: {
          borderRadius: radius.full,
          borderWidth: sizes.borderWidth.thick,
          borderColor: colors.celebrate,
        },
        circle: {
          width: inner,
          height: inner,
          borderRadius: radius.full,
          backgroundColor: colors.celebrate,
          alignItems: 'center',
          justifyContent: 'center',
        },
      }),
    [colors, inner, outer, radius.full, sizes.borderWidth],
  );

  return (
    <View style={styles.root} accessibilityRole="image" accessibilityLabel="Concluído">
      <Animated.View style={[styles.fill, styles.disc, discStyle]} />
      <Animated.View style={[styles.fill, styles.ripple, rippleStyle]} />
      <Animated.View style={[styles.circle, circleStyle]}>
        <Svg width={inner * 0.5} height={inner * 0.5} viewBox="0 0 48 48">
          <AnimatedPath
            d={CHECK_PATH}
            stroke={colors.onCelebrate}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            strokeDasharray={CHECK_LENGTH}
            animatedProps={checkProps}
          />
        </Svg>
      </Animated.View>
    </View>
  );
}
