import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import Dashboard from './pages/Dashboard';
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

const queryClient = new QueryClient();

function App() {
  return (
    <SidebarCollapseProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <GlobalStyles />
        <BrowserRouter>
          <Routes>
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/events" element={<Events />} />
              <Route path="/event/:eventId" element={<Event />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/institutions" element={<Institutions />} />
              <Route path="/locations" element={<Locations />} />
              <Route path="/account" element={<Account />} />
              <Route path="/users" element={<Users />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route index path="/" element={<HomePage />} />
            <Route path="*" element={<PageNotFound />} />
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
