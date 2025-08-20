// import { useQuery } from '@tanstack/react-query';
// import { useEffect } from 'react';
// import toast from 'react-hot-toast';
// import { getUsers } from '../../services/apiUsers';

// export function useGetUsers() {
//   const {
//     isLoading,
//     data: users,
//     error,
//   } = useQuery({
//     queryKey: ['users'],
//     queryFn: getUsers,
//     onSuccess: () => {
//       toast.success(`Users loaded`);
//     },
//   });
//   useEffect(() => {
//     if (error) {
//       toast.error(`${error.message}`);
//     }
//   }, [error]);

//   return { isLoading, users, error };
// }

// features/users/useUsers.js
// features/users/useUsers.js
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { getUsers } from '../../services/apiUsers';

export function useGetUsers(query) {
  const qc = useQueryClient();

  const { isLoading, data, error } = useQuery({
    queryKey: ['users', query],
    queryFn: () => getUsers(query),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
    select: (res) => {
      const users = res?.data?.users ?? [];
      const count = res?.data?.pagination?.total ?? users.length ?? 0;
      return {
        users,
        count,
        page: query?.page ?? 1,
        limit: query?.limit ?? 10,
      };
    },
  });

  // Prefetch next/prev page (računamo iz count/limit jer backend ne vraća current page/limit)
  useEffect(() => {
    if (!data) return;
    const { page = 1, limit = 10, count = 0 } = data;
    const pageCount = Math.max(1, Math.ceil(count / limit));

    if (page < pageCount) {
      const nextQuery = { ...query, page: page + 1 };
      qc.prefetchQuery({
        queryKey: ['users', nextQuery],
        queryFn: () => getUsers(nextQuery),
        staleTime: 30_000,
      });
    }
    if (page > 1) {
      const prevQuery = { ...query, page: page - 1 };
      qc.prefetchQuery({
        queryKey: ['users', prevQuery],
        queryFn: () => getUsers(prevQuery),
        staleTime: 30_000,
      });
    }
  }, [data, query, qc]);

  useEffect(() => {
    if (error) toast.error(String(error?.message ?? 'Greška pri učitavanju korisnika'));
  }, [error]);

  return {
    isLoading,
    users: data?.users,
    error,
    count: data?.count,
    page: data?.page,
    limit: data?.limit,
  };
}
