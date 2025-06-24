import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getEvents } from '../../services/apiEvents';

export function useGetEvents() {
  const { isLoading, data: events } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
    onSuccess: () => {
      toast.success('Events loaded');
    },
    onError: () => {
      toast.error('Failed to load events');
    },
  });

  return { isLoading, events };
}
