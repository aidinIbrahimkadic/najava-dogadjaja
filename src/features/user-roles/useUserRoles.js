import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { getUserRoles } from '../../services/apiUsers';

export function useGetUserRoles(id) {
  const {
    isLoading,
    data: userRoles,
    error,
  } = useQuery({
    queryKey: ['userRoles', id],
    queryFn: () => getUserRoles(id),
    retry: 3, // 🔁 Retry 3 times before failing
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 3000), // optional: 1s, 2s, 4s
    refetchOnWindowFocus: false,
    enabled: !!id,
    onSuccess: () => {
      toast.success(`Roles for user loaded`);
    },
  });
  useEffect(() => {
    if (error) {
      toast.error(`${error.message}`);
    }
  }, [error]);

  return { isLoading, userRoles, error };
}
