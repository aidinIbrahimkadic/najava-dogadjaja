import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCategory } from '../../services/apiCategories';
import toast from 'react-hot-toast';

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Kategorija uspješno izbrisana');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete category');
    },
  });
}
