import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useUserPermissions } from '../features/authentication/useUserPermissions';
import Spinner from './Spinner';

const FullPage = styled.div`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
`;

function ProtectedRoute({ children, requiredPermission }) {
  const { isLoading, hasPermission, isAuthenticated } = useUserPermissions();
  const [unauthorized, setUnauthorized] = useState(false);
  const [missingUser, setMissingUser] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setMissingUser(true);
      toast.error('Uneseni korisnik ne postoji');
    }
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && requiredPermission && !hasPermission(requiredPermission)) {
      setUnauthorized(true);
      // toast.error('Nemate ovlasti za ovu stranicu.');
    }
  }, [isLoading, isAuthenticated, requiredPermission, hasPermission]);

  if (isLoading) {
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );
  }

  if (missingUser) return <Navigate to="/login" replace />;
  if (requiredPermission === 'admin_dashboard' && !hasPermission(requiredPermission))
    return <Navigate to="/" replace />;
  if (unauthorized) return <Navigate to="/dashboard" replace />;

  return children;
}

export default ProtectedRoute;
