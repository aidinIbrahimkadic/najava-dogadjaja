import styled from 'styled-components';
import { Layout } from 'antd';
import FrontLogo from './FrontLogo';

const { Footer } = Layout;

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

export default function FrontFooter() {
  return (
    <StyledFooter>
      <FooterContent>
        <FooterGrid>
          <FooterSection>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <FrontLogo />
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
  );
}
