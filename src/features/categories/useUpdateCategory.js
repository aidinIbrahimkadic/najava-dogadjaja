import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCategory as updateCategoryAPI } from '../../services/apiCategories'; // Your axios service

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  const {
    isError,
    isSuccess,
    isPending: isEditing,
    mutate: updateCategory,
  } = useMutation({
    mutationFn: updateCategoryAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
    },
    onError: (error) => {
      console.error('Error updating category:', error);
    },
  });

  return { isError, isSuccess, isEditing, updateCategory };
}
