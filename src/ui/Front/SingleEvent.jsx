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
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from 'react-share';

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

  display: grid;
  grid-template-columns: 0.4fr 1fr;
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
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
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

// napari termine iz više mogućih oblika
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
      return startISO ? { startISO, endISO } : null;
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

  const hasMulti = Boolean(event?.ima_vise_termina) || parseTerms(event).length > 1;

  // Za globalni GCal (koristi osnovni start/end)
  const globalGcalHref = useMemo(
    () => buildGCalHref(event, startISO, endISO),
    [event, startISO, endISO]
  );

  const terms = useMemo(() => (hasMulti ? parseTerms(event) : []), [event, hasMulti]);

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
    <div>
      <Heading as="h1">Informacije o događaju</Heading>
      <PageWrap>
        {/* Left: Poster */}
        <Poster>
          {imageUrl ? (
            <PosterImg src={imageUrl} alt={event?.title || 'Poster'} />
          ) : (
            <PosterImg
              src={`https://placehold.co/800x1100/fff7ed/262626?text=${encodeURIComponent(
                event?.title || 'Događaj'
              )}`}
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
                  <div>
                    <Label>Podijeli događaj</Label>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <FacebookShareButton url={window.location.href} quote={event?.title}>
                        <FacebookIcon size={36} round />
                      </FacebookShareButton>
                      <TwitterShareButton url={window.location.href} title={event?.title}>
                        <TwitterIcon size={36} round />
                      </TwitterShareButton>
                      <LinkedinShareButton
                        url={window.location.href}
                        title={event?.title}
                        summary={event?.description}
                      >
                        <LinkedinIcon size={36} round />
                      </LinkedinShareButton>
                      <WhatsappShareButton url={window.location.href} title={event?.title}>
                        <WhatsappIcon size={36} round />
                      </WhatsappShareButton>

                      {/* Copy link dugme */}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          alert('Link kopiran u clipboard!');
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
              <Pill $bg={catColor}>
                <CatIcon /> {event?.category?.naziv || 'Kategorija'}
              </Pill>
            </div>

            <div
              style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}
            >
              <MetaGrid>
                {/* === DATUM/VRIJEME: 3 slučaja === */}
                {!hasMulti && differentDay && startD && endD && (
                  <>
                    <MetaItem>
                      <Fa.FaRegCalendarCheck size={26} style={{ marginTop: 2, color: BRAND }} />
                      <div>
                        <Label>Početak</Label>
                        <Strong>
                          {fmtDate(startD)} - {fmtTime(startD)}
                        </Strong>
                      </div>
                    </MetaItem>
                    <MetaItem>
                      <Fa.FaRegCalendarCheck size={26} style={{ marginTop: 2, color: BRAND }} />
                      <div>
                        <Label>Kraj</Label>
                        <Strong>
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
                        <Strong>{fmtDate(startD)}</Strong>
                      </div>
                    </MetaItem>
                    <MetaItem>
                      <Fa.FaClock size={26} style={{ marginTop: 2, color: BRAND }} />
                      <div>
                        <Label>Vrijeme</Label>
                        <Strong>{fmtTime(startD)}</Strong>
                      </div>
                    </MetaItem>
                  </>
                )}

                {/* === VIŠE TERMINA === */}
                {hasMulti && terms.length > 0 && (
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    <Label style={{ fontWeight: 700, color: TEXT }}>Termini ({terms.length})</Label>
                    <div
                      style={{
                        display: 'grid',
                        gap: '0.8rem',
                        gridTemplateColumns: `repeat(${terms.length}, minmax(180px, 1fr))`,
                      }}
                    >
                      {terms.map((t, idx) => {
                        const sd = new Date(t.startISO);
                        const disabledGoogleCalendarButton = new Date(t.endISO) < new Date();
                        const href = buildGCalHref(event, t.startISO, t.endISO);
                        return (
                          <div
                            key={`${t.startISO}-${t.endISO || idx}`}
                            style={{
                              background: '#fff',
                              border: '1px solid #eef2ff',
                              borderRadius: 12,
                              padding: '0.75rem',
                            }}
                          >
                            <div style={{ marginBottom: 6 }}>
                              <Label>Datum</Label>
                              <Strong>{fmtDate(sd)}</Strong>
                            </div>
                            <div style={{ marginBottom: 10 }}>
                              <Label>Vrijeme</Label>
                              <Strong>{fmtTime(sd)}</Strong>
                            </div>
                            <div>
                              <Button
                                disabled={disabledGoogleCalendarButton}
                                {...(!disabledGoogleCalendarButton
                                  ? {}
                                  : {
                                      style: {
                                        backgroundColor: 'var(--color-grey-400)',
                                        border: 'var(--color-grey-500)',
                                        cursor: 'not-allowed',
                                      },
                                    })}
                                onClick={() => window.open(href, '_blank')}
                              >
                                <Fa.FaGoogle />
                                Dodaj u Google kalendar
                              </Button>
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
              </MetaGrid>

              <Price>{formatMoney(event?.cijena)}</Price>
            </div>

            <Divider />

            {/* Organizator */}
            {event?.institucija && (
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
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
                  {/* Globalni GCal prikazujemo SAMO ako nema više termina */}
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
                {/* Share buttons */}
              </div>
            )}

            {/* Share buttons */}
          </InfoCard>
        </div>
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
