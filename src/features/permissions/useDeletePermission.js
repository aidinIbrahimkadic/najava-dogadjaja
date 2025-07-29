import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePermission } from '../../services/apiPermissions';
import toast from 'react-hot-toast';

export function useDeletePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      toast.success('Dozvola uspješno izbrisana');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete permission');
    },
  });
}
