//ZA POSTAVLJANJE REACT QUERY veze na API

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { postEvent as postEventApi } from '../../services/apiEvents';
import toast from 'react-hot-toast';

export function usePostEvent() {
  const navigate = useNavigate();

  const { mutate: postEvent, isPending } = useMutation({
    mutationFn: postEventApi,
    onSuccess: () => {
      toast.success('Uspješno dodan novi event!');
      navigate('/events', { replace: true });
    },
    onError: (data) => {
      toast.error(`${data.message}`);
    },
  });

  return { postEvent, isPending };
}
