//ZA POSTAVLJANJE REACT QUERY veze na API

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { postVerifyEmail as postVerifyEmailAPI } from '../../services/apiAuth';
import toast from 'react-hot-toast';

export function usePostVerifyEmail() {
  const navigate = useNavigate();
  //   const queryClient = useQueryClient();

  const { mutate: postVerifyEmail, isPending: isCreating } = useMutation({
    mutationFn: postVerifyEmailAPI,
    onSuccess: () => {
      //   queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Uspješno verifikovan email!');
      navigate('/login', { replace: true });
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });

  // const categoryError = error?.response?.data?.message;

  return { postVerifyEmail, isCreating };
}
