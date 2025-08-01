import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { useSidebarCollapsed } from '../context/SidebarContext';
import { useLogout } from '../features/authentication/useLogout';

import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarRightCollapse } from 'react-icons/tb';
import { HiOutlineUser } from 'react-icons/hi2';

import Button from './Button';
import Spinner from './Spinner';
import { useUserPermissions } from '../features/authentication/useUserPermissions';

const StyledHeader = styled.header`
  grid-area: header;
  background-color: var(--color-grey-0);
  border-bottom: 1px solid var(--color-grey-100);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 7rem;
  padding: 1rem 4rem 1rem 1rem;
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  font-size: 2.8rem;
  cursor: pointer;
  color: var(--color-grey-500);
  z-index: 10;

  &:hover {
    color: var(--color-brand-500);
  }

  transition: color 0.3s ease;
`;

const StyledLink = styled(Link)`
  display: flex;
  background-color: var(--color-grey-0);
  padding: 0.5rem;
  border-radius: 1rem;

  &:hover {
    background-color: var(--color-grey-100);
  }
`;

export default function Header() {
  const { isCollapsed, toggleCollapsed } = useSidebarCollapsed();
  const logout = useLogout();

  // POPRAVITI Provjeriti zamijenio sam useUserProfile()
  const { user, isLoading } = useUserPermissions();

  return (
    <StyledHeader>
      <ToggleButton
        title={isCollapsed ? 'Maksimiziraj bočnu traku' : 'Minimiziraj bočnu traku'}
        onClick={toggleCollapsed}
      >
        {isCollapsed ? <TbLayoutSidebarRightCollapse /> : <TbLayoutSidebarLeftCollapse />}
      </ToggleButton>

      {/* Prebaciti u AUTH FEATURES */}
      <UserMenu>
        {isLoading && <Spinner />}
        <StyledLink to="/me">
          <HiOutlineUser size={30} />
        </StyledLink>

        {/* Dobrodošao {user?.first_name} {user?.last_name} */}

        {user ? (
          <Button variation="secondary" size="small" onClick={() => logout()}>
            Logout
          </Button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </UserMenu>
    </StyledHeader>
  );
}
