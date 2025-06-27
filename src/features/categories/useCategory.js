import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { getCategory } from '../../services/apiCategories';

export function useGetCategory() {
  const {
    isLoading,
    data: category,
    error,
  } = useQuery({
    queryKey: ['category'],
    queryFn: getCategory,
    // Mozda visak
    retry: 0,
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
