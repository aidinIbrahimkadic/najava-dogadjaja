// import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';

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

  const { pathname } = useLocation();

  return (
    <StyledLogo>
      <Link
        to="/"
        onClick={(e) => {
          if (pathname === '/') {
            e.preventDefault(); // već si na '/', spriječi re-navigaciju
            (document.documentElement || document.body).scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      >
        <Img size={size} src={src} alt="Logo" />
      </Link>
    </StyledLogo>
  );
}
