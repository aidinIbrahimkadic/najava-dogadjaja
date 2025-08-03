import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
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
      toast.success(`Kategorija uspješno izmjenjena`);
      queryClient.invalidateQueries(['categories']);
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });

  return { isError, isSuccess, isEditing, updateCategory };
}
