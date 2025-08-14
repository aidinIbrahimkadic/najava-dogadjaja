import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAllInstitutions } from '../../services/apiFront';

export function useGetAllInstitutions() {
  const { isLoading, data, error } = useQuery({
    queryKey: ['public_institutions'],
    queryFn: getAllInstitutions,
    onSuccess: () => {
      toast.success(`Institucije učitane`);
    },
  });
  useEffect(() => {
    if (error) {
      toast.error(`${error.message}`);
    }
  }, [error]);

  const allInstitutions = data?.data;

  return { isLoading, allInstitutions, error };
}
