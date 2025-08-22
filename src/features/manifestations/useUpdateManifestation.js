import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { updateManifestation as updateManifestationAPI } from '../../services/apiManifestations';

export function useUpdateManifestation() {
  const queryClient = useQueryClient();

  const {
    isError,
    isSuccess,
    isPending: isEditing,
    mutate: updateManifestation,
  } = useMutation({
    mutationFn: updateManifestationAPI,
    onSuccess: () => {
      toast.success(`Manifestacija uspješno ažurirana!`);
      queryClient.invalidateQueries(['manifestations']);
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });

  return { isError, isSuccess, isEditing, updateManifestation };
}
