import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateEvent as updateEventAPI } from '../../services/apiEvents';

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  const {
    isError,
    isSuccess,
    isPending: isEditing,
    mutate: updateEvent,
  } = useMutation({
    mutationFn: updateEventAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
    },
    onError: (error) => {
      console.error('Error updating event:', error);
    },
  });

  return { isError, isSuccess, isEditing, updateEvent };
}
