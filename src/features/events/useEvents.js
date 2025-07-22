import { QueryClient, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { getEvents } from '../../services/apiEvents';

export function useGetEvents() {
  const { isLoading, data, error } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
    onSuccess: () => {
      toast.success(`Events loaded`);
    },
  });
  useEffect(() => {
    if (error) {
      console.log(`${error.response.data.message}`);
    }
  }, [error]);

  const events = data?.data;
  const count = data?.total;

  return { isLoading, events, error, count };
}
