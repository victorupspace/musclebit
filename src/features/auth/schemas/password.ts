import { z } from 'zod';

export type PasswordRule = {
  key: string;
  label: string;
  test: (password: string) => boolean;
};

/** Regras exibidas no checklist e aplicadas na validação. Uma fonte só para as duas coisas. */
export const PASSWORD_RULES: readonly PasswordRule[] = [
  { key: 'length', label: '8 caracteres', test: (p) => p.length >= 8 },
  {
    key: 'case',
    label: '1 letra maiúscula e 1 minúscula',
    test: (p) => /[a-z]/.test(p) && /[A-Z]/.test(p),
  },
  {
    key: 'special',
    label: '1 caractere especial (@, #, $, %...)',
    test: (p) => /[^A-Za-z0-9\s]/.test(p),
  },
  { key: 'digit', label: '1 caractere numeral', test: (p) => /\d/.test(p) },
];

export const passwordSchema = z
  .object({
    password: z
      .string()
      .refine((p) => PASSWORD_RULES.every((r) => r.test(p)), 'A senha não atende aos requisitos'),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export type PasswordForm = z.infer<typeof passwordSchema>;
