import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { updateMe as updateMeAPI } from '../../services/apiUsers'; // Your axios service

export function useUpdateMe() {
  const queryClient = useQueryClient();

  const {
    isError,
    isSuccess,
    isPending: isEditing,
    mutate: updateMe,
  } = useMutation({
    mutationFn: updateMeAPI,
    onSuccess: () => {
      toast.success('Uspješno izmjenjen korisnik!');
      queryClient.invalidateQueries(['user']);
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });

  return { isError, isSuccess, isEditing, updateMe };
}
