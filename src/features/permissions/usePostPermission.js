//ZA POSTAVLJANJE REACT QUERY veze na API

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { postPermission as postPermissionApi } from '../../services/apiPermissions';
import toast from 'react-hot-toast';

export function usePostPermission() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: postPermission, isPending: isCreating } = useMutation({
    mutationFn: postPermissionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      toast.success('Uspješno dodana nova rola!');
      navigate('/roles', { replace: true });
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });

  return { postPermission, isCreating };
}
