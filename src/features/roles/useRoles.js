import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { getRoles } from '../../services/apiRoles';

export function useGetRoles() {
  const {
    isLoading,
    data: roles,
    error,
  } = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
    onSuccess: () => {
      toast.success(`Roles loaded`);
    },
  });
  useEffect(() => {
    if (error) {
      toast.error(`${error.message}`);
    }
  }, [error]);

  return { isLoading, roles, error };
}
