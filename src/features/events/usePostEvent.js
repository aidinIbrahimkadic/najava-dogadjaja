//ZA POSTAVLJANJE REACT QUERY veze na API

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { postEvent as postEventApi } from '../../services/apiEvents';
import toast from 'react-hot-toast';

export function usePostEvent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: postEvent, isPending: isCreating } = useMutation({
    mutationFn: postEventApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Uspješno dodan novi event!');
      navigate('/events', { replace: true });
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });

  return { postEvent, isCreating };
}
