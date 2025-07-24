import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
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
      toast.error(`${error.message}`);
    },
  });

  return { isError, isSuccess, isEditing, updateEvent };
}
