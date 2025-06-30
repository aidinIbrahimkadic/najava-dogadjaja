import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCategory } from '../../services/apiEvents';
import toast from 'react-hot-toast';

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category'] });
      toast.success('Category deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete category');
    },
  });
}
