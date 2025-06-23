import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';

import { useUserProfile } from '../features/authentication/useUserProfile';
import { useSidebarCollapsed } from '../context/SidebarContext';
import { logout } from '../services/apiAuth';

import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarRightCollapse } from 'react-icons/tb';
import { useQueryClient } from '@tanstack/react-query';

const StyledHeader = styled.header`
  grid-area: header;
  background-color: var(--color-grey-0);
  border-bottom: 1px solid var(--color-grey-200);
  display: flex;
  justify-content: space-between;
  height: 7rem;
  padding: 1rem;
`;

const UserMenu = styled.div`
  display: flex;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  font-size: 3.2rem;
  cursor: pointer;
  color: var(--color-grey-600);
  z-index: 10;

  &:hover {
    color: var(--color-brand-600);
  }

  transition: color 0.3s ease;
`;

export default function Header() {
  const { isCollapsed, toggleCollapsed } = useSidebarCollapsed();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: user, isLoading } = useUserProfile();
  return (
    <StyledHeader>
      <ToggleButton onClick={toggleCollapsed}>
        {isCollapsed ? <TbLayoutSidebarRightCollapse /> : <TbLayoutSidebarLeftCollapse />}
      </ToggleButton>
      <UserMenu>
        <h2>
          {isLoading && <span>...</span>}
          Dobrodošao {user?.first_name} {user?.last_name}
        </h2>
        {user ? (
          <button onClick={() => logout({ queryClient, navigate })}>Logout</button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </UserMenu>
    </StyledHeader>
  );
}
