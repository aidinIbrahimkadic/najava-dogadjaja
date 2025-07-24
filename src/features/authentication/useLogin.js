//ZA POSTAVLJANJE REACT QUERY veze na API

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login as loginApi } from '../../services/apiAuth';
import toast from 'react-hot-toast';

export function useLogin() {
  const navigate = useNavigate();

  const {
    mutate: login,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      localStorage.setItem('eventsToken', data.data.tokens.access_token);
      localStorage.setItem('refreshToken', data.data.tokens.refresh_token);
      navigate('/dashboard', { replace: true });
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });

  return { login, isPending, isError, error };
}
