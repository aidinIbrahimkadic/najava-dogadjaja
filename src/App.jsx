import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import DashboardPage from './pages/DashboardPage';
import Events from './pages/Events';
import Event from './pages/Event';
import Categories from './pages/Categories';
import Settings from './pages/Settings';
import Account from './pages/Account';
import Users from './pages/Users';
import Institutions from './pages/Institutions';
import Locations from './pages/Locations';
import PageNotFound from './pages/PageNotFound';
import Login from './pages/Login';
import GlobalStyles from './styles/GlobalStyles';
import AppLayout from './ui/AppLayout';
import { SidebarCollapseProvider } from './context/SidebarContext';
import { Toaster } from 'react-hot-toast';
import SignUp from './pages/SignUp';
import HomePage from './pages/HomePage';
import ProtectedRoute from './ui/ProtectedRoute';
import UserProfile from './pages/UserProfile';
import AppLayoutFront from './ui/Front/AppLayoutFront';
import ScrollToTop from './utils/ScrollToTop';
import Roles from './pages/Roles';
import VerifyEmail from './features/authentication/VerifyEmail';
import ForgotPasswordForm from './features/authentication/ForgotPasswordForm';
import ResetPasswordForm from './features/authentication/ResetPasswordForm';
import ResendEmail from './features/authentication/ResendEmail';
import InstitutionPage from './pages/InstitutionPage';
import EventPage from './pages/EventPage';
import UserProfilePage from './pages/UserProfilePage';
import ActivateForm from './features/authentication/ActivateForm';
import ActivateAccount from './features/authentication/ActivateAccount';
import Manifestations from './pages/Manifestations';
import ManifestationPage from './pages/ManifestationPage';

const queryClient = new QueryClient();

function App() {
  return (
    <SidebarCollapseProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <GlobalStyles />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route
              element={
                <ProtectedRoute requiredPermission="admin_dashboard">
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route
                path="/events"
                element={
                  <ProtectedRoute requiredPermission="events_pregled">
                    <Events />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manifestations"
                element={
                  <ProtectedRoute requiredPermission="events_pregled">
                    <Manifestations />
                  </ProtectedRoute>
                }
              />
              {/* <Route path="/event/:eventId" element={<Event />} /> */}
              <Route
                path="/categories"
                element={
                  <ProtectedRoute requiredPermission="events_categories_pregled">
                    <Categories />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/settings"
                element={
                  <ProtectedRoute requiredPermission="admin_settings_pregled">
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/institutions"
                element={
                  <ProtectedRoute requiredPermission="events_institucije_pregled">
                    <Institutions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/locations"
                element={
                  <ProtectedRoute requiredPermission="events_lokacije_pregled">
                    <Locations />
                  </ProtectedRoute>
                }
              />
              <Route path="/account" element={<Account />} />
              <Route path="/me" element={<UserProfile />} />
              <Route
                path="/users"
                element={
                  <ProtectedRoute requiredPermission="admin_users_save">
                    <Users />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/roles"
                element={
                  <ProtectedRoute requiredPermission="admin_roles_save">
                    <Roles />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route element={<AppLayoutFront />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<SignUp />} />
              <Route path="/resend-email" element={<ResendEmail />} />
              <Route path="/forgot-password" element={<ForgotPasswordForm />} />
              <Route path="/reset-password" element={<ResetPasswordForm />} />
              <Route path="/aktivacija-racuna" element={<ActivateForm />} />
              <Route path="/auth/verify-email" element={<VerifyEmail />} />
              <Route path="/activate-account" element={<ActivateAccount />} />
              <Route path="/institution/:id" element={<InstitutionPage />} />
              <Route path="/dogadjaj/:id" element={<EventPage />} />
              <Route path="/manifestation/:id" element={<ManifestationPage />} />
              <Route
                path="/userProfile"
                element={
                  <ProtectedRoute requiredPermission="events_user_interests_save">
                    <UserProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route index path="/" element={<HomePage />} />
              <Route path="*" element={<PageNotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{ margin: '8px' }}
          toastOptions={{
            success: {
              duration: 3000,
            },
            error: {
              duration: 5000,
            },
            style: {
              fontSize: '16px',
              maxWidth: '500px',
              padding: '16px 24px',
              backgroundColor: 'var(--color-grey-0)',
              color: 'var(--color-grey-700)',
            },
          }}
        />
      </QueryClientProvider>
    </SidebarCollapseProvider>
  );
}

export default App;
