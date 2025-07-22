import { Link, Outlet } from 'react-router-dom';
import { Layout, Input, Button, Dropdown, Space } from 'antd';
import { SearchOutlined, DownOutlined, UserOutlined, LoginOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Header, Content, Footer } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledHeader = styled(Header)`
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-bottom: 1px solid #f0f0f0;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #f97316, #ea580c);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
  margin-right: 24px;
`;

const CenterSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 800px;
  gap: 32px;
`;

const SearchContainer = styled.div`
  flex: 1;
  max-width: 400px;
`;

const StyledSearch = styled(Input)`
  .ant-input {
    border-radius: 8px;
    border: 1px solid #d9d9d9;

    &:hover {
      border-color: #f97316;
    }

    &:focus {
      border-color: #f97316;
      box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.2);
    }
  }
`;

const NavSection = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const NavLink = styled(Link)`
  color: #595959;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    color: #f97316;
    background: rgba(249, 115, 22, 0.05);
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LoginButton = styled(Button)`
  color: #595959;
  border: none;
  background: transparent;
  box-shadow: none;

  &:hover {
    color: #f97316 !important;
    background: rgba(249, 115, 22, 0.05) !important;
  }
`;

const RegisterButton = styled(Button)`
  background: #f97316;
  border-color: #f97316;
  border-radius: 8px;
  font-weight: 500;

  &:hover {
    background: #ea580c !important;
    border-color: #ea580c !important;
  }
`;

const StyledContent = styled(Content)`
  background: #fafafa;
`;

const StyledFooter = styled(Footer)`
  background: #001529;
  color: rgba(255, 255, 255, 0.85);
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 0;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 48px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const FooterSection = styled.div`
  h3 {
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 16px;
  }

  p {
    color: rgba(255, 255, 255, 0.65);
    line-height: 1.6;
    margin-bottom: 16px;
  }
`;

const FooterLink = styled.a`
  display: block;
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  padding: 4px 0;
  transition: color 0.2s ease;

  &:hover {
    color: #f97316;
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 24px;
  text-align: center;
  color: rgba(255, 255, 255, 0.45);
`;

const dropdownItems = [
  {
    key: '1',
    label: 'Kategorija 1',
  },
  {
    key: '2',
    label: 'Kategorija 2',
  },
  {
    key: '3',
    label: 'Kategorija 3',
  },
];

export default function AppLayoutFront() {
  return (
    <StyledLayout>
      <StyledHeader>
        <Logo>L</Logo>

        <CenterSection>
          <SearchContainer>
            <StyledSearch placeholder="Pretraži..." prefix={<SearchOutlined />} size="large" />
          </SearchContainer>

          <NavSection>
            <NavLink to="/">Početna</NavLink>
            <Dropdown menu={{ items: dropdownItems }} trigger={['hover']}>
              <NavLink href="#" onClick={(e) => e.preventDefault()}>
                <Space>
                  Kategorije
                  <DownOutlined />
                </Space>
              </NavLink>
            </Dropdown>
          </NavSection>
        </CenterSection>

        <RightSection>
          <NavLink to="/login">
            <LoginButton icon={<LoginOutlined />}>Prijava</LoginButton>
          </NavLink>
          <RegisterButton type="primary">Registracija</RegisterButton>
        </RightSection>
      </StyledHeader>

      <StyledContent>
        <Outlet />
      </StyledContent>

      <StyledFooter>
        <FooterContent>
          <FooterGrid>
            <FooterSection>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <Logo style={{ marginRight: '12px', marginBottom: '0' }}>L</Logo>
                <h3 style={{ margin: 0, color: '#fff' }}>Vaša Kompanija</h3>
              </div>
              <p>
                Kratki opis vaše kompanije i onoga što radite. Ovo je mjesto gdje možete objasniti
                svoju misiju i viziju u modernom digitalnom svijetu.
              </p>
            </FooterSection>

            <FooterSection>
              <h3>Proizvodi</h3>
              <FooterLink href="#">Proizvod 1</FooterLink>
              <FooterLink href="#">Proizvod 2</FooterLink>
              <FooterLink href="#">Proizvod 3</FooterLink>
              <FooterLink href="#">Proizvod 4</FooterLink>
            </FooterSection>

            <FooterSection>
              <h3>Kompanija</h3>
              <FooterLink href="#">O nama</FooterLink>
              <FooterLink href="#">Karijere</FooterLink>
              <FooterLink href="#">Blog</FooterLink>
              <FooterLink href="#">Kontakt</FooterLink>
            </FooterSection>

            <FooterSection>
              <h3>Podrška</h3>
              <FooterLink href="#">Help Center</FooterLink>
              <FooterLink href="#">Dokumentacija</FooterLink>
              <FooterLink href="#">API Reference</FooterLink>
              <FooterLink href="#">Status</FooterLink>
            </FooterSection>
          </FooterGrid>

          <FooterBottom>© 2024 Vaša Kompanija. Sva prava zadržana.</FooterBottom>
        </FooterContent>
      </StyledFooter>
    </StyledLayout>
  );
}
