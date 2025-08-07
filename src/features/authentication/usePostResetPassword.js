//ZA POSTAVLJANJE REACT QUERY veze na API

import { useMutation } from '@tanstack/react-query';
import { postResetPassword as postResetPasswordAPI } from '../../services/apiAuth';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export function usePostResetPassword() {
  const navigate = useNavigate();

  const {
    mutate: postResetPassword,
    isPending: isCreating,
    isError,
  } = useMutation({
    mutationFn: postResetPasswordAPI,
    onSuccess: () => {
      toast.success('Uspješno izmijenjena lozinka! Prijavite se u aplikaciju!');
      navigate('/login', { replace: true });
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });

  return { postResetPassword, isCreating, isError };
}
