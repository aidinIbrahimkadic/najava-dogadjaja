import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { getUserInterests } from '../../services/apiUserInterests';

export function useGetUserInterests({ enabled = true, userId }) {
  const { isLoading, data, error } = useQuery({
    queryKey: ['user_interests', userId],
    queryFn: getUserInterests,
    enabled: Boolean(enabled && userId),
    onSuccess: () => {
      toast.success(`Događaji učitani`);
    },
  });
  useEffect(() => {
    if (error) {
      toast.error(`${error.message}`);
    }
  }, [error]);

  const userInterests = data?.data.interests;

  return { isLoading, userInterests, error };
}
