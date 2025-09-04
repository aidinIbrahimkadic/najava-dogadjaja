// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { useEffect } from 'react';
// import { getInstitutions } from '../../services/apiInstitutions';
// import toast from 'react-hot-toast';

// export function useGetInstitutions(query) {
//   const qc = useQueryClient();

//   const { isLoading, data, error } = useQuery({
//     queryKey: ['institutions', query],
//     queryFn: () => getInstitutions(query), // MORA biti funkcija
//     staleTime: 30_000,
//     placeholderData: (prev) => prev, // zadrži prethodne podatke dok stižu novi
//     select: (res) => ({
//       institutions: res?.data ?? res?.items ?? [],
//       count: res?.total ?? 0,
//       page: res?.page ?? query?.page ?? 1,
//       limit: res?.limit ?? query?.limit ?? 25,
//     }),
//     // refetchOnWindowFocus: false,
//   });

//   // Prefetch next/prev page za instant navigaciju
//   useEffect(() => {
//     if (!data) return;

//     const page = data.page ?? 1;
//     const limit = data.limit ?? 25;
//     const total = data.count ?? 0;
//     const pageCount = Math.max(1, Math.ceil(total / limit));

//     if (page < pageCount) {
//       const nextQuery = { ...query, page: page + 1 };
//       qc.prefetchQuery({
//         queryKey: ['institutions', nextQuery],
//         queryFn: () => getInstitutions(nextQuery),
//         staleTime: 30_000,
//       });
//     }
//     if (page > 1) {
//       const prevQuery = { ...query, page: page - 1 };
//       qc.prefetchQuery({
//         queryKey: ['institutions', prevQuery],
//         queryFn: () => getInstitutions(prevQuery),
//         staleTime: 30_000,
//       });
//     }
//   }, [data, query, qc]);

//   useEffect(() => {
//     if (error) toast.error(String(error?.message ?? 'Greška pri učitavanju institucija'));
//   }, [error]);

//   return {
//     isLoading,
//     institutions: data?.institutions,
//     error,
//     count: data?.count,
//     page: data?.page,
//     limit: data?.limit,
//   };
// }

// features/institutions/useInstitutions.js
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { getInstitutions } from '../../services/apiInstitutions';

export function useGetInstitutions(userQuery = {}) {
  const qc = useQueryClient();

  // Default: paginirano (limit 10); ako userQuery.all === true -> povuci sve
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

  const { isLoading, data, error } = useQuery({
    queryKey: ['institutions', query],
    queryFn: () =>
      getInstitutions({
        ...query,
        ...(isAll
          ? {
              page: 1,
              // ako želiš drugačiji hard-cap, promijeni 10000
              limit: typeof query.limit === 'number' ? query.limit : 10000,
            }
          : {}),
      }),
    staleTime: 60_000,
    placeholderData: (prev) => prev,
    select: (res) => {
      const list = res?.data ?? res?.items ?? [];
      return {
        institutions: list,
        count: res?.total ?? list.length ?? 0,
        page: res?.page ?? (isAll ? 1 : (query.page ?? 1)),
        limit: res?.limit ?? (isAll ? (list.length ?? 0) : (query.limit ?? 10)),
        isAll,
      };
    },
  });

  // Prefetch radi samo u paginiranom modu
  useEffect(() => {
    if (!data || data.isAll) return;

    const page = data.page ?? 1;
    const limit = data.limit ?? 10;
    const total = data.count ?? 0;
    const pageCount = Math.max(1, Math.ceil(total / limit));

    if (page < pageCount) {
      const nextQuery = { ...query, page: page + 1, all: false };
      qc.prefetchQuery({
        queryKey: ['institutions', nextQuery],
        queryFn: () => getInstitutions(nextQuery),
        staleTime: 60_000,
      });
    }
    if (page > 1) {
      const prevQuery = { ...query, page: page - 1, all: false };
      qc.prefetchQuery({
        queryKey: ['institutions', prevQuery],
        queryFn: () => getInstitutions(prevQuery),
        staleTime: 60_000,
      });
    }
  }, [data, query, qc]);

  useEffect(() => {
    if (error) toast.error(String(error?.message ?? 'Greška pri učitavanju institucija'));
  }, [error]);

  return {
    // zadrži ime koje koristiš u formi
    isLoadingInstitutions: isLoading,
    // i alias za slučaj da ga negdje koristiš
    isLoading,
    institutions: data?.institutions ?? [],
    error,
    count: data?.count ?? 0,
    page: data?.page ?? 1,
    limit: data?.limit ?? (isAll ? 0 : 10),
  };
}
