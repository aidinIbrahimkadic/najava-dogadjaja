import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { updateUserRoles as updateUserRolesAPI } from '../../services/apiUsers'; // Your axios service

export function useUpdateUserRoles() {
  const queryClient = useQueryClient();

  const {
    isError,
    isSuccess,
    isPending: isEditing,
    mutate: updateUserRoles,
  } = useMutation({
    mutationFn: updateUserRolesAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(['userRoles']);
      toast.success(`Uspješno izmijenjena rola`);
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });

  return { isError, isSuccess, isEditing, updateUserRoles };
}
