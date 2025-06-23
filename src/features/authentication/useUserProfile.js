import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getUserProfile } from '../../services/apiAuth';

export function useUserProfile() {
  const navigate = useNavigate();

  return useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
    enabled: !!localStorage.getItem('eventsToken'),
    onSuccess: (data) => {
      console.log('User loaded:', data);
    },
    onError: (error) => {
      console.log('Failed to load profile:', error.message);
      localStorage.removeItem('eventsToken');
      navigate('/login', { replace: true });
    },
  });
}
