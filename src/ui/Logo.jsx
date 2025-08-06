import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useSidebarCollapsed } from '../context/SidebarContext';
import { useGetSettings } from '../features/settings/useSettings';
import { FILE_URL } from '../utils/constants';
import Spinner from './Spinner';

const StyledLogo = styled.div`
  text-align: center;
`;

const Img = styled.img.withConfig({
  shouldForwardProp: (prop) => prop !== 'isCollapsed',
})`
  width: auto;
  height: ${(props) => (props.isCollapsed ? '4rem' : '14.6rem')};
  transition: height 0.3s ease;
`;

export default function Logo() {
  const { isCollapsed } = useSidebarCollapsed();
  const { settings, isLoading } = useGetSettings();

  const logoExist = settings?.site_logo.length > 0;

  const src = isCollapsed ? '/Eventura_samo-simbol_novo.png' : '/Eventura_logotip.png';

  return (
    <StyledLogo>
      <Link to="/dashboard">
        {isLoading ? (
          <Spinner />
        ) : logoExist ? (
          <img
            src={
              /^data:image\/[a-z]+;base64,/.test(settings.site_logo)
                ? settings.site_logo
                : `${FILE_URL}${settings.site_logo}`
            }
            alt="Logotip"
            style={{
              width: '100%',
              borderRadius: '8px',
              border: '1px solid #ccc',
            }}
          />
        ) : (
          <Img isCollapsed={isCollapsed} src={src} alt="Logo" />
        )}
      </Link>
    </StyledLogo>
  );
}
