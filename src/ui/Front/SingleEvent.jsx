import React, { useMemo } from 'react';
import styled from 'styled-components';
import * as Fa from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import Heading from '../Heading';

/**
 * Elegant event page component
 * - Left: Poster image
 * - Right: Key info (title, category, date/time, price, location, organizer)
 * - Bottom: Leaflet map centered on event.lokacija { latitude, longitude }
 *
 * Notes:
 * - Uses styled-components, minimal external UI libs
 * - Ant Design avoided (per request) except you can add it around if desired
 * - Pass full `event` object (data) via props: <EventPage event={data} />
 */

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
    return `https://events-opcina.poruci.ba/api/image/${event.slika}?height=400`;
  }
  return `https://events-opcina.poruci.ba/api/events/slika/${event.idguid}`;
};

// —— Leaflet default marker fix (so the marker icon loads properly) ——
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
const Page = styled.div`
  --brand: ${BRAND};
  --brand-dark: ${BRAND_DARK};
  --text: ${TEXT};
  --muted: ${MUTED};
  --card-bg: ${CARD_BG};

  display: grid;
  grid-template-columns: 0.4fr 1fr;
  /* gap: 2rem; */
  align-items: start;
  padding: 2rem 0;
  margin-bottom: 7rem;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const Poster = styled.div`
  background: #fff;
  border-radius: ${RADIUS} 0 0 ${RADIUS};
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  position: sticky;
  top: 16px;

  @media (max-width: 980px) {
    position: static;
  }
`;

const PosterImg = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const InfoCard = styled.section`
  background: #fff;
  border-radius: 0 ${RADIUS} ${RADIUS} 0;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  display: grid;
  height: 100%;
  gap: 1rem;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  /* display: grid;
  grid-template-columns: auto 1fr auto; */
  /* gap: 0.75rem 1rem;
  align-items: center; */
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
  font-size: 0.9rem;
  font-weight: 600;
`;

const Title = styled.h1`
  margin: 0;
  color: var(--text);
  font-size: clamp(1.8rem, 2.2vw, 2.4rem);
  line-height: 1.15;
`;

const Price = styled.div`
  color: var(--brand);
  font-weight: 800;
  font-size: 1.6rem;
`;

const MetaGrid = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  /* grid-template-columns: 1fr 1fr; */
  gap: 3rem;
  margin-top: 0.25rem;
  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--text);
`;

const Label = styled.div`
  font-size: 1rem;
  color: var(--muted);
  margin-bottom: 0.1rem;
`;

const Strong = styled.div`
  font-weight: 700;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px dashed rgba(0, 0, 0, 0.08);
  margin: 0.5rem 0 0.25rem;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const Button = styled.button`
  background: ${(p) => (p.$variant === 'outline' ? 'transparent' : 'var(--brand)')};
  color: ${(p) => (p.$variant === 'outline' ? 'var(--brand)' : '#fff')};
  border: 2px solid var(--brand);
  padding: 0.6rem 1rem;
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

function formatMoney(value) {
  if (value === null || value === undefined) return '—';
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  // Force 2 decimals with dot and " KM" suffix
  return `${n.toFixed(2)} KM`;
}

function formatDateTime(iso) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const date = `${dd}.${mm}.${yyyy}`; // e.g., 14.08.2025
    const time = new Intl.DateTimeFormat('bs-BA', { hour: '2-digit', minute: '2-digit' }).format(d);
    return { date, time };
  } catch {
    return { date: '—', time: '—' };
  }
}

function getCategoryIcon(nameOrKey, fallbackColor = '#eef2ff') {
  // nameOrKey can be event.category.ikona like "FaBook" or category name
  const key = nameOrKey && Fa[nameOrKey] ? nameOrKey : 'FaCalendarAlt';
  const Icon = Fa[key];
  return { Icon, color: fallbackColor };
}

export default function SingleEvent({ event }) {
  const imageUrl = useMemo(() => getImageUrl(event), [event]);

  const start = formatDateTime(event?.start_date);
  //   const end = formatDateTime(event?.end_date);
  const catColor = event?.category?.boja || '#eef2ff';
  const { Icon: CatIcon } = getCategoryIcon(event?.category?.ikona, catColor);

  const lat = event?.lokacija?.latitude;
  const lng = event?.lokacija?.longitude;
  const hasCoords = typeof lat === 'number' && typeof lng === 'number';

  return (
    <div>
      <Heading as="h1">Informacije o događaju</Heading>
      <Page>
        {/* Left: Poster */}
        <Poster>
          {imageUrl ? (
            <PosterImg src={imageUrl} alt={event?.title || 'Poster'} />
          ) : (
            <PosterImg
              src={`https://placehold.co/800x1100/fff7ed/262626?text=${encodeURIComponent(event?.title || 'Događaj')}`}
              alt="Poster placeholder"
            />
          )}
        </Poster>

        {/* Right: Info */}
        <div style={{ height: '100%' }}>
          <InfoCard>
            <div>
              <HeaderRow>
                <Title>{event?.title}</Title>
                <MetaItem>
                  <Fa.FaCalendarCheck size={26} style={{ marginTop: 2, color: BRAND }} />
                  <div>
                    <Label>Status</Label>
                    <Strong>
                      {event?.is_ongoing
                        ? 'U toku'
                        : event?.is_upcoming
                          ? 'Uskoro'
                          : event?.is_past
                            ? 'Završeno'
                            : '—'}
                    </Strong>
                  </div>
                </MetaItem>
              </HeaderRow>
              <Pill $bg={catColor}>
                <CatIcon /> {event?.category?.naziv || 'Kategorija'}
              </Pill>
            </div>
            <div
              style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}
            >
              <MetaGrid>
                <MetaItem>
                  <Fa.FaRegCalendarCheck size={26} style={{ marginTop: 2, color: BRAND }} />
                  <div>
                    <Label>Datum</Label>
                    <Strong>{start.date}</Strong>
                    {event?.duration_days > 0 && (
                      <div style={{ color: MUTED, fontSize: '0.9rem' }}>
                        Trajanje: {event?.duration_days} dana
                      </div>
                    )}
                  </div>
                </MetaItem>
                <MetaItem>
                  <Fa.FaClock size={26} style={{ marginTop: 2, color: BRAND }} />
                  <div>
                    <Label>Vrijeme</Label>
                    <Strong>{start.time}</Strong>
                    {event?.duration_days > 0 && (
                      <div style={{ color: MUTED, fontSize: '0.9rem' }}>
                        Trajanje: {event?.duration_days} dana
                      </div>
                    )}
                  </div>
                </MetaItem>
                <MetaItem>
                  <Fa.FaMapMarkerAlt
                    size={26}
                    style={{ marginTop: 2, color: BRAND, width: '5rem' }}
                  />
                  <div>
                    <Label>Lokacija</Label>
                    <Strong>{event?.lokacija?.naziv || '—'}</Strong>
                    <div style={{ color: MUTED, fontSize: '0.9rem' }}>
                      {event?.lokacija?.adresa || event?.location || '—'}
                    </div>
                  </div>
                </MetaItem>
              </MetaGrid>
              <Price>{formatMoney(event?.cijena)}</Price>
            </div>

            <Divider />

            {event?.description && (
              <div style={{ color: TEXT, lineHeight: 1.65 }}>{event.description}</div>
            )}

            {/* Organizer / Institution */}
            {event?.institucija && (
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                {/* <Divider /> */}
                <OrgRow>
                  {/* <Label>Organizator</Label> */}
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
                  {/* <Button onClick={() => window.print()}>Sačuvaj/štampaj</Button> */}
                  {hasCoords && (
                    <div>
                      <Button
                        $variant="outline"
                        onClick={() => {
                          const q = encodeURIComponent(`${lat},${lng}`);
                          window.open(`https://www.google.com/maps?q=${q}`, '_blank');
                        }}
                      >
                        Otvori u Google Maps
                      </Button>
                    </div>
                  )}
                </Actions>
              </div>
            )}
          </InfoCard>
        </div>
      </Page>

      {/* Map */}
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
