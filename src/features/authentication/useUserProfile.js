import { useQuery } from '@tanstack/react-query';
// import toast from 'react-hot-toast';
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
      console.log('Failed to load profile:', error.message);
      // toast.error('Ne postoji korisnik');
      localStorage.removeItem('eventsToken');

      navigate('/login', { replace: true });
    },
  });

  // POPRAVITI isAuthenticated: user?.role === "authenticated"
  return { isLoading, user, isAuthenticated: user?.email };
}
