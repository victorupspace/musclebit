import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { Button, Screen, Select, TextField } from '@/shared/components/ui';
import { formatPhoneBR, formatUserId } from '@/shared/utils/format';
import { useTheme } from '@/theme';

import { AvatarPicker } from '../components/AvatarPicker';
import { SignupHeader } from '../components/SignupHeader';
import {
  GENDER_OPTIONS,
  type StudentProfile,
  type StudentProfileForm,
  studentProfileSchema,
} from '../schemas/studentProfile';
import { useSignupStore } from '../store/useSignupStore';

export const STUDENT_SIGNUP_STEPS = 2;

export type StudentProfileScreenProps = {
  onBack?: () => void;
  /** Chamado com os dados válidos e normalizados ao tocar em "Continuar". */
  onContinue?: (profile: StudentProfile) => void;
};

/** Etapa 1 de 2 do cadastro do aluno: foto opcional e dados essenciais. */
export function StudentProfileScreen({ onBack, onContinue }: StudentProfileScreenProps) {
  const { spacing } = useTheme();
  const photoUri = useSignupStore((s) => s.photoUri);
  const setStudentProfile = useSignupStore((s) => s.setStudentProfile);
  const saved = useSignupStore((s) => s.studentProfile);

  const { control, handleSubmit } = useForm<StudentProfileForm, unknown, StudentProfile>({
    resolver: zodResolver(studentProfileSchema),
    mode: 'onBlur',
    defaultValues: {
      fullName: saved?.fullName ?? '',
      gender: saved?.gender,
      userId: saved?.userId ?? '',
      phone: saved ? formatPhoneBR(saved.phone) : '',
      email: saved?.email ?? '',
    },
  });

  const styles = useMemo(
    () =>
      StyleSheet.create({
        flex: { flex: 1 },
        content: { flexGrow: 1, paddingHorizontal: spacing[6] },
        avatar: { marginTop: spacing[6] },
        form: { marginTop: spacing[6], gap: spacing[5] },
        spacer: { flex: 1, minHeight: spacing[8] },
        footer: { paddingBottom: spacing[4] },
      }),
    [spacing],
  );

  const submit = handleSubmit((profile) => {
    setStudentProfile(profile);
    onContinue?.(profile);
  });

  return (
    <Screen padded={false}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <SignupHeader
            step={1}
            totalSteps={STUDENT_SIGNUP_STEPS}
            title="Cadastro"
            subtitle="Insira as informações abaixo para continuar."
            onBack={onBack}
          />

          <View style={styles.avatar}>
            <AvatarPicker uri={photoUri} />
          </View>

          <View style={styles.form}>
            <Controller
              control={control}
              name="fullName"
              render={({ field, fieldState }) => (
                <TextField
                  label="Nome completo"
                  placeholder="Seu nome completo"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                  autoCapitalize="words"
                  autoComplete="name"
                  textContentType="name"
                  returnKeyType="next"
                />
              )}
            />
            <Controller
              control={control}
              name="gender"
              render={({ field, fieldState }) => (
                <Select
                  label="Qual o seu gênero?"
                  options={GENDER_OPTIONS}
                  value={field.value ?? null}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="userId"
              render={({ field, fieldState }) => (
                <TextField
                  label="Escolha uma ID"
                  placeholder="@minhaid"
                  value={field.value}
                  onChangeText={(v) => field.onChange(formatUserId(v))}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                />
              )}
            />
            <Controller
              control={control}
              name="phone"
              render={({ field, fieldState }) => (
                <TextField
                  label="Telefone"
                  placeholder="(11) 99999-9999"
                  value={field.value}
                  onChangeText={(v) => field.onChange(formatPhoneBR(v))}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  textContentType="telephoneNumber"
                  returnKeyType="next"
                />
              )}
            />
            <Controller
              control={control}
              name="email"
              render={({ field, fieldState }) => (
                <TextField
                  label="E-mail"
                  placeholder="seu@email.com"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                  returnKeyType="done"
                  onSubmitEditing={submit}
                />
              )}
            />
          </View>

          <View style={styles.spacer} />

          <View style={styles.footer}>
            <Button label="Continuar" variant="primary" size="lg" fullWidth onPress={submit} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
