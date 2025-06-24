import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useSidebarCollapsed } from '../context/SidebarContext';

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

  const src = isCollapsed ? '/Eventura_samo-simbol_novo.png' : '/Eventura_logotip.png';

  return (
    <StyledLogo>
      <Link to="/dashboard">
        <Img isCollapsed={isCollapsed} src={src} alt="Logo" />
      </Link>
    </StyledLogo>
  );
}
