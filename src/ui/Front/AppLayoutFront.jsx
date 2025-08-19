import { Outlet, useNavigate } from 'react-router-dom';
import { Layout, FloatButton } from 'antd';
import { HiArrowUp } from 'react-icons/hi2';

import styled from 'styled-components';
import FrontFooter from './FrontFooter';
import FrontHeader from './FrontHeader';
import { useEffect } from 'react';
import { setRedirectHandler } from '../../utils/redirectService';
import { useGetAllInstitutions } from '../../features/front/useAllInstitutions';
import { useGetAllSettings } from '../../features/front/useAllSettings';
import Spinner from '../Spinner';
const { Content } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledContent = styled(Content)`
  background: var(--color-grey-0);
`;

const StyledBackTop = styled(FloatButton.BackTop)`
  /* boja pozadine */
  .ant-float-btn-body {
    color: var(--color-grey-0) !important;
    background-color: var(--color-brand-600);
  }
  /* boja na hover */
  &:hover .ant-float-btn-body {
    color: var(--color-grey-0) !important;
    background-color: var(--color-brand-700);
  }
  /* boja ikone */
  .ant-float-btn-icon {
    color: var(--color-grey-0) !important;
  }
  /* opcionalno: jači border-radius (ionako je circle) */
  .ant-float-btn-body {
    color: var(--color-grey-0);
    border-radius: 999px;
  }
`;

export default function AppLayoutFront() {
  const { isLoading: isLoadingInstitutions, allInstitutions } = useGetAllInstitutions();
  const { isLoading: isLoadingSettings, settings } = useGetAllSettings();

  const navigate = useNavigate();

  useEffect(() => {
    setRedirectHandler((message) => {
      navigate('/login', {
        replace: true,
        state: message ? { error: message } : {},
      });
    });
  }, [navigate]);

  return isLoadingSettings || isLoadingInstitutions ? (
    <Spinner />
  ) : (
    <StyledLayout>
      <FrontHeader allInstitutions={allInstitutions} settings={settings} />
      <StyledContent>
        <Outlet />
      </StyledContent>

      {/* To the Top button */}
      <StyledBackTop
        visibilityHeight={200}
        style={{ right: 50, bottom: 54 }}
        icon={<HiArrowUp />}
      />

      <FrontFooter
        description="Platforma za najavu događaja Općine Tešanj."
        institucije={allInstitutions}
        settings={settings}
      />
    </StyledLayout>
  );
}
