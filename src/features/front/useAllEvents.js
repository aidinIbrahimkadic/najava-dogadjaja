import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAllEvents } from '../../services/apiFront';

export function useGetAllEvents() {
  const { isLoading, data, error } = useQuery({
    queryKey: ['public_events'],
    queryFn: getAllEvents,
    onSuccess: () => {
      toast.success(`Događaji učitani`);
    },
  });
  useEffect(() => {
    if (error) {
      toast.error(`${error.message}`);
    }
  }, [error]);

  const allEvents = data?.data;
  const count = data?.total;

  return { isLoading, allEvents, error, count };
}
