import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { getUpcomingManifestations } from '../../services/apiManifestations';

export function useGetUpcomingManifestations() {
  const {
    isLoading,
    data: upcomingManifestations,
    error,
  } = useQuery({
    queryKey: ['upcomingManifestations'],
    queryFn: getUpcomingManifestations,
    onSuccess: () => {
      toast.success(`upcomingManifestations loaded`);
    },
  });
  useEffect(() => {
    if (error) {
      toast.error(`${error.message}`);
    }
  }, [error]);

  return { isLoading, upcomingManifestations, error };
}
