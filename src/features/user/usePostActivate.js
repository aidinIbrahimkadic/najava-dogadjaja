//ZA POSTAVLJANJE REACT QUERY veze na API

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { postActivate as postActivateAPI } from '../../services/apiAuth';
import toast from 'react-hot-toast';

export function usePostActivate() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: postActivate, isPending: isCreating } = useMutation({
    mutationFn: postActivateAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Uspješno aktiviran korisnik!');
      navigate('/users', { replace: true });
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });

  return { postActivate, isCreating };
}
