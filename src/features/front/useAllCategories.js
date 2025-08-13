import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAllCategories } from '../../services/apiFront';

export function useGetAllCategories() {
  const { isLoading, data, error } = useQuery({
    queryKey: ['public_categories'],
    queryFn: getAllCategories,
    onSuccess: () => {
      toast.success(`Kategorije učitane`);
    },
  });
  useEffect(() => {
    if (error) {
      toast.error(`${error.message}`);
    }
  }, [error]);

  const allCategories = data?.data;
  const count = data?.total;

  return { isLoading, allCategories, error, count };
}
