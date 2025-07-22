import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { getCategory } from '../../services/apiCategories';

export function useGetCategory(id) {
  const {
    isLoading,
    data: category,
    error,
  } = useQuery({
    queryKey: ['category', id],
    queryFn: () => getCategory(id),
    retry: 3, // 🔁 Retry 3 times before failing
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 3000), // optional: 1s, 2s, 4s
    refetchOnWindowFocus: false,
    enabled: !!id,
    onSuccess: () => {
      toast.success(`Category loaded`);
    },
  });
  useEffect(() => {
    if (error) {
      toast.error(`${error.response.data.message}`);
    }
  }, [error]);

  return { isLoading, category, error };
}
