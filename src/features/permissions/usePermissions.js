import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { getPermissions } from '../../services/apiPermissions';

export function useGetPermissions() {
  const {
    isLoading,
    data: permissions,
    error,
  } = useQuery({
    queryKey: ['permissions'],
    queryFn: getPermissions,
    onSuccess: () => {
      toast.success(`Permissions loaded`);
    },
  });
  useEffect(() => {
    if (error) {
      toast.error(`${error.message}`);
    }
  }, [error]);

  return { isLoading, permissions, error };
}
