//ZA POSTAVLJANJE REACT QUERY veze na API

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login as loginApi } from '../../services/apiAuth';

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
      localStorage.setItem('eventsToken', data.token);
      navigate('/dashboard', { replace: true });
    },
    onError: (data) => {
      console.log('ERROR', data.message);
    },
  });

  return { login, isPending, isError, error };
}
