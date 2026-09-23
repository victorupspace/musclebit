import { z } from 'zod';

/** Formato de uma ID de usuário: @ seguido de 3 a 20 letras minúsculas, números, ponto ou sublinhado. */
export const USER_ID_PATTERN = /^@[a-z0-9._]{3,20}$/;

export const USER_ID_MESSAGE = 'Use de 3 a 20 letras, números, ponto ou sublinhado';

/** ID de usuário já normalizada por `formatUserId` (minúsculas, com @). */
export const userIdSchema = z.string().regex(USER_ID_PATTERN, USER_ID_MESSAGE);
