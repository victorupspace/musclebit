// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier');

module.exports = defineConfig([
  expoConfig,
  // Desliga regras de formatação que conflitam com o Prettier. Deve vir por último entre os presets.
  prettierConfig,
  {
    ignores: ['dist/*', 'node_modules/*', '.expo/*', 'ios/*', 'android/*', 'expo-env.d.ts'],
  },
  {
    rules: {
      // O SDK do Supabase só pode ser importado dentro de src/lib/supabase.
      // O resto do app consome o client e os tipos exportados por "@/lib/supabase".
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@supabase/supabase-js',
              message:
                'Importe o client e os tipos de "@/lib/supabase". O SDK só é usado em src/lib/supabase.',
            },
          ],
        },
      ],
      // Rotas em app/ não devem receber lógica: importam a tela de src/features e nada mais.
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [{ pattern: '@/**', group: 'internal' }],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
  {
    files: ['src/lib/supabase/**'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
]);
