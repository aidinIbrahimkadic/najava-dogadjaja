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
      navigate(`/resend-email`, { state: { email: data.data.user.email }, replace: true });
      toast.success('Registracija uspješna! Pogledajte email inbox za verifikaciju email adrese');
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });

  return { register, isPending, isError, error };
}
