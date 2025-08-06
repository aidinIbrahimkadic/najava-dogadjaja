import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateEventDeleteImage } from '../../services/apiEvents';
import toast from 'react-hot-toast';

export function useDeleteImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEventDeleteImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete image');
    },
  });
}
