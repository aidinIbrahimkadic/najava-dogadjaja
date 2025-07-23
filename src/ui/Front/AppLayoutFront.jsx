import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';

import styled from 'styled-components';
import FrontFooter from './FrontFooter';
import FrontHeader from './FrontHeader';

const { Content } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledContent = styled(Content)`
  background: var(--color-grey-0);
`;

export default function AppLayoutFront() {
  return (
    <StyledLayout>
      <FrontHeader />
      <StyledContent>
        <Outlet />
      </StyledContent>
      <FrontFooter />
    </StyledLayout>
  );
}
