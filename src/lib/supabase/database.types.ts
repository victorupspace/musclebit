/**
 * PLACEHOLDER. Substitua pelo arquivo gerado a partir do projeto real:
 *
 *   npx supabase gen types typescript --project-id <ID> --schema public > src/lib/supabase/database.types.ts
 *
 * Até lá, o schema `public` é vazio e qualquer `supabase.from('tabela')` falha no typecheck.
 * Isso é intencional: garante que nenhuma query seja escrita antes do schema existir.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
