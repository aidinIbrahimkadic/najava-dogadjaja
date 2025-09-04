// InstitutionProfile.jsx
import React, { useMemo } from 'react';
import styled, { css } from 'styled-components';
import * as Fa from 'react-icons/fa';
import { HiOutlineMapPin, HiOutlineGlobeAlt, HiOutlineCalendarDays } from 'react-icons/hi2';
import Heading from '../Heading';
import InstitutionEvent from './InstitutionEvent';

// —— Theme (uskladi s ostatkom app-a) ——
const BRAND = '#f97316';
const TEXT = '#0f172a';
const SUBTLE = '#64748b';

// —— Helpers ——
function normalizeUrl(url) {
  if (!url) return '';
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}
function safeMail(email) {
  if (!email) return '';
  return email.replace(/\s+/g, '');
}
function phoneHref(phone) {
  if (!phone) return '';
  // zadrži +, cifre i / - (lokalni format)
  const normalized = phone.toString().replace(/[^\d+/-]/g, '');
  return `tel:${normalized}`;
}
function initialsFromName(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
}

// —— Styled Components ——
const Card = styled.div`
  width: 100%;
  background: #fff;
  border-radius: 1.25rem; /* ~2xl */
  box-shadow: 0 20px 50px rgba(2, 6, 23, 0.08);
  overflow: hidden;
  border: 1px solid rgba(2, 6, 23, 0.05);
`;

const Header = styled.div`
  position: relative;
  padding: 1.5rem 1.5rem 4.5rem;
  ${({ $bg }) => css`
    background:
      linear-gradient(0deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.05) 100%),
      ${$bg || '#fde4d4'};
  `}
`;

const TopRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 400px) {
    flex-direction: column;
  }
`;

const LogoWrap = styled.div`
  width: 84px;
  height: 84px;
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0 10px 30px rgba(2, 6, 23, 0.12);
  overflow: hidden;
  display: grid;
  place-items: center;
  padding: 1rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const LogoFallback = styled.div`
  width: 84px;
  height: 84px;
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0 10px 30px rgba(2, 6, 23, 0.12);
  display: grid;
  place-items: center;
  font-weight: 700;
  color: ${BRAND};
  font-size: 1.25rem;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  h1 {
    margin: 0;
    font-size: 1.5rem;
    line-height: 1.2;
    color: ${TEXT};
    letter-spacing: -0.01em;
  }
  p {
    margin: 0;
    color: ${SUBTLE};
  }

  @media (max-width: 400px) {
    align-items: center;

    p {
      text-align: center;
    }
  }
`;

const FloatingActions = styled.div`
  position: absolute;
  inset-inline: 1.5rem;
  bottom: -26px;
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const ActionBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 0.95rem;
  background: #fff;
  border-radius: 0.8rem;
  border: 1px solid rgba(2, 6, 23, 0.06);
  box-shadow: 0 10px 25px rgba(2, 6, 23, 0.06);
  color: ${TEXT};
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.12s ease;

  &:hover {
    transform: translateY(-1px);
  }

  svg {
    font-size: 1rem;
    color: ${BRAND};
  }
`;

const Body = styled.div`
  padding: 6rem 1.5rem 3rem 1.5rem; /* mjesto za floating actions */
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

const Section = styled.div`
  background: #fff;
  border: 1px solid rgba(2, 6, 23, 0.06);
  border-radius: 1rem;
  padding: 1rem;
`;

const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  color: ${TEXT};
  margin-bottom: 0.5rem;

  svg {
    color: ${BRAND};
  }
`;

const InfoGrid = styled.div`
  display: grid;
  gap: 0.75rem;
  grid-template-columns: 1fr;
  @media (min-width: 520px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.6rem;
  border-radius: 0.6rem;
  background: #fafafa;

  .icon {
    display: grid;
    place-items: center;
    width: auto;
    height: 100%;
    border-radius: 0.6rem;
    background: rgba(249, 115, 22, 0.08);
    color: ${BRAND};
    flex: 0 0 28px;
  }
  .meta {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.5rem;
    line-height: 1.2;
  }
  .label {
    font-size: 1.4rem;
    color: var(--color-grey-600);
  }
  .value a,
  .value {
    font-size: 1.2rem;
    font-weight: 700;
    color: ${TEXT};
    text-decoration: none;
    word-break: break-word;
  }
  .value a:hover {
    text-decoration: underline;
  }
`;

const Chips = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
`;

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.6rem;
  border-radius: 0.6rem;
  border: 1px dashed rgba(2, 6, 23, 0.12);
  color: ${SUBTLE};
  font-size: 0.85rem;
  background: #fff;

  strong {
    color: ${TEXT};
  }

  svg {
    color: ${BRAND};
  }
`;

const UpcomingEventsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
  @media (max-width: 700px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 430px) {
    grid-template-columns: 1fr;
    width: 80%;
    /* justify-self: center; */
  }
  @media (max-width: 300px) {
    grid-template-columns: 1fr;
    width: 100%;
  }
`;
const Description = styled.div`
  color: ${TEXT};
  line-height: 1.7;
  white-space: pre-wrap; /* čuva \n i višestruke razmake */
  word-break: break-word; /* da dugi URL-ovi ne razbiju layout */
`;
// —— Component ——
export default function SingleInstitution({ inst, upcomingEvents }) {
  const {
    naziv,
    opis,
    adresa,
    broj_telefona,
    email,
    web_stranica,
    ime_direktora,
    logo,
    boja_pozadine_postera,
    createdAt,
    updatedAt,
  } = inst || {};

  const hasLogo = Boolean(logo && logo.startsWith('data:image'));

  const website = useMemo(() => normalizeUrl(web_stranica), [web_stranica]);

  return (
    <Card>
      <Header $bg={boja_pozadine_postera}>
        <TopRow>
          {hasLogo ? (
            <LogoWrap>
              <img src={logo} alt={`${naziv || 'Logo'} logo`} />
            </LogoWrap>
          ) : (
            <LogoFallback aria-label="Fallback logo">{initialsFromName(naziv)}</LogoFallback>
          )}

          <TitleBlock>
            <Heading as="h2">{naziv || 'Institucija'}</Heading>
            <p style={{ color: '#4a4a4a' }}>Institucija • Organizator događaja</p>
          </TitleBlock>
        </TopRow>

        <FloatingActions>
          {website && (
            <ActionBtn
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Otvorite web stranicu"
            >
              <HiOutlineGlobeAlt /> Web stranica
            </ActionBtn>
          )}

          {email && (
            <ActionBtn href={`mailto:${safeMail(email)}`} aria-label="Pošaljite e-mail">
              <Fa.FaEnvelope /> E-mail
            </ActionBtn>
          )}

          {broj_telefona && (
            <ActionBtn href={phoneHref(broj_telefona)} aria-label="Pozovite">
              <Fa.FaPhoneAlt /> Nazovi
            </ActionBtn>
          )}
        </FloatingActions>
      </Header>

      <Body>
        {/* Opis + metapodaci */}

        {/* Kontakt podaci */}
        <Section>
          <SectionTitle>
            <Fa.FaAddressBook /> <Heading as="h3">Kontakt & detalji</Heading>
          </SectionTitle>

          <InfoGrid>
            <InfoRow>
              <div className="icon">
                <Fa.FaUserTie />
              </div>
              <div className="meta">
                <span className="label">Direktor</span>
                <span className="value">{ime_direktora || '—'}</span>
              </div>
            </InfoRow>

            <InfoRow>
              <div className="icon">
                <HiOutlineMapPin />
              </div>
              <div className="meta">
                <span className="label">Adresa</span>
                <span className="value">{adresa || '—'}</span>
              </div>
            </InfoRow>

            <InfoRow>
              <div className="icon">
                <Fa.FaPhoneAlt />
              </div>
              <div className="meta">
                <span className="label">Telefon</span>
                <span className="value">
                  {broj_telefona ? <a href={phoneHref(broj_telefona)}>{broj_telefona}</a> : '—'}
                </span>
              </div>
            </InfoRow>

            <InfoRow>
              <div className="icon">
                <Fa.FaEnvelope />
              </div>
              <div className="meta">
                <span className="label">E-mail</span>
                <span className="value">
                  {email ? <a href={`mailto:${safeMail(email)}`}>{safeMail(email)}</a> : '—'}
                </span>
              </div>
            </InfoRow>

            <InfoRow>
              <div className="icon">
                <HiOutlineGlobeAlt />
              </div>
              <div className="meta">
                <span className="label">Web</span>
                <span className="value">
                  {web_stranica ? (
                    <a href={website} target="_blank" rel="noopener noreferrer">
                      {web_stranica}
                    </a>
                  ) : (
                    '—'
                  )}
                </span>
              </div>
            </InfoRow>

            <InfoRow>
              <div className="icon">
                <HiOutlineCalendarDays />
              </div>
              <div className="meta">
                <span className="label">Status</span>
                <span className="value">Aktivno</span>
              </div>
            </InfoRow>
          </InfoGrid>
        </Section>
        <Section>
          <SectionTitle>
            <Fa.FaInfoCircle />
            <Heading as="h3">O organizatoru događaja</Heading>
          </SectionTitle>
          <Description>{opis?.trim() ? opis : 'Nema dodatnog opisa.'}</Description>

          <Chips>
            {createdAt && (
              <Chip title="Datum kreiranja">
                <Fa.FaClock />
                Kreirano: <strong>{new Date(createdAt).toLocaleDateString()}</strong>
              </Chip>
            )}
            {updatedAt && (
              <Chip title="Zadnja izmjena">
                <Fa.FaHistory />
                Ažurirano: <strong>{new Date(updatedAt).toLocaleDateString()}</strong>
              </Chip>
            )}
          </Chips>
        </Section>

        {upcomingEvents && upcomingEvents.length > 0 && (
          <>
            <Heading as="h3">Predstojeći događaji ove institucije</Heading>
            <UpcomingEventsContainer>
              {upcomingEvents.map((ev) => (
                <InstitutionEvent key={ev.idguid} event={ev} />
              ))}
            </UpcomingEventsContainer>
          </>
        )}
      </Body>
    </Card>
  );
}

/*
— Primjer korištenja —
<InstitutionProfile
  inst={podaciIzApi}
  onShowEvents={() => navigate(`/institucije/${podaciIzApi.idguid}/dogadjaji`)}
/>
*/
