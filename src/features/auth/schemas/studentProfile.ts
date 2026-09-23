import { z } from 'zod';

import { userIdSchema } from '@/shared/utils/validation';

import type { Gender } from '../types';

export const GENDER_OPTIONS: readonly { value: Gender; label: string }[] = [
  { value: 'feminino', label: 'Feminino' },
  { value: 'masculino', label: 'Masculino' },
  { value: 'nao_binario', label: 'Não-binário' },
  { value: 'nao_informar', label: 'Prefiro não informar' },
];

const genderValues = GENDER_OPTIONS.map((o) => o.value) as [Gender, ...Gender[]];

/** Etapa 1 do cadastro do aluno: dados essenciais. */
export const studentProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, 'Informe seu nome completo')
    .refine((v) => v.split(/\s+/).length >= 2, 'Informe nome e sobrenome'),
  gender: z.enum(genderValues, { message: 'Escolha uma opção' }),
  userId: userIdSchema,
  phone: z
    .string()
    .transform((v) => v.replace(/\D/g, ''))
    .refine((v) => v.length === 10 || v.length === 11, 'Informe um telefone com DDD'),
  email: z.email('Informe um e-mail válido'),
});

/** Valores do formulário antes da validação (gênero ainda pode estar vazio). */
export type StudentProfileForm = z.input<typeof studentProfileSchema>;
/** Valores válidos e normalizados (telefone só com dígitos). */
export type StudentProfile = z.output<typeof studentProfileSchema>;
