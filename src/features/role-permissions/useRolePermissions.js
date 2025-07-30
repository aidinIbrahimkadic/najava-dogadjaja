import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { getRolePermissions } from '../../services/apiRoles';

export function useGetRolePermissions(id) {
  const {
    isLoading,
    data: rolePermissions,
    error,
  } = useQuery({
    queryKey: ['rolePermissions', id],
    queryFn: () => getRolePermissions(id),
    retry: 3, // 🔁 Retry 3 times before failing
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 3000), // optional: 1s, 2s, 4s
    refetchOnWindowFocus: false,
    enabled: !!id,
    onSuccess: () => {
      toast.success(`Permissions for role loaded`);
    },
  });
  useEffect(() => {
    if (error) {
      toast.error(`${error.message}`);
    }
  }, [error]);

  return { isLoading, rolePermissions, error };
}
