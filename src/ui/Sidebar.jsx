import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const StyledSidebar = styled.aside`
  grid-area: sidebar;
  background-color: var(--color-grey-0);
  border-right: 1px solid var(--color-grey-200);
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
`;

export default function Sidebar() {
  return (
    <StyledSidebar>
      <h1>LOGO</h1>
      <List>
        <NavLink to="/dashboard">Home</NavLink>
        <NavLink to="/events">Events</NavLink>
        <NavLink to="/categories">Categories</NavLink>
        <NavLink to="/settings">Settings</NavLink>
        <NavLink to="/users">Users</NavLink>
        <NavLink to="/account">Account</NavLink>
      </List>
    </StyledSidebar>
  );
}
