import styled from 'styled-components';
import { Layout } from 'antd';
import { Link } from 'react-router-dom';
import FrontLogo from './FrontLogo';
import { HiOutlineMail } from 'react-icons/hi';

import { useGetUpcomingEvents } from '../../features/front/useUpcomingEvents';
import { URL } from '../../utils/constants';

const { Footer } = Layout;

// —— Theme
const BRAND = '#f97316';

const StyledFooter = styled(Footer)`
  background: #001529;
  color: rgba(255, 255, 255, 0.85);

  @media (max-width: 400px) {
    padding: 24px 10px;
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 0 28px;

  @media (max-width: 690px) {
    padding: 10px 0 28px;
  }
  @media (max-width: 190px) {
    display: none;
  }
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 0.8fr 1fr;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 28px;
  }
`;

const BrandBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  justify-self: flex-start;

  p {
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.6;
    margin: 0;
  }

  @media (max-width: 770px) {
    justify-self: center;
  }
`;

const Section = styled.div`
  display: flex;
  justify-content: space-around;
  /* justify-self: flex-end; */
  gap: 5rem;

  h3 {
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 12px 0;
  }
`;

const InstList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const InstItem = styled.li`
  margin: 0;
  a {
    display: inline-block;
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    padding: 6px 0;
    transition: color 0.2s ease;
  }
  a:hover {
    color: ${BRAND};
  }
`;

const NextEventCard = styled(Link)`
  display: grid;
  grid-template-columns: 92px 1fr;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  text-decoration: none;

  &:hover {
    border-color: ${BRAND};
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
`;

const Poster = styled.img`
  width: 92px;
  height: 92px;
  object-fit: cover;
  border-radius: 10px;
  background: #0b1220;
`;

const EventMeta = styled.div`
  display: grid;
  gap: 6px;

  .title {
    color: #fff;
    font-weight: 600;
    line-height: 1.3;
  }

  .date {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.92rem;
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 18px;
  text-align: center;
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.92rem;
`;

const InstitutionContainer = styled.div`
  @media (max-width: 900px) {
    display: none;
  }
`;

const NextEventContainer = styled.div`
  /* @media (max-width: 250px) {
    display: none;
  } */
`;

/**
 * FrontFooter
 * @param {Object} props
 * @param {string} props.description - Kratki opis (ispod logotipa)
 * @param {Array<{name: string, href: string}>} props.institutions - Lista institucija
 * @param {Object} [props.nextEvent] - Opcionalno: naredni događaj
 * @param {string} props.nextEvent.title
 * @param {string} props.nextEvent.dateISO - ISO datum (npr. "2025-08-19T18:00:00.000Z")
 * @param {string} props.nextEvent.imageUrl
 * @param {string} [props.nextEvent.href] - Link do stranice događaja (ako izostane, koristi /dogadjaj/:id)
 * @param {string} [props.nextEvent.id] - Id za fallback rutu /dogadjaj/:id
 */
export default function FrontFooter({ description = '', institucije = [], settings }) {
  const { upcomingEvents } = useGetUpcomingEvents();

  const posterSlika =
    upcomingEvents?.[0]?.slika && upcomingEvents[0].slika !== '00000000-0000-0000-0000-000000000000'
      ? `${URL}/api/image/${upcomingEvents[0].slika}?height=300`
      : `${URL}/api/events/slika/${upcomingEvents?.[0]?.idguid}`;

  const nextEvent = {
    id: upcomingEvents?.[0]?.idguid,
    title: upcomingEvents?.[0]?.title,
    dateISO: upcomingEvents?.[0]?.start_date,
    imageUrl: posterSlika,
    institucija: upcomingEvents?.[0]?.institucija.naziv,
    institucijaUrl: `/institution/${upcomingEvents?.[0]?.institucija_idguid}`,
  };

  const formatDate = (iso) => {
    try {
      const d = new Date(iso);
      const dan = String(d.getDate()).padStart(2, '0');
      const mjesec = String(d.getMonth() + 1).padStart(2, '0');
      const godina = d.getFullYear();
      const sati = String(d.getHours()).padStart(2, '0');
      const minute = String(d.getMinutes()).padStart(2, '0');

      return `${dan}.${mjesec}.${godina} - ${sati}:${minute}`;
    } catch {
      return '';
    }
  };

  let institutions = institucije.map((i) => {
    return {
      name: i.naziv || 'Nepoznato',
      href: `/institution/${i.idguid}`,
    };
  });
  const eventHref = nextEvent?.href || (nextEvent?.id ? `/dogadjaj/${nextEvent.id}` : '#');

  return (
    <StyledFooter>
      <FooterContent>
        <FooterGrid>
          <BrandBlock>
            <FrontLogo site_logo={settings?.site_logo} />
            <p>{description}</p>
            {settings.email && (
              <EventMeta>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <HiOutlineMail />
                  <a href={`mailto:${settings?.email}`}>{settings?.email}</a>
                </div>
              </EventMeta>
            )}
          </BrandBlock>

          <Section>
            <InstitutionContainer>
              <h3>Institucije</h3>
              <InstList>
                {institutions?.slice(0, 8).map((inst) => (
                  <InstItem key={inst.href ?? inst.name}>
                    <a href={inst.href} target="_blank" rel="noopener noreferrer">
                      {inst.name}
                    </a>
                  </InstItem>
                ))}
                {(!institutions || institutions.length === 0) && (
                  <InstItem style={{ color: 'rgba(255,255,255,0.45)' }}>
                    Trenutno nema unesenih institucija.
                  </InstItem>
                )}
              </InstList>
            </InstitutionContainer>

            {nextEvent && (
              <NextEventContainer>
                <h3 style={{ marginTop: 16 }}>Naredni događaj</h3>
                <NextEventCard to={eventHref}>
                  <Poster
                    src={nextEvent.imageUrl}
                    alt={nextEvent.title || 'Događaj'}
                    loading="lazy"
                  />
                  <EventMeta>
                    <div className="title">{nextEvent.title}</div>
                    {nextEvent.dateISO && (
                      <div className="date">{formatDate(nextEvent.dateISO)}</div>
                    )}
                    <div>{nextEvent?.institucija}</div>
                  </EventMeta>
                </NextEventCard>
              </NextEventContainer>
            )}
          </Section>
        </FooterGrid>

        <FooterBottom>
          © {new Date().getFullYear()} {settings.site_copyright}
        </FooterBottom>
      </FooterContent>
    </StyledFooter>
  );
}
