import styled from 'styled-components';
import { useSidebarCollapsed } from '../context/SidebarContext';
import Logo from './Logo';
import MainNav from './MainNav';

const StyledSidebar = styled.aside.withConfig({
  shouldForwardProp: (prop) => prop !== 'isCollapsed',
})`
  grid-area: sidebar;
  background-color: var(--color-grey-0);
  border-right: 1px solid var(--color-grey-100);
  padding: ${(props) => (props.isCollapsed ? '2.4rem 0.5rem' : '2.4rem')};
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
  transition: all 0.3s ease;
`;

export default function Sidebar() {
  const { isCollapsed } = useSidebarCollapsed();
  return (
    <StyledSidebar isCollapsed={isCollapsed}>
      <Logo />
      <MainNav />
    </StyledSidebar>
  );
}
