// Único ponto de entrada do Supabase para o resto do app.
// O ESLint bloqueia `@supabase/supabase-js` fora desta pasta.
export type { Session, User } from '@supabase/supabase-js';

export { type AppSupabaseClient, supabase } from './client';
export type { Database, Json } from './database.types';
export { type AppError, SupabaseNotConfiguredError, toAppError } from './errors';
export { type SessionContextValue, SessionProvider, useSession } from './SessionProvider';
