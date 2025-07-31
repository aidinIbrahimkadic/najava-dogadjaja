import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { updateUser as updateUserAPI } from '../../services/apiUsers'; // Your axios service

export function useUpdateUser() {
  const queryClient = useQueryClient();

  const {
    isError,
    isSuccess,
    isPending: isEditing,
    mutate: updateUser,
  } = useMutation({
    mutationFn: updateUserAPI,
    onSuccess: () => {
      toast.success('Uspješno izmjenjen korisnik!');
      queryClient.invalidateQueries(['users']);
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });

  return { isError, isSuccess, isEditing, updateUser };
}
