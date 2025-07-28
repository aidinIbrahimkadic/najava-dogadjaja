import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { updateInstitution as updateInstitutionAPI } from '../../services/apiInstitutions'; // Your axios service

export function useUpdateInstitution() {
  const queryClient = useQueryClient();

  const {
    isError,
    isSuccess,
    isPending: isEditing,
    mutate: updateInstitution,
  } = useMutation({
    mutationFn: updateInstitutionAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(['institutions']);
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });

  return { isError, isSuccess, isEditing, updateInstitution };
}
