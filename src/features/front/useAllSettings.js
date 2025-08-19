import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAllSettings } from '../../services/apiFront';

export function useGetAllSettings() {
  const { isLoading, data, error } = useQuery({
    queryKey: ['public_settings'],
    queryFn: getAllSettings,
    onSuccess: () => {
      toast.success(`Postavke učitane`);
    },
  });
  useEffect(() => {
    if (error) {
      toast.error(`${error.message}`);
    }
  }, [error]);

  const settings = data?.data;

  return { isLoading, settings, error };
}
