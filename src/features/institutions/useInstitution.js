import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { getInstitution } from '../../services/apiInstitutions';

export function useGetInstitution(id) {
  const {
    isLoading,
    data: institution,
    error,
  } = useQuery({
    queryKey: ['institution', id],
    queryFn: () => getInstitution(id),
    retry: 3, // 🔁 Retry 3 times before failing
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 3000), // optional: 1s, 2s, 4s
    refetchOnWindowFocus: false,
    enabled: !!id,
    onSuccess: () => {
      toast.success(`Institucija učitana`);
    },
  });
  useEffect(() => {
    if (error) {
      toast.error(`${error.message}`);
    }
  }, [error]);

  return { isLoading, institution, error };
}
