import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getUserPermissions } from '../../services/apiAuth';

export function useUserPermissions() {
  const navigate = useNavigate();

  const { data: { data: { user, permissions = [], roles = [], summary } = {} } = {}, isLoading } =
    useQuery({
      queryKey: ['userPermissions'],
      queryFn: getUserPermissions,
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

  const hasPermission = (permissionName) => permissions.some((p) => p.name === permissionName);

  const isAuthenticated = !!user?.idguid;

  return {
    user,
    roles,
    permissions,
    summary,
    isLoading,
    isAuthenticated,
    hasPermission,
  };
}
