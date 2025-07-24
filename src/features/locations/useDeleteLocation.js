import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteLocation } from '../../services/apiLocations';
import toast from 'react-hot-toast';

export function useDeleteLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success('Lokacija uspješno izbrisana');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete location');
    },
  });
}
