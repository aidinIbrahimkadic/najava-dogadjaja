// // features/categories/useCategories.js
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { useEffect } from 'react';
// import { getCategories } from '../../services/apiCategories';
// import toast from 'react-hot-toast';

// export function useGetCategories(query) {
//   const qc = useQueryClient();

//   const { isLoading, data, error } = useQuery({
//     queryKey: ['categories', query || 'all'],
//     queryFn: () => getCategories(query),
//     staleTime: 30_000,
//     placeholderData: (prev) => prev,
//     select: (res) => ({
//       categories: res?.data ?? res?.items ?? [],
//       count: res?.total ?? res?.data?.length ?? 0,
//       page: res?.page ?? query?.page ?? 1,
//       limit: res?.limit ?? query?.limit ?? 10,
//     }),
//     // refetchOnWindowFocus: false,
//   });

//   // Prefetch next/prev page za instant navigaciju
//   useEffect(() => {
//     if (!data || !query) return;

//     const page = data.page ?? 1;
//     const limit = data.limit ?? 10;
//     const total = data.count ?? 0;
//     const pageCount = Math.max(1, Math.ceil(total / limit));

//     if (page < pageCount) {
//       const nextQuery = { ...query, page: page + 1 };
//       qc.prefetchQuery({
//         queryKey: ['categories', nextQuery],
//         queryFn: () => getCategories(nextQuery),
//         staleTime: 30_000,
//       });
//     }
//     if (page > 1) {
//       const prevQuery = { ...query, page: page - 1 };
//       qc.prefetchQuery({
//         queryKey: ['categories', prevQuery],
//         queryFn: () => getCategories(prevQuery),
//         staleTime: 30_000,
//       });
//     }
//   }, [data, query, qc]);

//   useEffect(() => {
//     if (error) toast.error(String(error?.message ?? 'Greška'));
//   }, [error]);

//   return {
//     isLoading,
//     categories: data?.categories,
//     error,
//     count: data?.count,
//     page: data?.page,
//     limit: data?.limit,
//   };
// }

// features/categories/useCategories.js
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { getCategories } from '../../services/apiCategories';

export function useGetCategories(userQuery) {
  const qc = useQueryClient();

  const query = useMemo(
    () => ({
      page: 1,
      limit: 50,
      sort: { field: 'naziv', order: 'ASC' },
      ...(userQuery || {}),
    }),
    [userQuery]
  );

  const isAll = query.all === true || query.limit === 'ALL';

  const { isLoading, data, error } = useQuery({
    queryKey: ['categories', query || 'all'],
    queryFn: () =>
      getCategories({
        ...query,
        ...(isAll ? { page: 1, limit: typeof query.limit === 'number' ? query.limit : 10000 } : {}),
      }),
    staleTime: 60_000,
    placeholderData: (prev) => prev,
    select: (res) => {
      const list = res?.data ?? res?.items ?? [];
      return {
        categories: list,
        count: res?.total ?? list.length ?? 0,
        page: res?.page ?? (isAll ? 1 : (query.page ?? 1)),
        limit: res?.limit ?? (isAll ? (list.length ?? 0) : (query.limit ?? 50)),
        isAll,
      };
    },
  });

  // Prefetch samo u paginiranom modu
  useEffect(() => {
    if (!data || data.isAll) return;

    const page = data.page ?? 1;
    const limit = data.limit ?? 50;
    const total = data.count ?? 0;
    const pageCount = Math.max(1, Math.ceil(total / limit));

    if (page < pageCount) {
      const nextQuery = { ...query, page: page + 1, all: false };
      qc.prefetchQuery({
        queryKey: ['categories', nextQuery],
        queryFn: () => getCategories(nextQuery),
        staleTime: 60_000,
      });
    }
    if (page > 1) {
      const prevQuery = { ...query, page: page - 1, all: false };
      qc.prefetchQuery({
        queryKey: ['categories', prevQuery],
        queryFn: () => getCategories(prevQuery),
        staleTime: 60_000,
      });
    }
  }, [data, query, qc]);

  useEffect(() => {
    if (error) toast.error(String(error?.message ?? 'Greška'));
  }, [error]);

  return {
    isLoading,
    categories: data?.categories ?? [],
    error,
    count: data?.count ?? 0,
    page: data?.page ?? 1,
    limit: data?.limit ?? (isAll ? 0 : 50),
  };
}
