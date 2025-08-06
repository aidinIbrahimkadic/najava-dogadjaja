import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

import Sidebar from './Sidebar';
import Header from './Header';
import { useSidebarCollapsed } from '../context/SidebarContext';
import { useGetSettings } from '../features/settings/useSettings';

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
    'sidebar main'
    'sidebar footer';
`;

const Main = styled.main`
  position: relative;
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
const Footer = styled.footer`
  height: 5rem;
  padding: 1rem 3rem;
  display: flex;
  align-items: center;
  background: linear-gradient(to top, var(--color-grey-0), var(--color-grey-50));
  color: var(--color-grey-500);
  font-size: 1.4rem;
  font-weight: 100;
`;

export default function AppLayout() {
  const { settings } = useGetSettings();
  const { isCollapsed } = useSidebarCollapsed();
  const currentYear = new Date().getFullYear();

  return (
    <StyledAppLayout isCollapsed={isCollapsed}>
      <Header />
      <Sidebar />
      <Main>
        <Container>
          <Outlet />
        </Container>
      </Main>
      <Footer>
        <span>
          <a href={`https://www.${settings?.site_link}`} target="_blank" rel="noopener noreferrer">
            © {currentYear} {settings?.site_copyright}
          </a>
        </span>
      </Footer>
    </StyledAppLayout>
  );
}
