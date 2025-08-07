//ZA POSTAVLJANJE REACT QUERY veze na API

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { postDeactivate as postDeactivateAPI } from '../../services/apiAuth';
import toast from 'react-hot-toast';

export function usePostDeactivate() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: postDeactivate, isPending: isCreating } = useMutation({
    mutationFn: postDeactivateAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Uspješno deaktiviran korisnik!');
      navigate('/users', { replace: true });
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });

  return { postDeactivate, isCreating };
}
