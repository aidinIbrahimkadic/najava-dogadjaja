// features/locations/useLocations.js
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getLocations } from '../../services/apiLocations';

export function useGetLocations(query) {
  const qc = useQueryClient();

  const { isLoading, data, error } = useQuery({
    queryKey: ['locations', query],
    queryFn: () => getLocations(query),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
    select: (res) => ({
      locations: res.data ?? res.items ?? [],
      count: res.total ?? 0,
      page: res.page ?? query?.page ?? 1,
      limit: res.limit ?? query?.limit ?? 25,
    }),
    // refetchOnWindowFocus: false,
  });

  // Prefetch next/prev
  useEffect(() => {
    if (!data) return;

    const page = data.page ?? 1;
    const limit = data.limit ?? 10;
    const total = data.count ?? 0;
    const pageCount = Math.max(1, Math.ceil(total / limit));

    if (page < pageCount) {
      const nextQuery = { ...query, page: page + 1 };
      qc.prefetchQuery({
        queryKey: ['locations', nextQuery],
        queryFn: () => getLocations(nextQuery),
        staleTime: 30_000,
      });
    }
    if (page > 1) {
      const prevQuery = { ...query, page: page - 1 };
      qc.prefetchQuery({
        queryKey: ['locations', prevQuery],
        queryFn: () => getLocations(prevQuery),
        staleTime: 30_000,
      });
    }
  }, [data, query, qc]);

  return { isLoading, locations: data?.locations, error, count: data?.count };
}
