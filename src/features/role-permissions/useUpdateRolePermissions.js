import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { updateRolePermissions as updateRolePermissionsAPI } from '../../services/apiRoles'; // Your axios service

export function useUpdateRolePermissions() {
  const queryClient = useQueryClient();

  const {
    isError,
    isSuccess,
    isPending: isEditing,
    mutate: updateRolePermissions,
  } = useMutation({
    mutationFn: updateRolePermissionsAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(['rolePermissions']);
      toast.success(`Uspješno izmijenjene permisije za rolu`);
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });

  return { isError, isSuccess, isEditing, updateRolePermissions };
}
