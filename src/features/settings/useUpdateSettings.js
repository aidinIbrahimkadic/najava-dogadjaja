import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { updateSettings as updateSettingsAPI } from '../../services/apiSettings'; // Your axios service

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  const {
    isError,
    isSuccess,
    isPending: isEditing,
    mutate: updateSettings,
  } = useMutation({
    mutationFn: updateSettingsAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(['settings']);
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });

  return { isError, isSuccess, isEditing, updateSettings };
}
