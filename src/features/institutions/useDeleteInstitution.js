import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteInstitution } from '../../services/apiInstitutions';
import toast from 'react-hot-toast';

export function useDeleteInstitution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInstitution,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['institutions'] });
      toast.success('Institucija uspješno izbrisana');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete institution');
    },
  });
}
