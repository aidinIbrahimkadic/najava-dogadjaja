// import { useQuery } from '@tanstack/react-query';
// import { useEffect } from 'react';
// import toast from 'react-hot-toast';
// import { getInstitutions } from '../../services/apiInstitutions';

// export function useGetInstitutions() {
//   const {
//     isLoading,
//     data: institutions,
//     error,
//   } = useQuery({
//     queryKey: ['institutions'],
//     queryFn: getInstitutions,
//     onSuccess: () => {
//       toast.success(`Institutions loaded`);
//     },
//   });
//   useEffect(() => {
//     if (error) {
//       toast.error(`${error.message}`);
//     }
//   }, [error]);

//   return { isLoading, institutions, error };
// }

// features/institutions/useInstitutions.js
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getInstitutions } from '../../services/apiInstitutions';
import toast from 'react-hot-toast';

export function useGetInstitutions(query) {
  const qc = useQueryClient();

  const { isLoading, data, error } = useQuery({
    queryKey: ['institutions', query],
    queryFn: () => getInstitutions(query), // MORA biti funkcija
    staleTime: 30_000,
    placeholderData: (prev) => prev, // zadrži prethodne podatke dok stižu novi
    select: (res) => ({
      institutions: res?.data ?? res?.items ?? [],
      count: res?.total ?? 0,
      page: res?.page ?? query?.page ?? 1,
      limit: res?.limit ?? query?.limit ?? 25,
    }),
    // refetchOnWindowFocus: false,
  });

  // Prefetch next/prev page za instant navigaciju
  useEffect(() => {
    if (!data) return;

    const page = data.page ?? 1;
    const limit = data.limit ?? 25;
    const total = data.count ?? 0;
    const pageCount = Math.max(1, Math.ceil(total / limit));

    if (page < pageCount) {
      const nextQuery = { ...query, page: page + 1 };
      qc.prefetchQuery({
        queryKey: ['institutions', nextQuery],
        queryFn: () => getInstitutions(nextQuery),
        staleTime: 30_000,
      });
    }
    if (page > 1) {
      const prevQuery = { ...query, page: page - 1 };
      qc.prefetchQuery({
        queryKey: ['institutions', prevQuery],
        queryFn: () => getInstitutions(prevQuery),
        staleTime: 30_000,
      });
    }
  }, [data, query, qc]);

  useEffect(() => {
    if (error) toast.error(String(error?.message ?? 'Greška pri učitavanju institucija'));
  }, [error]);

  return {
    isLoading,
    institutions: data?.institutions,
    error,
    count: data?.count,
    page: data?.page,
    limit: data?.limit,
  };
}
