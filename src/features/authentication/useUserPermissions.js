import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getUserPermissions } from '../../services/apiAuth';

// export function useUserPermissions() {
//   const navigate = useNavigate();

//   const {
//     data: {
//       data: { user, permissions, roles, summary } = {}, // fallback ako `data` ne postoji
//     } = {},
//     isLoading,
//   } = useQuery({
//     queryKey: ['userPermissions'],
//     queryFn: getUserPermissions,
//     enabled: !!localStorage.getItem('eventsToken'),
//     onSuccess: (data) => {
//       console.log('User loaded:', data);
//     },
//     onError: (error) => {
//       console.log('Failed to load profile:', error.message);
//       localStorage.removeItem('eventsToken');
//       localStorage.removeItem('refreshToken');

//       navigate('/login', { replace: true });
//     },
//   });

//   console.log('user', user);
//   console.log('permissions', permissions);
//   console.log('roles', roles[0].name);
//   console.log('summary', summary);

//   //   console.log('IZ useUserPermissions HOOK: ' + JSON.stringify(permissions, null, 2));
//   // POPRAVITI isAuthenticated: user?.role === "authenticated"
//   return { permissions, isLoading, isAuthenticated: roles[0].name === 'Superadmin' };
// }

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
