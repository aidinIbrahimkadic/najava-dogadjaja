import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUserRoles } from '../../services/apiUsers';
import toast from 'react-hot-toast';

export function useDeleteUserRoles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUserRoles,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRoles'] });
      toast.success('Uloge korisnika uspješno izbrisane');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete user role');
    },
  });
}
