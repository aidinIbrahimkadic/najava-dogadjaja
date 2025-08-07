//ZA POSTAVLJANJE REACT QUERY veze na API

import { useMutation } from '@tanstack/react-query';
import { postForgotPassword as postForgotPasswordAPI } from '../../services/apiAuth';
import toast from 'react-hot-toast';

export function usePostForgotPassword() {
  const {
    mutate: postForgotPassword,
    isPending: isCreating,
    isError,
  } = useMutation({
    mutationFn: postForgotPasswordAPI,
    onSuccess: () => {
      toast.success('Pogledajte Vaš email!');
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });

  return { postForgotPassword, isCreating, isError };
}
