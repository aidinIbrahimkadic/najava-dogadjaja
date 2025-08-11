import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteEvent } from '../../services/apiEvents';
import toast from 'react-hot-toast';

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Događaj uspješno izbrisan');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete event');
    },
  });
}
