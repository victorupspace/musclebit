/**
 * Query key factories.
 *
 * Padrão: cada domínio tem uma factory hierárquica. Invalidar `queryKeys.<domínio>.all()` derruba
 * tudo daquele domínio; invalidar `lists()` só as listagens; `detail(id)` só um item.
 *
 * Para estender, copie o bloco `example` com o nome do domínio e apague o exemplo.
 */

/** Filtros de listagem do exemplo. Substitua pelo tipo real do domínio. */
type ExampleListFilters = {
  search?: string;
};

export const queryKeys = {
  all: ['musclebit'] as const,

  // EXEMPLO. Substitua pelo primeiro domínio real e remova.
  example: {
    all: () => [...queryKeys.all, 'example'] as const,
    lists: () => [...queryKeys.example.all(), 'list'] as const,
    list: (filters: ExampleListFilters = {}) => [...queryKeys.example.lists(), filters] as const,
    details: () => [...queryKeys.example.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.example.details(), id] as const,
  },
} as const;
