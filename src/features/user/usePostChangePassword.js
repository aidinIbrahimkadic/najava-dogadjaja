import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postChangePassword } from '../../services/apiAuth';
import toast from 'react-hot-toast';

export function usePostChangePassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postChangePassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('Lozinka uspješno promijenjena');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update password');
    },
  });
}
