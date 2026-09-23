import { z } from 'zod';

const emailSchema = z.email();
const userIdRegex = /^@?[a-z0-9._]{3,20}$/i;

/** E-mail ou ID de usuário (@usuario). Usado no login e na recuperação de senha. */
export const identifierSchema = z
  .string()
  .trim()
  .min(1, 'Informe seu e-mail ou ID')
  .refine(
    (v) => emailSchema.safeParse(v).success || userIdRegex.test(v),
    'Informe um e-mail válido ou uma ID como @usuario',
  );

export const loginSchema = z.object({
  identifier: identifierSchema,
  password: z.string().min(1, 'Informe sua senha'),
});

export type LoginForm = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({ identifier: identifierSchema });

export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
