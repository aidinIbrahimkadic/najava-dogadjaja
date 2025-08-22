//ZA POSTAVLJANJE REACT QUERY veze na API

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { postManifestation as postManifestationApi } from '../../services/apiManifestations';
import toast from 'react-hot-toast';

export function usePostManifestation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: postManifestation, isPending: isCreating } = useMutation({
    mutationFn: postManifestationApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manifestations'] });
      toast.success('Uspješno dodan nova nova manifestacija!');
      navigate('/manifestations', { replace: true });
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });

  return { postManifestation, isCreating };
}
