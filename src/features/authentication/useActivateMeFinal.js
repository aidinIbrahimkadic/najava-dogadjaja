//ZA POSTAVLJANJE REACT QUERY veze na API

import { useMutation } from '@tanstack/react-query';
import { postActivateMeFinal as postActivateMeFinalAPI } from '../../services/apiAuth';
import toast from 'react-hot-toast';

export function useActivateMeFinal() {
  const {
    mutate: activateFinal,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: postActivateMeFinalAPI,
    onSuccess: () => {
      toast.success('Račun uspješno aktiviran! Dobrodošli nazad!');
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });

  return { activateFinal, isPending, isError, error };
}
