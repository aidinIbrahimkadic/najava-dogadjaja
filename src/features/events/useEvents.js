import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { getEvents } from '../../services/apiEvents';

export function useGetEvents(query) {
  const queryClient = useQueryClient();

  const { isLoading, data, error } = useQuery({
    queryKey: ['events', query],
    queryFn: () => getEvents(query), // VAŽNO: funkcija, ne poziv
    staleTime: 30_000, // drži podatke “svježim” 30s
    placeholderData: (prev) => prev, // zadrži prethodnu stranicu vidljivom
    select: (res) => ({
      events: res.data ?? res.items ?? [],
      count: res.total ?? 0,
      page: res.page ?? query?.page ?? 1,
      limit: res.limit ?? query?.limit ?? 10,
    }),
    // (po želji) isključi učitavanje pri fokusiranju prozora
    // refetchOnWindowFocus: false,
    onSuccess: () => {
      toast.success('Events loaded');
    },
  });

  useEffect(() => {
    if (!data) return;

    const page = data.page ?? query.page ?? 1;
    const limit = data.limit ?? query.limit ?? 10;
    const total = data.count ?? 0;
    const pageCount = Math.max(1, Math.ceil(total / limit));

    // Prefetch NEXT page (ako postoji)
    if (page < pageCount) {
      const nextQuery = { ...query, page: page + 1 };
      queryClient.prefetchQuery({
        queryKey: ['events', nextQuery],
        queryFn: () => getEvents(nextQuery),
        staleTime: 30_000,
      });
    }

    // (Opcionalno) Prefetch PREV page za brzi “Back”
    if (page > 1) {
      const prevQuery = { ...query, page: page - 1 };
      queryClient.prefetchQuery({
        queryKey: ['events', prevQuery],
        queryFn: () => getEvents(prevQuery),
        staleTime: 30_000,
      });
    }
  }, [data, query, queryClient]);

  useEffect(() => {
    if (error) toast.error(String(error?.message ?? 'Greška'));
  }, [error]);

  return { isLoading, events: data?.events, error, count: data?.count };
}
