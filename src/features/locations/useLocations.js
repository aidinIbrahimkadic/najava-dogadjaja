import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { getLocations } from '../../services/apiLocations';

export function useGetLocations() {
  const { isLoading, data, error } = useQuery({
    queryKey: ['locations'],
    queryFn: getLocations,
    onSuccess: () => {
      toast.success(`Locations loaded`);
    },
  });
  useEffect(() => {
    if (error) {
      toast.error(`${error.message}`);
    }
  }, [error]);

  const locations = data?.data;
  const count = data?.total;

  return { isLoading, locations, error, count };
}
