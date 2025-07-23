// POPRAVITI IZBRISATI
// import styled from 'styled-components';

// export const Logo = styled.div`
//   width: 40px;
//   height: 40px;
//   background: linear-gradient(135deg, #f97316, #ea580c);
//   border-radius: 8px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   color: white;
//   font-weight: bold;
//   font-size: 18px;
//   margin-right: 24px;
// `;

import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledLogo = styled.div`
  text-align: center;
  height: 100%;
`;

const Img = styled.img.withConfig({
  shouldForwardProp: (prop) => prop !== 'size',
})`
  width: auto;
  height: ${(props) =>
    props.size === 'small' ? '6rem' : props.size === 'medium' ? '9rem' : '12rem'};
  transition: height 0.3s ease;
`;

export default function FrontLogo({ size }) {
  const src = '/Eventura_logotip.png';

  return (
    <StyledLogo>
      <Link to="/">
        <Img size={size} src={src} alt="Logo" />
      </Link>
    </StyledLogo>
  );
}
