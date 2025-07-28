import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { getInstitutions } from '../../services/apiInstitutions';

export function useGetInstitutions() {
  const {
    isLoading,
    data: institutions,
    error,
  } = useQuery({
    queryKey: ['institutions'],
    queryFn: getInstitutions,
    onSuccess: () => {
      toast.success(`Institutions loaded`);
    },
  });
  useEffect(() => {
    if (error) {
      toast.error(`${error.message}`);
    }
  }, [error]);

  return { isLoading, institutions, error };
}
