import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { getInstitutionById } from '../../services/apiFront';

export function useGetInstitutionById(id) {
  const {
    isLoading,
    data: singleInstitution,
    error,
  } = useQuery({
    queryKey: ['singleInstitution', id],
    queryFn: () => getInstitutionById(id),
    retry: 3, // 🔁 Retry 3 times before failing
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 3000), // optional: 1s, 2s, 4s
    refetchOnWindowFocus: false,
    enabled: !!id,
    onSuccess: () => {
      toast.success(`Institucija učitan`);
    },
  });
  useEffect(() => {
    if (error) {
      toast.error(`${error.message}`);
    }
  }, [error]);

  return { isLoading, singleInstitution, error };
}
