//ZA POSTAVLJANJE REACT QUERY veze na API

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { postInstitution as postInstitutionApi } from '../../services/apiInstitutions';
import toast from 'react-hot-toast';

export function usePostInstitution() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: postInstitution, isPending: isCreating } = useMutation({
    mutationFn: postInstitutionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['institutions'] });
      toast.success('Uspješno dodana nova institucija!');
      navigate('/institutions', { replace: true });
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });

  return { postInstitution, isCreating };
}
