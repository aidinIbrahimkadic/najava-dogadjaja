//ZA POSTAVLJANJE REACT QUERY veze na API

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { postLocation as postLocationApi } from '../../services/apiLocations';
import toast from 'react-hot-toast';

export function usePostLocation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: postLocation, isPending: isCreating } = useMutation({
    mutationFn: postLocationApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success('Uspješno dodan nova lokacija!');
      navigate('/locations', { replace: true });
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });

  return { postLocation, isCreating };
}
