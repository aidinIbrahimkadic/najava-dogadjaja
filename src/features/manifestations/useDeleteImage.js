import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateManifestationDeleteImage } from '../../services/apiManifestations';
import toast from 'react-hot-toast';

export function useDeleteImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateManifestationDeleteImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manifestations'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete image');
    },
  });
}
