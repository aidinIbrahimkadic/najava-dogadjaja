import styled from 'styled-components';
import { Navigate } from 'react-router-dom';
// import { useEffect } from 'react';
import toast from 'react-hot-toast';

import Spinner from './Spinner';
import { useUserPermissions } from '../features/authentication/useUserPermissions';

const FullPage = styled.div`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
`;

function ProtectedRoute({ children }) {
  // 1. Load the authenticated user
  const { isLoading, hasPermission, isAuthenticated } = useUserPermissions();

  // 2. If there is NO authenticated user, redirect to the /login
  // useEffect(
  //   function () {
  //     if (!isAuthenticated && !isLoading) navigate('/login');
  //   },
  //   [isAuthenticated, isLoading, navigate]
  // );

  // 3. While loading, show a spinner
  if (isLoading)
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );

  if (!isAuthenticated) {
    // VISKA ali nek stoji kao osigurač
    toast.error(`Uneseni korisnik ne postoji`);
    return <Navigate to="/login" replace />;
  }

  if (!hasPermission('admin_dashboard')) {
    toast.success(`Dobrdošli na events web aplikaciju!`);
    return <Navigate to="/" replace />;
  }

  // 4. If there IS a user with admin_dashboard permission, render the app
  return children;
}

export default ProtectedRoute;
