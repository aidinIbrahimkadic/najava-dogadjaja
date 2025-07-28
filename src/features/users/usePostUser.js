//ZA POSTAVLJANJE REACT QUERY veze na API

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { postUser as postUserApi } from '../../services/apiUsers';
import toast from 'react-hot-toast';

export function usePostUser() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: postUser, isPending: isCreating } = useMutation({
    mutationFn: postUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Uspješno dodan novi korisnik!');
      navigate('/users', { replace: true });
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });

  return { postUser, isCreating };
}
