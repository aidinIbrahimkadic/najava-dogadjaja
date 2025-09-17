import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { getLocations } from '../../services/apiLocations';

export function useGetLocations(userQuery = {}) {
  const qc = useQueryClient();

  // Default paginirano (limit 10); ALL samo kad eksplicitno zatražiš
  const query = useMemo(
    () => ({
      page: 1,
      limit: 10,
      sort: { field: 'naziv', order: 'ASC' },
      ...userQuery,
    }),
    [userQuery]
  );

  const isAll = query.all === true || query.limit === 'ALL';

  const explicitLimit = typeof userQuery.limit === 'number' ? userQuery.limit : undefined;
  const { isLoading, data, error } = useQuery({
    queryKey: ['locations', query],
    queryFn: () =>
      getLocations({
        ...query,
        ...(isAll
          ? { page: 1, limit: explicitLimit ?? 10000 } // << ključno
          : {}),
      }),
    staleTime: 60_000,
    placeholderData: (prev) => prev,
    select: (res) => {
      const list = res?.data ?? res?.items ?? [];
      return {
        locations: list,
        count: res?.total ?? list.length ?? 0,
        page: res?.page ?? (isAll ? 1 : (query.page ?? 1)),
        limit: res?.limit ?? (isAll ? (list.length ?? 0) : (query.limit ?? 10)),
        isAll,
      };
    },
  });
  // const { isLoading, data, error } = useQuery({
  //   queryKey: ['locations', query],
  //   queryFn: () =>
  //     getLocations({
  //       ...query,
  //       ...(isAll ? { page: 1, limit: typeof query.limit === 'number' ? query.limit : 10000 } : {}),
  //     }),
  //   staleTime: 60_000,
  //   placeholderData: (prev) => prev,
  //   select: (res) => {
  //     const list = res?.data ?? res?.items ?? [];
  //     return {
  //       locations: list,
  //       count: res?.total ?? list.length ?? 0,
  //       page: res?.page ?? (isAll ? 1 : (query.page ?? 1)),
  //       limit: res?.limit ?? (isAll ? (list.length ?? 0) : (query.limit ?? 10)),
  //       isAll,
  //     };
  //   },
  // });

  // Prefetch samo u paginiranom modu
  useEffect(() => {
    if (!data || data.isAll) return;

    const page = data.page ?? 1;
    const limit = data.limit ?? 10;
    const total = data.count ?? 0;
    const pageCount = Math.max(1, Math.ceil(total / limit));

    if (page < pageCount) {
      const nextQuery = { ...query, page: page + 1, all: false };
      qc.prefetchQuery({
        queryKey: ['locations', nextQuery],
        queryFn: () => getLocations(nextQuery),
        staleTime: 60_000,
      });
    }
    if (page > 1) {
      const prevQuery = { ...query, page: page - 1, all: false };
      qc.prefetchQuery({
        queryKey: ['locations', prevQuery],
        queryFn: () => getLocations(prevQuery),
        staleTime: 60_000,
      });
    }
  }, [data, query, qc]);

  return {
    isLoading,
    locations: data?.locations ?? [],
    error,
    count: data?.count ?? 0,
    page: data?.page ?? 1,
    limit: data?.limit ?? (isAll ? 0 : 10),
  };
}
