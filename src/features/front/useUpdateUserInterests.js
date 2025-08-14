import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { updateUserInterests as updateUserInterestsAPI } from '../../services/apiUserInterests';

export function useUpdateUserInterests() {
  const queryClient = useQueryClient();

  const {
    isError,
    isSuccess,
    isPending: isEditing,
    mutate: updateUserInterests,
  } = useMutation({
    mutationFn: updateUserInterestsAPI,
    onSuccess: () => {
      toast.success(`Pretplaćene kategorije uspješno ažurirane!`);
      queryClient.invalidateQueries(['user_interests']);
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });

  return { isError, isSuccess, isEditing, updateUserInterests };
}
