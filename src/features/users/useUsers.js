import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { getUsers } from '../../services/apiUsers';

export function useGetUsers() {
  const {
    isLoading,
    data: users,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    onSuccess: () => {
      toast.success(`Users loaded`);
    },
  });
  useEffect(() => {
    if (error) {
      toast.error(`${error.message}`);
    }
  }, [error]);

  return { isLoading, users, error };
}
