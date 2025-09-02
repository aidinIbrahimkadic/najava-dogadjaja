import React, { useMemo } from 'react';
import styled from 'styled-components';
import * as Fa from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import Heading from '../Heading';

import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  ViberShareButton,
  ViberIcon,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from 'react-share';
import toast from 'react-hot-toast';
import { URL } from '../../utils/constants';
import Poster from './Poster';

// —— Theme ——
const BRAND = '#f97316';
const BRAND_DARK = '#c75a0f';
const TEXT = '#0f172a';
const MUTED = '#64748b';
const CARD_BG = '#fff7ed';
const RADIUS = '18px';

// —— Image Helpers ——
const getImageUrl = (event) => {
  if (!event) return '';
  if (event.slika && event.slika !== '00000000-0000-0000-0000-000000000000') {
    return `${URL}/api/image/${event.slika}?height=600`;
  }
  return `${URL}/api/events/slika/${event.idguid}?height=600`;
};

// —— Leaflet marker fix ——
const DefaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// —— Styled ——
const PageWrap = styled.div`
  --brand: ${BRAND};
  --brand-dark: ${BRAND_DARK};
  --text: ${TEXT};
  --muted: ${MUTED};
  --card-bg: ${CARD_BG};
  background-color: #ffffff;
  align-items: start;
  border-radius: 2rem;
  margin: 4rem 0 7rem 0;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  @media (max-width: 680px) {
    grid-template-columns: 1fr;
    margin: 2rem 0 7rem 0;
  }
`;

const InfoWrap = styled.section`
  grid-area: info;
`;

const OrgSection = styled.section`
  grid-area: org;
`;

const InfoCard = styled.section`
  background: #fff;
  padding: 1.5rem;
  display: grid;
  height: 100%;
  gap: 1rem;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;

  @media (max-width: 650px) {
    flex-direction: column;
    gap: 1.4rem;
  }
`;

const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  height: fit-content;
  gap: 0.5rem;
  background: ${(p) => p.$bg || 'var(--card-bg)'};
  color: ${(p) => p.color || 'var(--text)'};
  border: 1px solid rgba(0, 0, 0, 0.06);
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
  font-size: 1.2rem;
  font-weight: 600;
`;

const Title = styled.h1`
  margin: 0;
  color: var(--text);
  font-size: clamp(1.8rem, 2.2vw, 2.4rem);
  line-height: 1.15;

  ${(p) =>
    p.$cancelled &&
    `
    color: #b91c1c;
    text-decoration: line-through;
    text-decoration-thickness: 3px;
    text-decoration-color: #ef4444;
  `}
`;

const Price = styled.div`
  color: var(--brand);
  font-weight: 800;
  font-size: 1.6rem;
  text-align: end;
`;

const MetaGrid = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;
  margin-top: 0.25rem;
  @media (max-width: 680px) {
    width: 100%;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--text);
`;

const OpisItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--text);
  margin-bottom: 0.5rem;
`;

const Label = styled.div`
  font-size: 1rem;
  color: var(--muted);
  margin-bottom: 0.1rem;
`;

const Strong = styled.div`
  font-weight: 700;

  ${(p) =>
    p.$cancelled &&
    `
    color: #b91c1c;
    text-decoration: line-through;
    text-decoration-thickness: 2px;
    text-decoration-color: #ef4444;
  `}
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px dashed rgba(0, 0, 0, 0.08);
  margin: 0.5rem 0 0.25rem;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;

  @media (max-width: 340px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  height: 32px;
  padding: 0 10px;
  line-height: 1;
  box-sizing: border-box;
  font-size: 1.2rem;
  background: ${(p) => (p.$variant === 'outline' ? 'transparent' : 'var(--brand)')};
  color: ${(p) => (p.$variant === 'outline' ? 'var(--brand)' : '#fff')};
  border: 2px solid var(--brand);
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.12s ease,
    box-shadow 0.12s ease,
    background 0.12s ease,
    color 0.12s ease;
  box-shadow: ${(p) => (p.$variant === 'outline' ? 'none' : '0 8px 18px rgba(249,115,22,0.25)')};

  &:hover {
    transform: translateY(-1px);
    background: ${(p) =>
      p.$variant === 'outline' ? 'rgba(249,115,22,0.06)' : 'var(--brand-dark)'};
  }

  &:disabled {
    cursor: not-allowed;
    background: #e5e7eb;
    color: #6b7280;
    border-color: #e5e7eb;
    box-shadow: none;
    transform: none;
  }

  & > svg {
    display: block;
    flex-shrink: 0;
  }
`;

const OrgRow = styled.div`
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 0.75rem;
  align-items: center;
`;

const OrgLogo = styled.img`
  width: 44px;
  height: 44px;
  object-fit: contain;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: #fff;
`;

const OrgName = styled.div`
  font-weight: 700;
`;

const MapCard = styled.section`
  margin-top: 1rem;
  background: #fff;
  border-radius: ${RADIUS};
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.06);
  overflow: hidden;
`;

const MapHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  background: linear-gradient(180deg, #fff, #fff9f3);
`;

const MapTitle = styled.h3`
  margin: 0;
  font-size: 1.6rem;
  color: var(--text);
`;

const MapBody = styled.div`
  height: 380px;
  width: 100%;
  @media (max-width: 680px) {
    height: 320px;
  }
`;

const DatumiCijena = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  @media (max-width: 900px) {
    align-items: flex-start;
    gap: 1rem;
    flex-direction: column;
  }
`;

const Container = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: 0.45fr 1fr;
  grid-template-areas:
    'poster info'
    'poster org';

  @media (max-width: 850px) {
    grid-template-columns: 0.4fr 1fr;
    grid-template-areas:
      'poster info'
      'org org';
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    grid-template-areas:
      'poster'
      'info'
      'org';
  }
`;

// 🔴 Overlay za otkazane događaje (isti stil kao na karticama)
const PosterWrap = styled.div`
  position: relative;
  grid-area: poster;
`;

const CancelBadge = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: #b91c1c;
  color: #fff;
  font-weight: 800;
  letter-spacing: 0.04em;
  font-size: 0.78rem;
  padding: 0.22rem 0.55rem;
  border-radius: 0.45rem;
  box-shadow: 0 6px 16px rgba(185, 28, 28, 0.35);
  z-index: 2;
`;

const CancelStripe = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    135deg,
    rgba(185, 28, 28, 0.22) 0 12px,
    rgba(185, 28, 28, 0.35) 12px 24px
  );
  mix-blend-mode: multiply;
  z-index: 1;
`;

// ---- Helpers ----
function fmtDate(d) {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}
function fmtTime(d) {
  return new Intl.DateTimeFormat('bs-BA', { hour: '2-digit', minute: '2-digit' }).format(d);
}

// Google Calendar helpers
function toGCalUTC(isoString) {
  const d = new Date(isoString);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const HH = String(d.getUTCHours()).padStart(2, '0');
  const MM = String(d.getUTCMinutes()).padStart(2, '0');
  const SS = String(d.getUTCSeconds()).padStart(2, '0');
  return `${yyyy}${mm}${dd}T${HH}${MM}${SS}Z`;
}
function toGCalDateRange(startISO, endISO) {
  return `${toGCalUTC(startISO)}/${toGCalUTC(endISO)}`;
}
function buildGCalHref(ev, startISO, endISO) {
  if (!startISO) return null;
  const s = new Date(startISO);
  const e = endISO ? new Date(endISO) : new Date(s.getTime() + 2 * 60 * 60 * 1000);
  const dates = toGCalDateRange(s.toISOString(), e.toISOString());
  const location =
    (ev?.lokacija?.naziv || '') + (ev?.lokacija?.adresa ? `, ${ev.lokacija.adresa}` : '') ||
    ev?.location ||
    '';
  const params = new URLSearchParams({
    text: ev?.title || 'Događaj',
    dates,
    details: ev?.description || '',
    location,
  });
  return `https://calendar.google.com/calendar/u/0/r/eventedit?${params.toString()}`;
}

function formatMoney(value) {
  if (value === null || value === undefined) return '—';
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  return `${n.toFixed(2)} KM`;
}

// termini + otkazano flag
function parseTerms(ev) {
  const raw =
    (Array.isArray(ev?.termini) && ev.termini) ||
    (Array.isArray(ev?.termini_lista) && ev.termini_lista) ||
    [];
  return raw
    .map((t) => {
      const startISO =
        t?.start_date ||
        t?.pocetak ||
        t?.start ||
        t?.datum ||
        t?.date ||
        (typeof t === 'string' ? t : null);
      const endISO = t?.end_date || t?.kraj || t?.end || null;
      const otkazano = !!t?.otkazano;
      return startISO ? { startISO, endISO, otkazano } : null;
    })
    .filter(Boolean);
}

export default function SingleEvent({ event }) {
  const imageUrl = useMemo(() => getImageUrl(event), [event]);

  const startISO = event?.start_date || null;
  const endISO = event?.end_date || null;

  const startD = startISO ? new Date(startISO) : null;
  const endD = endISO ? new Date(endISO) : null;

  const differentDay = startD && endD ? startD.toDateString() !== endD.toDateString() : false;

  const termsParsed = parseTerms(event);
  const hasMulti = Boolean(event?.ima_vise_termina) || termsParsed.length > 1;

  const globalGcalHref = useMemo(
    () => buildGCalHref(event, startISO, endISO),
    [event, startISO, endISO]
  );

  const terms = useMemo(() => (hasMulti ? termsParsed : []), [hasMulti, termsParsed]);

  const catColor = event?.category?.boja || '#eef2ff';
  const { Icon: CatIcon } = (() => {
    const key =
      event?.category?.ikona && Fa[event.category.ikona] ? event.category.ikona : 'FaCalendarAlt';
    return { Icon: Fa[key] };
  })();

  const lat = event?.lokacija?.latitude;
  const lng = event?.lokacija?.longitude;
  const hasCoords = typeof lat === 'number' && typeof lng === 'number';

  return (
    <div style={{ margin: '1rem 0' }}>
      <Heading as="h1">Informacije o događaju</Heading>
      <PageWrap>
        {/* Left: Poster sa OTKAZANO overlay-em */}
        <Container>
          <PosterWrap>
            <Poster imageUrl={imageUrl} alt={event?.title} />
            {event?.otkazano && (
              <>
                <CancelBadge>OTKAZANO</CancelBadge>
                <CancelStripe />
              </>
            )}
          </PosterWrap>

          {/* Right: Info */}
          <InfoWrap>
            <InfoCard>
              <div>
                <HeaderRow>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '.8rem' }}>
                    <Title $cancelled={!!event?.otkazano}>{event?.title}</Title>
                    <Pill $bg={catColor}>
                      <CatIcon /> {event?.category?.naziv || 'Kategorija'}
                    </Pill>
                  </div>
                  <MetaItem>
                    <div>
                      <Label>Podijeli događaj</Label>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <FacebookShareButton
                          url={`${URL}/api/events-share/${event.idguid}`}
                          quote={event?.title}
                        >
                          <FacebookIcon size={36} round />
                        </FacebookShareButton>
                        <ViberShareButton
                          url={`${URL}/api/events-share/${event.idguid}`}
                          quote={event?.title}
                        >
                          <ViberIcon size={36} round />
                        </ViberShareButton>
                        <TwitterShareButton
                          url={`${URL}/api/events-share/${event.idguid}`}
                          title={event?.title}
                        >
                          <TwitterIcon size={36} round />
                        </TwitterShareButton>
                        <LinkedinShareButton
                          url={`${URL}/api/events-share/${event.idguid}`}
                          title={event?.title}
                          summary={event?.description}
                        >
                          <LinkedinIcon size={36} round />
                        </LinkedinShareButton>
                        <WhatsappShareButton
                          url={`${URL}/api/events-share/${event.idguid}`}
                          title={event?.title}
                        >
                          <WhatsappIcon size={36} round />
                        </WhatsappShareButton>

                        {/* Copy link dugme */}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `${URL}/api/events-share/${event.idguid}`
                            );
                            toast.success('Link kopiran u međuspremnik!');
                          }}
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            border: '1px solid var(--color-grey-300)',
                            background: '#fff',
                            cursor: 'pointer',
                            display: 'grid',
                            placeItems: 'center',
                          }}
                        >
                          <Fa.FaLink size={18} color="var(--color-grey-600)" />
                        </button>
                      </div>
                    </div>
                  </MetaItem>
                </HeaderRow>
              </div>

              <DatumiCijena>
                <MetaGrid>
                  {/* === DATUM/VRIJEME: 3 slučaja === */}
                  {!hasMulti && differentDay && startD && endD && (
                    <>
                      <MetaItem>
                        <Fa.FaRegCalendarCheck size={26} style={{ marginTop: 2, color: BRAND }} />
                        <div>
                          <Label>Početak</Label>
                          <Strong $cancelled={!!event?.otkazano}>
                            {fmtDate(startD)} - {fmtTime(startD)}
                          </Strong>
                        </div>
                      </MetaItem>
                      <MetaItem>
                        <Fa.FaRegCalendarCheck size={26} style={{ marginTop: 2, color: BRAND }} />
                        <div>
                          <Label>Kraj</Label>
                          <Strong $cancelled={!!event?.otkazano}>
                            {fmtDate(endD)} - {fmtTime(endD)}
                          </Strong>
                        </div>
                      </MetaItem>
                    </>
                  )}

                  {!hasMulti && !differentDay && startD && (
                    <>
                      <MetaItem>
                        <Fa.FaRegCalendarCheck size={26} style={{ marginTop: 2, color: BRAND }} />
                        <div>
                          <Label>Datum</Label>
                          <Strong $cancelled={!!event?.otkazano}>{fmtDate(startD)}</Strong>
                        </div>
                      </MetaItem>
                      <MetaItem>
                        <Fa.FaClock size={26} style={{ marginTop: 2, color: BRAND }} />
                        <div>
                          <Label>Vrijeme</Label>
                          <Strong $cancelled={!!event?.otkazano}>{fmtTime(startD)}</Strong>
                        </div>
                      </MetaItem>
                    </>
                  )}

                  {/* === VIŠE TERMINA === */}
                  {hasMulti && terms.length > 0 && (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                      <Label style={{ fontWeight: 700, color: TEXT }}>
                        Termini ({terms.length})
                      </Label>
                      <div
                        style={{
                          display: 'grid',
                          gap: '0.8rem',
                          gridTemplateColumns: `repeat(${terms.length}, minmax(180px, 1fr))`,
                        }}
                      >
                        {terms.map((t, idx) => {
                          const sd = new Date(t.startISO);
                          const disabledGoogleCalendarButton =
                            new Date(t.endISO || t.startISO) < new Date() || t.otkazano;
                          const href = buildGCalHref(event, t.startISO, t.endISO);

                          const termBoxStyle = t.otkazano
                            ? {
                                background: '#fff1f2',
                                border: '1px solid rgba(185,28,28,0.35)',
                              }
                            : { background: '#fff', border: '1px solid #eef2ff' };

                          return (
                            <div
                              key={`${t.startISO}-${t.endISO || idx}`}
                              style={{
                                ...termBoxStyle,
                                borderRadius: 12,
                                padding: '0.75rem',
                              }}
                              title={t.otkazano ? 'Otkazano' : undefined}
                            >
                              <div style={{ marginBottom: 6 }}>
                                <Label>Datum</Label>
                                <Strong $cancelled={!!t.otkazano}>{fmtDate(sd)}</Strong>
                              </div>
                              <div style={{ marginBottom: 10 }}>
                                <Label>Vrijeme</Label>
                                <Strong $cancelled={!!t.otkazano}>{fmtTime(sd)}</Strong>
                              </div>
                              <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                                <Button
                                  disabled={disabledGoogleCalendarButton}
                                  onClick={() =>
                                    !disabledGoogleCalendarButton && window.open(href, '_blank')
                                  }
                                >
                                  <Fa.FaGoogle />
                                  Dodaj u Google kalendar
                                </Button>
                                {t.otkazano && (
                                  <Pill $bg="#fee2e2" color="#b91c1c">
                                    <Fa.FaTimesCircle /> Otkazano
                                  </Pill>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Lokacija */}
                  <MetaItem>
                    <Fa.FaMapMarkerAlt size={26} style={{ marginTop: 2, color: BRAND }} />
                    <div>
                      <Label>Lokacija</Label>
                      <Strong>{event?.lokacija?.naziv || '—'}</Strong>
                    </div>
                  </MetaItem>

                  {event?.description !== '' && (
                    <div>
                      <OpisItem>
                        <Fa.FaRegFileAlt size={26} style={{ marginTop: 2, color: BRAND }} />
                        <Strong>Opis</Strong>
                      </OpisItem>
                      <span>{event?.description || '—'}</span>
                    </div>
                  )}

                  <Price>
                    {event?.cijena == 0.0
                      ? 'Besplatan ulaz'
                      : `Cijena ulaznice: ${formatMoney(event?.cijena)}`}{' '}
                  </Price>
                </MetaGrid>
              </DatumiCijena>
            </InfoCard>
          </InfoWrap>

          {/* Organizator */}
          {event?.institucija && (
            <OrgSection>
              <Divider />
              <OrgContainer>
                <OrgRow>
                  {event.institucija.logo ? (
                    <Link to={`/institution/${event.institucija.idguid}`}>
                      <OrgLogo src={event.institucija.logo} alt={event.institucija.naziv} />
                    </Link>
                  ) : (
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        border: '1px solid rgba(0,0,0,0.06)',
                        display: 'grid',
                        placeItems: 'center',
                        color: BRAND,
                      }}
                    >
                      <Fa.FaBuilding size={20} />
                    </div>
                  )}
                  <div>
                    <Link to={`/institution/${event.institucija.idguid}`}>
                      <OrgName>{event.institucija.naziv}</OrgName>
                    </Link>
                    <div style={{ color: MUTED, fontSize: '0.9rem' }}>
                      {event.institucija.email || event.institucija.web_stranica || ''}
                    </div>
                  </div>
                </OrgRow>

                <Actions>
                  {/* Globalni GCal samo ako nema više termina */}
                  {!hasMulti && globalGcalHref && (
                    <Button onClick={() => window.open(globalGcalHref, '_blank')}>
                      <Fa.FaGoogle />
                      Dodaj u Google kalendar
                    </Button>
                  )}
                  {hasCoords && (
                    <Button
                      $variant="outline"
                      onClick={() => {
                        const q = encodeURIComponent(`${lat},${lng}`);
                        window.open(`https://www.google.com/maps?q=${q}`, '_blank');
                      }}
                    >
                      Otvori u Google Maps
                    </Button>
                  )}
                </Actions>
              </OrgContainer>
            </OrgSection>
          )}
        </Container>
      </PageWrap>

      {/* Mapa */}
      <MapCard>
        <MapHeader>
          <MapTitle>Mapa događaja</MapTitle>
          {hasCoords ? (
            <Pill color={TEXT} $bg={'#fff'}>
              <Fa.FaLocationArrow /> {lat.toFixed(6)}, {lng.toFixed(6)}
            </Pill>
          ) : (
            <Pill color={MUTED} $bg={'#fff'}>
              <Fa.FaInfoCircle /> Lokacija nije definirana
            </Pill>
          )}
        </MapHeader>
        <MapBody>
          {hasCoords ? (
            <MapContainer
              key={`${event?.idguid}-${lat}-${lng}`}
              center={[lat, lng]}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[lat, lng]}>
                <Popup>
                  <strong>{event?.title}</strong>
                  <br />
                  {event?.lokacija?.naziv || ''}
                  <br />
                  {event?.lokacija?.adresa || ''}
                </Popup>
              </Marker>
            </MapContainer>
          ) : (
            <div
              style={{
                height: '100%',
                width: '100%',
                display: 'grid',
                placeItems: 'center',
                color: MUTED,
              }}
            >
              Nema koordinata za prikaz mape.
            </div>
          )}
        </MapBody>
      </MapCard>
    </div>
  );
}

const OrgContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 1rem;

  @media (max-width: 850px) {
    padding: 1rem;
  }
  @media (max-width: 700px) {
    flex-direction: column;
    gap: 2rem;
  }
`;
