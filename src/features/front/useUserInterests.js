import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { getUserInterests } from '../../services/apiUserInterests';

export function useGetUserInterests() {
  const { isLoading, data, error } = useQuery({
    queryKey: ['user_interests'],
    queryFn: getUserInterests,
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
