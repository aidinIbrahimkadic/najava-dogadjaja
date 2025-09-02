import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAllEventsFromManifestation } from '../../services/apiFront';

export function useGetEventsByManifestationId(id) {
  const {
    isLoading,
    data: events,
    error,
  } = useQuery({
    queryKey: ['events_by_manifestation_id', id],
    queryFn: () => getAllEventsFromManifestation(id),
    retry: 3, // 🔁 Retry 3 times before failing
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 3000), // optional: 1s, 2s, 4s
    refetchOnWindowFocus: false,
    enabled: !!id,
    onSuccess: () => {
      toast.success(`Događaji učitan`);
    },
  });
  useEffect(() => {
    if (error) {
      toast.error(`${error.message}`);
    }
  }, [error]);

  return { isLoading, events, error };
}
