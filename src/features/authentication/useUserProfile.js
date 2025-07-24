// POPRAVITI VISKA, mozda brisati dok vidim gdje se jos koristi

import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getUserProfile } from '../../services/apiAuth';

export function useUserProfile() {
  const navigate = useNavigate();

  const { isLoading, data: user } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
    enabled: !!localStorage.getItem('eventsToken'),
    onSuccess: (data) => {
      console.log('User loaded:', data);
    },
    onError: (error) => {
      toast.error(`${error.message}`);
      localStorage.removeItem('eventsToken');
      localStorage.removeItem('refreshToken');

      navigate('/login', { replace: true });
    },
  });

  return { isLoading, user };
}
