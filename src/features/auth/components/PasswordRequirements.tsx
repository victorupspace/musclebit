import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Icon, Text } from '@/shared/components/ui';
import { useTheme } from '@/theme';

import { PASSWORD_RULES } from '../schemas/password';

export type PasswordRequirementsProps = {
  password: string;
};

/** Checklist dos requisitos da senha, avaliado a cada tecla. */
export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const { colors, radius, sizes, spacing } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { gap: spacing[3] },
        title: { marginBottom: spacing[1] },
        row: { flexDirection: 'row', alignItems: 'center', gap: spacing[3] },
        badge: {
          width: sizes.icon.md,
          height: sizes.icon.md,
          borderRadius: radius.full,
          alignItems: 'center',
          justifyContent: 'center',
        },
        pass: { backgroundColor: colors.success },
        fail: { backgroundColor: colors.danger },
      }),
    [colors.danger, colors.success, radius.full, sizes.icon.md, spacing],
  );

  return (
    <View style={styles.root} accessibilityRole="list">
      <Text variant="bodyStrong" style={styles.title}>
        Sua senha deve conter ao menos
      </Text>
      {PASSWORD_RULES.map((rule) => {
        const ok = rule.test(password);
        return (
          <View
            key={rule.key}
            style={styles.row}
            accessibilityLabel={`${rule.label}: ${ok ? 'atendido' : 'pendente'}`}
          >
            <View style={[styles.badge, ok ? styles.pass : styles.fail]}>
              <Icon name={ok ? 'check' : 'close'} size="sm" color="onAccent" />
            </View>
            <Text variant="body">{rule.label}</Text>
          </View>
        );
      })}
    </View>
  );
}
