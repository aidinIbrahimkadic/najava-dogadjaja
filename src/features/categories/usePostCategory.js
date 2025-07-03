//ZA POSTAVLJANJE REACT QUERY veze na API

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { postCategory as postCategoryAPI } from '../../services/apiCategories';
import toast from 'react-hot-toast';

export function usePostCategory() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: postCategory, isPending: isCreating } = useMutation({
    mutationFn: postCategoryAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Uspješno dodan nova kategorija!');
      navigate('/categories', { replace: true });
    },
    onError: (err) => {
      toast.error(`${err.response?.data?.message}`);
    },
  });

  // const categoryError = error?.response?.data?.message;

  return { postCategory, isCreating };
}
