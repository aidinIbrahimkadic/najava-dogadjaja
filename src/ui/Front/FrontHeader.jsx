import { Link, useLocation } from 'react-router-dom';
import { Layout, Button } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import FrontLogo from './FrontLogo';
import styled, { css } from 'styled-components';
import { useLogout } from '../../features/authentication/useLogout';
import { useUserPermissions } from '../../features/authentication/useUserPermissions';
import { useEffect, useRef, useState } from 'react';
import { HiOutlineUser, HiChevronDown } from 'react-icons/hi2';
import { BiUser, BiLogOut, BiBuilding } from 'react-icons/bi';

const { Header } = Layout;

/* ----------------------------- Styled Blocks ----------------------------- */
const StyledHeader = styled.header`
  position: sticky; /* STICKY */
  top: 0; /* STICKY */
  z-index: 1000; /* Iznad sadržaja */
  grid-area: header;
  background-color: var(--color-grey-0);
  border-bottom: 1px solid var(--color-grey-100);
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 7rem;
  padding: 1rem;
  backdrop-filter: saturate(160%) blur(6px);

  ${({ $scrolled }) =>
    $scrolled &&
    css`
      box-shadow: 0 6px 14px rgba(0, 0, 0, 0.06);
      border-bottom-color: var(--color-grey-200);
    `}
`;

const CenterSection = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  width: 60%;
  gap: 10rem;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const NavSection = styled.nav`
  display: flex;
  height: 100%;
  align-items: center;
  gap: 24px;

  @media (max-width: 605px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: var(--color-grey-700);
  text-decoration: none;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    color: var(--color-brand-700);
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  @media (max-width: 380px) {
    gap: 1rem;
  }
  @media (max-width: 280px) {
    gap: 0.2rem;
  }
`;

/* ------------------------------ Dropdown UI ----------------------------- */
const DropdownWrap = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

const DropdownPanel = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: calc(100% + 1.2rem);
  right: 0rem;
  /* right: ${({ $alignRight }) => ($alignRight ? 0 : 'auto')}; */
  /* left: ${({ $alignRight }) => ($alignRight ? 'auto' : 0)}; */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: 1rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  min-width: 20rem;
  z-index: 1000;
  overflow: hidden;
`;

const DropdownToggle = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.4rem;
  font-weight: 500;
  color: var(--color-grey-700);

  &:hover {
    color: var(--color-brand-700);
  }
`;

const DropdownItemLink = styled(Link)`
  display: grid;
  grid-template-columns: 1.5rem 1fr;
  gap: 1rem;
  padding: 0.8rem 1rem;
  font-size: 1.4rem;
  color: var(--color-grey-700);
  text-decoration: none;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--color-grey-50);
    color: var(--color-grey-700);
  }
`;

const DropdownItemButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem 1.6rem;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 1.4rem;
  color: var(--color-grey-700);
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--color-grey-50);
  }
  svg {
    color: var(--color-grey-500);
  }
`;

/* ----------------------------- User Menu Bits --------------------------- */
const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  position: relative;
`;

const UserMenuButton = styled.button`
  display: flex;
  background-color: var(--color-grey-0);
  padding: 0.8rem 1.2rem;
  border-radius: 1rem;
  align-items: center;
  gap: 1.2rem;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--color-grey-100);
    border-color: var(--color-grey-200);
  }

  &:focus {
    outline: 2px solid var(--color-brand-500);
    outline-offset: 2px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;

  @media (max-width: 605px) {
    display: none;
  }
`;

const UserName = styled.div`
  font-weight: 600;
  color: var(--color-grey-700);
  font-size: 1.4rem;
  line-height: 1.2;
`;

const ChevronIcon = styled(HiChevronDown)`
  transition: transform 0.2s ease;
  color: var(--color-grey-500);
  ${({ $isOpen }) => $isOpen && `transform: rotate(180deg);`}
`;

/* ----------------------------- Auth Buttons ----------------------------- */
const LoginButton = styled(Button)`
  color: var(--color-grey-600);
  border: none;
  background: transparent;
  box-shadow: none;

  &:hover {
    color: var(--color-brand-500) !important;
    background: rgba(249, 115, 22, 0.05) !important;
  }

  @media (max-width: 380px) {
    font-size: 12px;
    padding: 0.4rem 0.8rem;
  }
  @media (max-width: 280px) {
    font-size: 10px;
    padding: 0.2rem 0.4rem;
  }
`;

const RegisterButton = styled(Button)`
  background: var(--color-brand-500);
  border-color: var(--color-brand-500);
  border-radius: 8px;
  font-weight: 500;

  @media (max-width: 380px) {
    font-size: 12px;
    padding: 0.4rem 0.8rem;
  }
  @media (max-width: 280px) {
    font-size: 10px;
    padding: 0.2rem 0.4rem;
  }
  &:hover {
    background: var(--color-brand-600) !important;
    border-color: var(--color-brand-600) !important;
  }
`;

/* --------------------------------- View --------------------------------- */
export default function FrontHeader({ allInstitutions, settings }) {
  const institucije = allInstitutions?.map((inst) => ({
    id: inst.idguid,
    naziv: inst.naziv,
    link: `/institution/${inst.idguid}`,
  }));

  const [isInstOpen, setIsInstOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false); // NEW

  const instRef = useRef(null);
  const userRef = useRef(null);

  const logout = useLogout();
  const { user, roles = [] } = useUserPermissions();
  const { pathname } = useLocation();

  const isAdmin = roles[0]?.name !== 'Public';

  /* ---------------------------- Global handlers --------------------------- */
  useEffect(() => {
    function onDocClick(e) {
      if (instRef.current && !instRef.current.contains(e.target)) setIsInstOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setIsUserOpen(false);
    }
    function onEsc(e) {
      if (e.key === 'Escape') {
        setIsInstOpen(false);
        setIsUserOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  // Zatvori dropdown na promjenu rute
  useEffect(() => {
    setIsInstOpen(false);
    setIsUserOpen(false);
  }, [pathname]);

  // Praćenje skrola radi sjene
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    setIsUserOpen(false);
    logout();
  };

  return (
    <StyledHeader $scrolled={scrolled}>
      <CenterSection>
        <LogoContainer>
          <FrontLogo site_logo={settings.site_logo} size="small" />
        </LogoContainer>

        <NavSection>
          <NavLink
            to="/"
            onClick={(e) => {
              if (pathname === '/') {
                e.preventDefault();
                (document.documentElement || document.body).scrollTo({
                  top: 0,
                  behavior: 'smooth',
                });
              }
            }}
          >
            Početna
          </NavLink>

          {/* Dropdown: Institucije */}
          <DropdownWrap ref={instRef}>
            <DropdownToggle
              onClick={() => setIsInstOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={isInstOpen}
              aria-label="Institucije meni"
            >
              Institucije
              <ChevronIcon $isOpen={isInstOpen} size={16} />
            </DropdownToggle>

            {isInstOpen && (
              <DropdownPanel role="menu" aria-label="Institucije meni" $alignRight={false}>
                {institucije?.map((inst) => (
                  <DropdownItemLink
                    key={inst.id}
                    to={inst.link}
                    onClick={() => setIsInstOpen(false)}
                    role="menuitem"
                  >
                    <BiBuilding size={18} />
                    {inst.naziv}
                  </DropdownItemLink>
                ))}
              </DropdownPanel>
            )}
          </DropdownWrap>
        </NavSection>
      </CenterSection>

      <RightSection>
        {user ? (
          <UserMenu ref={userRef}>
            <UserMenuButton
              onClick={() => setIsUserOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={isUserOpen}
              aria-label="Korisnički meni"
            >
              <HiOutlineUser size={30} />
              <UserInfo>
                <UserName>
                  {user.first_name} {user.last_name}
                </UserName>
              </UserInfo>
              <ChevronIcon $isOpen={isUserOpen} size={16} />
            </UserMenuButton>

            {isUserOpen && (
              <DropdownPanel role="menu" aria-label="Korisnički meni" $alignRight>
                <DropdownItemLink
                  to={isAdmin ? '/me' : '/userProfile'}
                  onClick={() => setIsUserOpen(false)}
                  role="menuitem"
                >
                  <BiUser size={18} />
                  Uredi korisnika
                </DropdownItemLink>

                <DropdownItemLink onClick={handleLogout} role="menuitem">
                  <BiLogOut size={18} />
                  Logout
                </DropdownItemLink>
              </DropdownPanel>
            )}
          </UserMenu>
        ) : (
          <>
            <NavLink to="/login">
              <LoginButton icon={<LoginOutlined />}>Prijava</LoginButton>
            </NavLink>
            <NavLink to="/register">
              <RegisterButton type="primary">Registracija</RegisterButton>
            </NavLink>
          </>
        )}
      </RightSection>
    </StyledHeader>
  );
}
