import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { getSingleManifestation } from '../../services/apiFront';

export function useGetManifestationById(id) {
  const {
    isLoading,
    data: manifestation,
    error,
  } = useQuery({
    queryKey: ['manifestation_by_id', id],
    queryFn: () => getSingleManifestation(id),
    retry: 3, // 🔁 Retry 3 times before failing
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 3000), // optional: 1s, 2s, 4s
    refetchOnWindowFocus: false,
    enabled: !!id,
    onSuccess: () => {
      toast.success(`Manifestacija učitana`);
    },
  });
  useEffect(() => {
    if (error) {
      toast.error(`${error.message}`);
    }
  }, [error]);

  return { isLoading, manifestation, error };
}
