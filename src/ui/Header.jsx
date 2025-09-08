import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

import { useSidebarCollapsed } from '../context/SidebarContext';
import { useLogout } from '../features/authentication/useLogout';

import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarRightCollapse } from 'react-icons/tb';
import { HiOutlineUser, HiChevronDown } from 'react-icons/hi2';
import { BiUser, BiLogOut, BiHelpCircle } from 'react-icons/bi';

import Spinner from './Spinner';
import { useUserPermissions } from '../features/authentication/useUserPermissions';
import { useGetUser } from '../features/users/useUser';

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
  position: relative;
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

const UserMenuButton = styled.button`
  display: flex;
  background-color: var(--color-grey-0);
  padding: 0.8rem 1.2rem;
  border-radius: 1rem;
  align-items: center;
  gap: 1.2rem;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--color-grey-100);
    border-color: var(--color-grey-200);
  }

  &:focus {
    outline: 2px solid var(--color-brand-500);
    outline-offset: 2px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
`;

const UserName = styled.div`
  font-weight: 600;
  color: var(--color-grey-700);
  font-size: 1.4rem;
  line-height: 1.2;
`;

const UserRole = styled.div`
  font-size: 1.2rem;
  color: var(--color-grey-500);
  text-transform: capitalize;
  line-height: 1.2;
`;

const ChevronIcon = styled(HiChevronDown)`
  transition: transform 0.2s ease;
  color: var(--color-grey-500);

  ${({ $isOpen }) =>
    $isOpen &&
    `
    transform: rotate(180deg);
  `}
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 0.8rem);
  right: 0;
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: 1rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  min-width: 18rem;
  z-index: 1000;
  overflow: hidden;
`;

const DropdownItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem 1.6rem;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 1.4rem;
  color: var(--color-grey-700);
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--color-grey-50);
  }

  &:first-child {
    border-bottom: 1px solid var(--color-grey-100);
  }

  svg {
    color: var(--color-grey-500);
  }
`;

const StyledLoginLink = styled(Link)`
  display: flex;
  background-color: var(--color-brand-500);
  color: white;
  padding: 0.8rem 1.6rem;
  border-radius: 0.8rem;
  align-items: center;
  gap: 0.8rem;
  font-weight: 500;
  font-size: 1.4rem;
  text-decoration: none;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--color-brand-600);
  }
`;

export default function Header() {
  const { isCollapsed, toggleCollapsed } = useSidebarCollapsed();
  const logout = useLogout();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { user: userFromCache, isLoading } = useUserPermissions();
  const { user: userFromAPI } = useGetUser(userFromCache?.idguid);

  const user = userFromAPI?.data ? { ...userFromAPI.data } : null;
  const role = user?.roles?.[0]?.name || 'GUEST';

  // Zatvaranje dropdown-a kada se klikne van njega
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleEditProfile = () => {
    setIsDropdownOpen(false);
    // Navigacija će se desiti automatski preko Link komponenta
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
  };

  return (
    <StyledHeader>
      <ToggleButton
        title={isCollapsed ? 'Maksimiziraj bočnu traku' : 'Minimiziraj bočnu traku'}
        onClick={toggleCollapsed}
      >
        {isCollapsed ? <TbLayoutSidebarRightCollapse /> : <TbLayoutSidebarLeftCollapse />}
      </ToggleButton>

      <UserMenu ref={dropdownRef}>
        {isLoading && <Spinner />}

        {user ? (
          <>
            <UserMenuButton onClick={handleDropdownToggle}>
              <HiOutlineUser size={30} />
              <UserInfo>
                <UserName>
                  {user.first_name} {user.last_name}
                </UserName>
                <UserRole>{role === 'Superadmin' ? role : user.institucija?.naziv}</UserRole>
              </UserInfo>
              <ChevronIcon $isOpen={isDropdownOpen} size={16} />
            </UserMenuButton>

            {isDropdownOpen && (
              <Dropdown>
                <DropdownItem as={Link} to="/me" onClick={handleEditProfile}>
                  <BiUser size={18} />
                  Uredi korisnika
                </DropdownItem>
                <DropdownItem as={'a'} target="_blank" href="/Uputstvo%20-%20Najava%20događaja.pdf">
                  <BiHelpCircle size={18} />
                  Uputstvo
                </DropdownItem>

                <DropdownItem onClick={handleLogout}>
                  <BiLogOut size={18} />
                  Odjava
                </DropdownItem>
              </Dropdown>
            )}
          </>
        ) : (
          <StyledLoginLink to="/login">
            <HiOutlineUser size={20} />
            Login
          </StyledLoginLink>
        )}
      </UserMenu>
    </StyledHeader>
  );
}
