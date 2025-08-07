//POPRAVITI NE KORISTI SE NIGDJE

import { useMutation } from '@tanstack/react-query';
import { postResendVerification as postResendVerificationAPI } from '../../services/apiAuth';
import toast from 'react-hot-toast';

export function usePostResendVerification() {
  const {
    mutate: postResendVerification,
    isPending: isCreating,
    isError,
  } = useMutation({
    mutationFn: postResendVerificationAPI,
    onSuccess: () => {
      toast.success('Pogledajte Vaš email!');
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });

  return { postResendVerification, isCreating, isError };
}
