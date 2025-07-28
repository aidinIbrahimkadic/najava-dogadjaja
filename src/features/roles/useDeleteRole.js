import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteRole } from '../../services/apiRoles';
import toast from 'react-hot-toast';

export function useDeletRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Rola uspješno izbrisana');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete role');
    },
  });
}
