import styled from 'styled-components';
import Logo from './Logo';
import MainNav from './MainNav';

const StyledSidebar = styled.aside`
  grid-area: sidebar;
  background-color: var(--color-grey-0);
  border-right: 1px solid var(--color-grey-200);
  padding: 2.4rem;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
  /* transition: all 0.3s ease; */
`;

export default function Sidebar() {
  return (
    <StyledSidebar>
      <Logo />
      <MainNav />
    </StyledSidebar>
  );
}
