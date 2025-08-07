import { Outlet, useNavigate } from 'react-router-dom';
import { Layout } from 'antd';

import styled from 'styled-components';
import FrontFooter from './FrontFooter';
import FrontHeader from './FrontHeader';
import { useEffect } from 'react';
import { setRedirectHandler } from '../../utils/redirectService';

const { Content } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledContent = styled(Content)`
  background: var(--color-grey-0);
`;

export default function AppLayoutFront() {
  const navigate = useNavigate();

  useEffect(() => {
    setRedirectHandler((message) => {
      navigate('/login', {
        replace: true,
        state: message ? { error: message } : {},
      });
    });
  }, [navigate]);

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
