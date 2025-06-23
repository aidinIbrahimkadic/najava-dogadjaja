import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import { useSidebarCollapsed } from '../context/SidebarContext';

import {
  HiOutlineHome,
  HiOutlineNumberedList,
  HiOutlineCalendarDays,
  HiOutlineCog6Tooth,
  HiOutlineUsers,
} from 'react-icons/hi2';

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
    color: var(--color-grey-600);
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
    background-color: var(--color-grey-100);
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
    color: var(--color-brand-600);
  }
`;
const IconWrapper = styled.div`
  width: 2.8rem;
  height: 2.8rem;
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

  return (
    <nav>
      <NavList>
        <li>
          <StyledNavLink to="/dashboard">
            <IconWrapper>
              <HiOutlineHome />
            </IconWrapper>
            <Label isCollapsed={isCollapsed}>Home</Label>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/events">
            <IconWrapper>
              <HiOutlineCalendarDays />
            </IconWrapper>
            <Label isCollapsed={isCollapsed}>Bookings</Label>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/categories">
            <IconWrapper>
              <HiOutlineNumberedList />
            </IconWrapper>
            <Label isCollapsed={isCollapsed}>Categories</Label>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/users">
            <IconWrapper>
              <HiOutlineUsers />
            </IconWrapper>
            <Label isCollapsed={isCollapsed}>Users</Label>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/settings">
            <IconWrapper>
              <HiOutlineCog6Tooth />
            </IconWrapper>
            <Label isCollapsed={isCollapsed}>Settings</Label>
          </StyledNavLink>
        </li>
      </NavList>
    </nav>
  );
}
