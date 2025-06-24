import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { useUserProfile } from '../features/authentication/useUserProfile';
import { useSidebarCollapsed } from '../context/SidebarContext';
import { useLogout } from '../features/authentication/useLogout';

import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarRightCollapse } from 'react-icons/tb';

const StyledHeader = styled.header`
  grid-area: header;
  background-color: var(--color-grey-0);
  border-bottom: 1px solid var(--color-grey-100);
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
  font-size: 2.8rem;
  cursor: pointer;
  color: var(--color-grey-500);
  z-index: 10;

  &:hover {
    color: var(--color-brand-600);
  }

  transition: color 0.3s ease;
`;

export default function Header() {
  const { isCollapsed, toggleCollapsed } = useSidebarCollapsed();
  const logout = useLogout();

  const { data: user, isLoading } = useUserProfile();
  return (
    <StyledHeader>
      <ToggleButton onClick={toggleCollapsed}>
        {isCollapsed ? <TbLayoutSidebarRightCollapse /> : <TbLayoutSidebarLeftCollapse />}
      </ToggleButton>

      {/* Prebaciti u AUTH FEATURES */}
      <UserMenu>
        <h2>
          {isLoading && <span>...</span>}
          Dobrodošao {user?.first_name} {user?.last_name}
        </h2>
        {user ? <button onClick={() => logout()}>Logout</button> : <Link to="/login">Login</Link>}
      </UserMenu>
    </StyledHeader>
  );
}
