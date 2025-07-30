import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteRolePermissions } from '../../services/apiRoles';
import toast from 'react-hot-toast';

export function useDeleteRolePermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRolePermissions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rolePermissions'] });
      toast.success('Permisije role uspješno izbrisane');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete role permission');
    },
  });
}
