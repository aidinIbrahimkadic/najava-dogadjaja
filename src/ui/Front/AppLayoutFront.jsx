import { Outlet, useNavigate } from 'react-router-dom';
import { Layout, FloatButton } from 'antd';
import { HiArrowUp } from 'react-icons/hi2';

import styled from 'styled-components';
import FrontFooter from './FrontFooter';
import FrontHeader from './FrontHeader';
import { useEffect } from 'react';
import { setRedirectHandler } from '../../utils/redirectService';
import { useGetAllInstitutions } from '../../features/front/useAllInstitutions';
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
      <FrontHeader
        allInstitutions={allInstitutions}
        isLoadingInstitutions={isLoadingInstitutions}
      />
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
        nextEvent={{
          id: 'abab107e-2a93-4cd5-aea7-b4ad2446b10e', // ili href: '/dogadjaj/...'
          title: 'Promocija knjige: Neki dugi naziv',
          dateISO: '2025-08-19T18:00:00.000Z',
          imageUrl: 'https://events-opcina.poruci.ba/api/image/POSTER_ID?height=200',
        }}
      />
    </StyledLayout>
  );
}
