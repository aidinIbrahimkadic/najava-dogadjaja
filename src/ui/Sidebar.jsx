import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <ul>
      <NavLink to="/dashboard">Home</NavLink>
      <NavLink to="/events">Events</NavLink>
      <NavLink to="/categories">Categories</NavLink>
      <NavLink to="/settings">Settings</NavLink>
      <NavLink to="/users">Users</NavLink>
      <NavLink to="/account">Account</NavLink>
    </ul>
  );
}
