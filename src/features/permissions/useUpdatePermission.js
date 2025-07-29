import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { updatePermission as updatePermissionAPI } from '../../services/apiPermissions'; // Your axios service

export function useUpdatePermission() {
  const queryClient = useQueryClient();

  const {
    isError,
    isSuccess,
    isPending: isEditing,
    mutate: updatePermission,
  } = useMutation({
    mutationFn: updatePermissionAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(['permissions']);
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });

  return { isError, isSuccess, isEditing, updatePermission };
}
