import { Link } from 'react-router-dom';
import { Layout, Input, Button, Dropdown, Space, Avatar } from 'antd';
import { DownOutlined, UserOutlined, LoginOutlined } from '@ant-design/icons';
import FrontLogo from './FrontLogo';
import styled from 'styled-components';
import { useLogout } from '../../features/authentication/useLogout';
import { useUserPermissions } from '../../features/authentication/useUserPermissions';

const { Header } = Layout;

const StyledHeader = styled(Header)`
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  background: var(--color-grey-0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-bottom: 1px solid var(--color-grey-50);
  padding: 0 2.4rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const CenterSection = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  width: 60%;
  gap: 10rem;
`;

const StyledSearch = styled(Input)`
  border-radius: 0.8rem;
  border: 1px solid var(--color-grey-300);
  transition: all 0.3s;
  color: var(--color-grey-500);

  &:hover {
    border-color: var(--color-brand-500) !important;
  }

  &:focus,
  &.ant-input-focused {
    border-color: var(--color-brand-500) !important;
    box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.2);
    outline: none;
  }
  &.ant-input-affix-wrapper-focused {
    border-color: var(--color-brand-500) !important;
    box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.2);
  }
`;

const NavSection = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  gap: 24px;
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
`;

const LoginButton = styled(Button)`
  color: var(--color-grey-600);
  border: none;
  background: transparent;
  box-shadow: none;

  &:hover {
    color: var(--color-brand-500) !important;
    background: rgba(249, 115, 22, 0.05) !important;
  }
`;

const LogoutButton = styled(Button)`
  color: var(--color-grey-600);
  background: transparent;
  box-shadow: none;

  &:hover {
    color: var(--color-brand-500) !important;
    border-color: var(--color-brand-500) !important;
  }
`;

const RegisterButton = styled(Button)`
  background: var(--color-brand-500);
  border-color: var(--color-brand-500);
  border-radius: 8px;
  font-weight: 500;

  &:hover {
    background: var(--color-brand-600) !important;
    border-color: var(--color-brand-600) !important;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const UserProfileLink = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-grey-600);
`;

const dropdownItems = [
  {
    key: '1',
    label: <Link to="/category/1">Kategorija 1</Link>,
  },
  {
    key: '2',
    label: <Link to="/category/2">Kategorija 2</Link>,
  },
  {
    key: '3',
    label: <Link to="/category/3">Kategorija 3</Link>,
  },
];

export default function FrontHeader() {
  const logout = useLogout();
  const { user } = useUserPermissions();

  return (
    <StyledHeader>
      <CenterSection>
        <LogoContainer>
          <FrontLogo size="small" />
        </LogoContainer>
        <NavSection>
          <Dropdown menu={{ items: dropdownItems }} trigger={['hover']} placement="bottom">
            <NavLink href="#" onClick={(e) => e.preventDefault()}>
              <Space>
                Kategorije
                <DownOutlined />
              </Space>
            </NavLink>
          </Dropdown>
          <Dropdown menu={{ items: dropdownItems }} trigger={['hover']} placement="bottom">
            <NavLink href="#" onClick={(e) => e.preventDefault()}>
              <Space>
                Institucije
                <DownOutlined />
              </Space>
            </NavLink>
          </Dropdown>
          <NavLink to="/">Kontakt</NavLink>
        </NavSection>
      </CenterSection>

      <RightSection>
        {user ? (
          <>
            <UserProfileLink>
              <Avatar icon={<UserOutlined />} style={{ background: 'var(--color-brand-600)' }} />
              {user.first_name} {user.last_name}
            </UserProfileLink>
            <LogoutButton variation="secondary" size="small" onClick={() => logout()}>
              Logout
            </LogoutButton>
          </>
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
