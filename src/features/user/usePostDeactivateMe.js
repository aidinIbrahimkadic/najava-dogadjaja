//ZA POSTAVLJANJE REACT QUERY veze na API

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { postDeactivateMe as postDeactivateMeAPI } from '../../services/apiAuth';
import toast from 'react-hot-toast';

export function usePostDeactivateMe() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: postDeactivateMe, isPending: isCreating } = useMutation({
    mutationFn: postDeactivateMeAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('Uspješno deaktiviran korisnik!');
      localStorage.removeItem('eventsToken');
      localStorage.removeItem('refreshToken');

      queryClient.removeQueries({ queryKey: ['userPermissions'] });
      navigate('/', { replace: true });
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });

  return { postDeactivateMe, isCreating };
}
