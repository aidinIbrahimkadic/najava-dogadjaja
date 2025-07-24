//ZA POSTAVLJANJE REACT QUERY veze na API

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { register as registerApi } from '../../services/apiAuth';
import toast from 'react-hot-toast';

export function useRegister() {
  const navigate = useNavigate();

  const {
    mutate: register,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: registerApi,
    onSuccess: (data) => {
      console.log(data);

      navigate('/login', { replace: true });
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });

  return { register, isPending, isError, error };
}
