import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { updateRole as updateRoleAPI } from '../../services/apiRoles'; // Your axios service

export function useUpdateRole() {
  const queryClient = useQueryClient();

  const {
    isError,
    isSuccess,
    isPending: isEditing,
    mutate: updateRole,
  } = useMutation({
    mutationFn: updateRoleAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(['roles']);
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });

  return { isError, isSuccess, isEditing, updateRole };
}
