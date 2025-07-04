import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { getCategories } from '../../services/apiCategories';

export function useGetCategories() {
  const { isLoading, data, error } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    // Mozda visak
    retry: 0,
    onSuccess: () => {
      toast.success(`Categories loaded`);
    },
  });
  useEffect(() => {
    if (error) {
      toast.error(`${error.response.data.message}`);
    }
  }, [error]);

  const categories = data?.data;
  const count = data?.total;
  return { isLoading, categories, error, count };
}
