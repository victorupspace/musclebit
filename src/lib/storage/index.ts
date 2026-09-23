import AsyncStorage from '@react-native-async-storage/async-storage';

/** Prefixo de todas as chaves, para não colidir com outras libs que usam o AsyncStorage. */
const PREFIX = 'musclebit:';

const withPrefix = (key: string) => `${PREFIX}${key}`;

/**
 * Wrapper tipado do AsyncStorage com serialização JSON.
 * Para dados do Supabase, não use isto: o cache é o TanStack Query.
 */
export const storage = {
  async get<T>(key: string): Promise<T | null> {
    const raw = await AsyncStorage.getItem(withPrefix(key));
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      // Valor corrompido: remove para não quebrar toda leitura futura.
      await AsyncStorage.removeItem(withPrefix(key));
      return null;
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    await AsyncStorage.setItem(withPrefix(key), JSON.stringify(value));
  },

  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(withPrefix(key));
  },

  /** Remove só as chaves do app; a sessão do Supabase (fora do prefixo) fica intacta. */
  async clear(): Promise<void> {
    const keys = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(keys.filter((k) => k.startsWith(PREFIX)));
  },
};
