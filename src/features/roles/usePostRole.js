//ZA POSTAVLJANJE REACT QUERY veze na API

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { postRole as postRoleApi } from '../../services/apiRoles';
import toast from 'react-hot-toast';

export function usePostRole() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: postRole, isPending: isCreating } = useMutation({
    mutationFn: postRoleApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Uspješno dodana nova rola!');
      navigate('/roles', { replace: true });
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });

  return { postRole, isCreating };
}
