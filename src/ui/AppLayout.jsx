import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

import Sidebar from './Sidebar';
import Header from './Header';
import { useSidebarCollapsed } from '../context/SidebarContext';

const StyledAppLayout = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isCollapsed',
})`
  display: grid;
  grid-template-columns: ${(props) => (props.isCollapsed ? '6rem 1fr' : '28rem 1fr')};
  grid-template-rows: auto 1fr;
  transition: grid-template-columns 0.3s ease;
  height: 100vh;
  grid-template-areas:
    'sidebar header'
    'sidebar main';
`;

const Main = styled.main`
  grid-area: main;
  background-color: var(--color-grey-0);
  overflow-y: auto;
`;
const Container = styled.div`
  margin: 30px 40px;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`;

export default function AppLayout() {
  const { isCollapsed } = useSidebarCollapsed();
  return (
    <StyledAppLayout isCollapsed={isCollapsed}>
      <Header />
      <Sidebar />
      <Main>
        <Container>
          <Outlet />
        </Container>
      </Main>
    </StyledAppLayout>
  );
}
