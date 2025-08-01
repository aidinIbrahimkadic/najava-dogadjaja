// import styled from 'styled-components';
// import { Navigate } from 'react-router-dom';
// import toast from 'react-hot-toast';

// import Spinner from './Spinner';
// import { useUserPermissions } from '../features/authentication/useUserPermissions';

// const FullPage = styled.div`
//   height: 100vh;
//   background-color: var(--color-grey-50);
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;

// function ProtectedRoute({ children }) {
//   const { isLoading, hasPermission, isAuthenticated } = useUserPermissions();

//   if (isLoading)
//     return (
//       <FullPage>
//         <Spinner />
//       </FullPage>
//     );

//   if (!isAuthenticated) {
//     toast.error(`Uneseni korisnik ne postoji`);
//     return <Navigate to="/login" replace />;
//   }

//   if (!hasPermission('admin_dashboard')) {
//     toast.success(`Dobrdošli na events web aplikaciju!`);
//     return <Navigate to="/" replace />;
//   }

//   return children;
// }

// export default ProtectedRoute;

// VERZIJA 2
// import { useEffect } from 'react';
// import toast from 'react-hot-toast';
// import { Navigate } from 'react-router-dom';
// import styled from 'styled-components';
// import { useUserPermissions } from '../features/authentication/useUserPermissions';
// import Spinner from './Spinner';

// const FullPage = styled.div`
//   height: 100vh;
//   background-color: var(--color-grey-50);
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;

// function ProtectedRoute({ children, requiredPermission }) {
//   const { isLoading, hasPermission, isAuthenticated } = useUserPermissions();

//   console.log(requiredPermission);
//   // Toast za neautorizovanog korisnika
//   useEffect(() => {
//     if (!isAuthenticated && !isLoading) {
//       toast.error('Uneseni korisnik ne postoji');
//     }
//   }, [isAuthenticated, isLoading]);

//   // Toast za nedovoljnu ovlast
//   useEffect(() => {
//     if (
//       isAuthenticated &&
//       !isLoading &&
//       requiredPermission &&
//       !hasPermission(requiredPermission) &&
//       requiredPermission !== 'admin_dashboard'
//     ) {
//       toast.error('Nemate ovlasti za ovu stranicu.');
//     }
//   }, [isAuthenticated, isLoading, requiredPermission, hasPermission]);

//   if (isLoading) {
//     return (
//       <FullPage>
//         <Spinner />
//       </FullPage>
//     );
//   }

//   if (!isAuthenticated) {
//     toast.error('Uneseni korisnik ne postoji');
//     return <Navigate to="/login" replace />;
//   }

//   if (requiredPermission === 'admin_dashboard' && !hasPermission(requiredPermission)) {
//     toast.error('Nemate ovlasti za admin dashboard.');
//     return <Navigate to="/" replace />;
//   }

//   if (requiredPermission && !hasPermission(requiredPermission)) {
//     toast.error('Nemate ovlasti za ovu stranicu.');
//     return <Navigate to="/dashboard" replace />;
//   }

//   return children;
// }

// export default ProtectedRoute;

// VERZIJA 3

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
      toast.error('Nemate ovlasti za ovu stranicu.');
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
