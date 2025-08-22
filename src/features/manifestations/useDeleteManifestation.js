import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteManifestation } from '../../services/apiManifestations';
import toast from 'react-hot-toast';

export function useDeleteManifestation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteManifestation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manifestations'] });
      toast.success('Manifestacija uspješno izbrisana');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete manifestation');
    },
  });
}
