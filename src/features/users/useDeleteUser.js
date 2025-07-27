import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUser } from '../../services/apiUsers';
import toast from 'react-hot-toast';

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Korinisk uspješno izbrisana');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete user');
    },
  });
}
