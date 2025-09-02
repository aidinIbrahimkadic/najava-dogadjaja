import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAllUpcomingManifestations } from '../../services/apiFront';

export function useGetAllUpcomingManifestations() {
  const { isLoading, data, error } = useQuery({
    queryKey: ['public_upcoming_manifestations'],
    queryFn: getAllUpcomingManifestations,
    onSuccess: () => {
      toast.success(`Manifestacije učitane`);
    },
  });
  useEffect(() => {
    if (error) {
      toast.error(`${error.message}`);
    }
  }, [error]);

  const manifestations = data?.data;
  const count = data?.total;

  return { isLoading, manifestations, error, count };
}
