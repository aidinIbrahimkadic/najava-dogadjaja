import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { getUpcomingEvents } from '../../services/apiFront';

export function useGetUpcomingEvents() {
  const { isLoading, data, error } = useQuery({
    queryKey: ['upcoming_events'],
    queryFn: getUpcomingEvents,
    onSuccess: () => {
      toast.success(`Događaji učitani`);
    },
  });
  useEffect(() => {
    if (error) {
      toast.error(`${error.message}`);
    }
  }, [error]);

  const upcomingEvents = data?.data;

  return { isLoading, upcomingEvents, error };
}
