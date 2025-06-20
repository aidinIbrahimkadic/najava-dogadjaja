import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AdminLayout() {
  return (
    <>
      <h1>Admin Layout</h1>
      <Sidebar />
      <Outlet />
    </>
  );
}
