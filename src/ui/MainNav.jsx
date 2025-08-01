import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import { useSidebarCollapsed } from '../context/SidebarContext';

import CalendarSpinner from './CalendarSpinner';

import {
  HiOutlineHome,
  HiOutlineNumberedList,
  HiOutlineCalendarDays,
  HiOutlineCog6Tooth,
  HiOutlineUsers,
  HiOutlineBuildingLibrary,
  HiOutlineMap,
  HiOutlineIdentification,
} from 'react-icons/hi2';
import { useUserPermissions } from '../features/authentication/useUserPermissions';

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const StyledNavLink = styled(NavLink)`
  &:link,
  &:visited {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    color: var(--color-grey-500);
    font-size: 1.6rem;
    font-weight: 500;
    padding: 1rem 1.2rem;
    transition: all 0.3s;
  }

  &:hover,
  &:active,
  &.active:link,
  &.active:visited {
    color: var(--color-grey-900);
    background-color: var(--color-grey-50);
    border-radius: var(--border-radius-sm);
  }

  & svg {
    width: 2.6rem;
    height: 2.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }

  &:hover svg,
  &:active svg,
  &.active:link svg,
  &.active:visited svg {
    color: var(--color-brand-500);
  }
`;
const IconWrapper = styled.div`
  width: 2.4rem;
  height: 2.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  //Ne dopusta shrink
  flex-shrink: 0;
`;

const Label = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== 'isCollapsed',
})`
  white-space: nowrap;
  overflow: hidden;
  opacity: ${(props) => (props.isCollapsed ? 0 : 1)};
  width: ${(props) => (props.isCollapsed ? '0px' : 'auto')};
  transition:
    opacity 0.3s ease,
    width 0.3s ease,
    margin 0.3s ease;
  margin-left: ${(props) => (props.isCollapsed ? '0' : '1.2rem')};
`;
export default function MainNav() {
  const { isCollapsed } = useSidebarCollapsed();
  const { isLoading, hasPermission } = useUserPermissions();

  {
    isLoading && <CalendarSpinner />;
  }
  return (
    <nav>
      <NavList>
        <li>
          <StyledNavLink to="/dashboard">
            <IconWrapper>
              <HiOutlineHome />
            </IconWrapper>
            <Label isCollapsed={isCollapsed}>Početna</Label>
          </StyledNavLink>
        </li>
        {hasPermission('events_pregled') && (
          <li>
            <StyledNavLink to="/events">
              <IconWrapper>
                <HiOutlineCalendarDays />
              </IconWrapper>
              <Label isCollapsed={isCollapsed}>Događaji</Label>
            </StyledNavLink>
          </li>
        )}

        {hasPermission('events_categories_pregled') && (
          <li>
            <StyledNavLink to="/categories">
              <IconWrapper>
                <HiOutlineNumberedList />
              </IconWrapper>
              <Label isCollapsed={isCollapsed}>Kategorije</Label>
            </StyledNavLink>
          </li>
        )}

        {hasPermission('events_lokacije_pregled') && (
          <li>
            <StyledNavLink to="/locations">
              <IconWrapper>
                <HiOutlineMap />
              </IconWrapper>
              <Label isCollapsed={isCollapsed}>Lokacije</Label>
            </StyledNavLink>
          </li>
        )}

        {hasPermission('events_institucije_pregled') && (
          <li>
            <StyledNavLink to="/institutions">
              <IconWrapper>
                <HiOutlineBuildingLibrary />
              </IconWrapper>
              <Label isCollapsed={isCollapsed}>Institucije</Label>
            </StyledNavLink>
          </li>
        )}

        {hasPermission('admin_settings_pregled') && (
          <li>
            <StyledNavLink to="/settings">
              <IconWrapper>
                <HiOutlineCog6Tooth />
              </IconWrapper>
              <Label isCollapsed={isCollapsed}>Postavke</Label>
            </StyledNavLink>
          </li>
        )}
        {hasPermission('admin_users_save') && (
          <li>
            <StyledNavLink to="/users">
              <IconWrapper>
                <HiOutlineUsers />
              </IconWrapper>
              <Label isCollapsed={isCollapsed}>Korisnici</Label>
            </StyledNavLink>
          </li>
        )}
        {hasPermission('admin_roles_save') && (
          <li>
            <StyledNavLink to="/roles">
              <IconWrapper>
                <HiOutlineIdentification />
              </IconWrapper>
              <Label isCollapsed={isCollapsed}>Uloge</Label>
            </StyledNavLink>
          </li>
        )}

        <li>
          <StyledNavLink to="/">
            <IconWrapper>
              <HiOutlineCog6Tooth />
            </IconWrapper>
            <Label isCollapsed={isCollapsed}>Pocetna front</Label>
          </StyledNavLink>
        </li>
      </NavList>
    </nav>
  );
}
