//ZA POSTAVLJANJE REACT QUERY veze na API

import { useMutation } from '@tanstack/react-query';
import { postActivateMe as postActivateMeAPI } from '../../services/apiAuth';
import toast from 'react-hot-toast';

export function useActivateMe() {
  const {
    mutate: activate,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: postActivateMeAPI,
    onSuccess: () => {
      toast.success('Aktivacijski link poslan na email');
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });

  return { activate, isPending, isError, error };
}
