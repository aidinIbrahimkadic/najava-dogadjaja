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
    // Mozda visak
    retry: 0,
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
