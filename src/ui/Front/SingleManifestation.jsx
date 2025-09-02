// src/ui/Front/SingleManifestation.jsx
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { HiCalendarDays, HiClock, HiBuildingLibrary, HiMapPin } from 'react-icons/hi2';
import * as Fa from 'react-icons/fa';
import { URL } from '../../utils/constants';

const ZERO_GUID = '00000000-0000-0000-0000-000000000000';
const pad = (n) => String(n).padStart(2, '0');
const fmtDateTime = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  const date = `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
  const time = new Intl.DateTimeFormat('bs-BA', { hour: '2-digit', minute: '2-digit' }).format(d);
  return `${date} u ${time}h`;
};
const money = (v) => {
  const n = Number(v ?? 0);
  return isNaN(n) ? '' : `${n.toFixed(2)} KM`;
};

// ───────────── styles ─────────────
const Wrap = styled.div`
  width: min(1100px, 92vw);
  margin: 6rem auto 4rem;
  display: grid;
  gap: 1.5rem;

  @media (max-width: 600px) {
    margin-top: 2rem;
    gap: 1rem;
  }
`;

const Cover = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.08);
  cursor: zoom-in;

  img {
    width: 100%;
    height: clamp(220px, 42vw, 440px);
    display: block;
    object-fit: cover;
  }
`;

const CornerTag = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  background: #111827;
  color: #fff;
  font-size: 12px;
  line-height: 1;
  padding: 6px 10px;
  border-radius: 999px;
  opacity: 0.9;
`;

const Lightbox = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: grid;
  place-items: center;
  z-index: 1000;
  padding: 2rem;
  cursor: zoom-out;
`;

const LightboxImg = styled.img`
  max-width: 96vw;
  max-height: 92vh;
  border-radius: 14px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
  cursor: default;
`;

const H1 = styled.h1`
  font-size: clamp(1.5rem, 2.4vw, 2.3rem);
  margin: 0.25rem 0 0.5rem;
  color: #0f172a;
`;

const Period = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem 1.5rem;
  color: #374151;
  font-size: 1rem;
  span {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const InstRow = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
`;

const InstLogo = styled(Link)`
  width: 46px;
  height: 46px;
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  background: #fff;
  display: grid;
  place-items: center;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const InstFallback = styled(InstLogo)`
  color: #111827;
  font-weight: 700;
  background: #f3f4f6;
`;

const SectionTitle = styled.h2`
  margin: 1.2rem 0 0.5rem;
  font-size: 1.25rem;
  color: #111827;
`;

// Event cards
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 14px;
  @media (max-width: 900px) {
    grid-template-columns: repeat(12, 1fr);
  }
`;

const Card = styled.article`
  grid-column: span 4;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  position: relative;

  @media (max-width: 900px) {
    grid-column: span 6;
  }
  @media (max-width: 600px) {
    grid-column: span 12;
  }
`;

const CancelRibbon = styled.div`
  position: absolute;
  top: 12px;
  right: -42px;
  transform: rotate(35deg);
  background: #ef4444;
  color: #fff;
  font-weight: 700;
  letter-spacing: 0.5px;
  font-size: 11px;
  padding: 6px 56px;
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.35);
  z-index: 2;
`;

const Poster = styled.div`
  height: 190px;
  background: linear-gradient(135deg, #e5e7eb, #f3f4f6);
  border-bottom: 1px solid #e5e7eb;
  position: relative;

  ${(p) =>
    p.$image &&
    css`
      background-image: url(${p.$image});
      background-size: cover;
      background-position: center;
    `}
`;

const PosterTag = styled(CornerTag)`
  top: 10px;
  left: 10px;
  font-size: 11px;
  padding: 5px 9px;
  background: #1f2937;
`;

const Body = styled.div`
  padding: 12px 12px 14px;
  display: grid;
  gap: 8px;
`;

const Title = styled(Link)`
  font-weight: 700;
  color: #0f172a;
  text-decoration: none;
  &:hover {
    color: var(--color-brand-600, #2563eb);
    text-decoration: underline;
  }
`;

const Meta = styled.div`
  display: grid;
  gap: 6px;
  color: #374151;
  font-size: 14px;
  .row {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const Pills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Pill = styled.span`
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 12px;
  color: #111827;
`;

const Term = styled(Pill)`
  ${(p) =>
    p.$cancelled &&
    css`
      background: #fee2e2;
      border-color: #fecaca;
      color: #991b1b;
      text-decoration: line-through;
    `}
`;

const Price = styled.div`
  margin-top: 4px;
  font-weight: 700;
  color: #111827;

  .free {
    background: #ecfdf5;
    color: #065f46;
    padding: 2px 10px;
    border-radius: 999px;
    border: 1px solid #a7f3d0;
    font-weight: 600;
    font-size: 12px;
  }
`;

// ───────────── component ─────────────
export default function SingleManifestation({ events, manifestation }) {
  // Prefer naslov manifestacije iz events-responsa: data.manifestacija.title
  const maniFromEvents = events?.data?.manifestacija || events?.manifestacija;
  const maniTitle =
    maniFromEvents?.title || manifestation?.data?.title || manifestation?.title || 'Manifestacija';

  // Cover slika — ako je dostupna iz zasebnog manifestacije-responsa
  const maniData = manifestation?.data ?? manifestation ?? {};
  const [openLightbox, setOpenLightbox] = useState(false);
  const coverSrc = useMemo(() => {
    const s = maniData?.slika;
    if (!s || s === ZERO_GUID) return null;
    return `${URL}/api/image/${s}?height=900`;
  }, [maniData?.slika]);

  const open = useCallback(() => setOpenLightbox(true), []);
  const close = useCallback(() => setOpenLightbox(false), []);
  useEffect(() => {
    const onEsc = (e) => e.key === 'Escape' && close();
    if (openLightbox) window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [openLightbox, close]);

  // Normalizuj niz događaja
  const eventsArr = useMemo(() => {
    if (Array.isArray(events)) return events;
    if (Array.isArray(events?.data?.events)) return events.data.events;
    if (Array.isArray(events?.events)) return events.events;
    return [];
  }, [events]);

  // Institucije učesnici (iz događaja)
  const institutions = useMemo(() => {
    const m = new Map();
    eventsArr.forEach((e) => {
      const inst = e?.institucija;
      const id = e?.institucija_idguid || inst?.idguid || inst?.id;
      if (!id) return;
      if (!m.has(id)) {
        m.set(id, {
          id,
          naziv: inst?.naziv || 'Institucija',
          // Ako backend umjesto base64 vraća GUID, promijeni liniju ispod:
          logo: inst?.logo || null,
        });
      }
    });
    return Array.from(m.values());
  }, [eventsArr]);

  // Karta događaja
  const cards = useMemo(() => {
    return eventsArr.map((ev) => {
      const start = ev.start_date || ev.start_time;
      const end = ev.end_date || ev.end_time || ev.start_date;

      const poster =
        ev.slika && ev.slika !== ZERO_GUID
          ? `${URL}/api/image/${ev.slika}?height=300`
          : `${URL}/api/events/slika/${ev.idguid}?height=300`;

      const categoryName = ev.category?.naziv || ev.category || ''; // ako backend vrati samo category_idguid, neće imati naziv
      const locationName = ev.lokacija?.naziv || ev.location || ''; // u nekim response-ima je ugniježđeno "lokacija", u nekim samo string "location"

      const instName = ev.institucija?.naziv || '';
      const instId = ev.institucija_idguid || ev.institucija?.idguid || ev.institucija?.id;

      const termini = Array.isArray(ev.termini) ? ev.termini : [];

      return {
        id: ev.idguid || ev.id,
        title: ev.title,
        start,
        end,
        poster,
        categoryName,
        locationName,
        institutionName: instName,
        institutionId: instId,
        price: Number(ev.cijena ?? 0),
        cancelled: !!ev.otkazano, // cijeli događaj otkazan
        hasTerms: !!ev.ima_vise_termina,
        terms: termini, // očekuje [{ start_date, end_date?, otkazano? }, ...]
      };
    });
  }, [eventsArr]);

  // Period manifestacije (ako želiš prikazati, možeš iz events-responsa; ovdje je opcionalno)
  const maniStart = maniData?.start_time || maniData?.start_date || null;
  const maniEnd = maniData?.end_time || maniData?.end_date || null;

  return (
    <Wrap>
      {/* Cover + Lightbox */}
      {coverSrc && (
        <>
          <Cover onClick={open} title="Klikni za prikaz preko cijelog ekrana">
            <img src={coverSrc} alt={maniTitle} loading="lazy" />
            <CornerTag>{maniTitle}</CornerTag>
          </Cover>

          {openLightbox && (
            <Lightbox onClick={close}>
              {/* stopPropagation da klik na sliku ne zatvori */}
              <LightboxImg src={coverSrc} alt={maniTitle} onClick={(e) => e.stopPropagation()} />
            </Lightbox>
          )}
        </>
      )}

      {/* Naslov */}
      <H1>{maniTitle}</H1>

      {/* Institucije učesnici */}
      {institutions.length > 0 && (
        <>
          <SectionTitle>Institucije učesnici</SectionTitle>
          <InstRow>
            {institutions.map((inst) =>
              inst.logo ? (
                <InstLogo key={inst.id} to={`/institution/${inst.id}`} title={inst.naziv}>
                  <img src={inst.logo} alt={inst.naziv} />
                </InstLogo>
              ) : (
                <InstFallback key={inst.id} to={`/institution/${inst.id}`} title={inst.naziv}>
                  {inst.naziv?.slice(0, 2)?.toUpperCase()}
                </InstFallback>
              )
            )}
          </InstRow>
        </>
      )}

      {/* Period manifestacije (opcionalno) */}
      {(maniStart || maniEnd) && (
        <Period>
          {maniStart && (
            <span>
              <HiCalendarDays />
              Početak: <strong>{fmtDateTime(maniStart)}</strong>
            </span>
          )}
          {maniEnd && (
            <span>
              <HiCalendarDays />
              Kraj: <strong>{fmtDateTime(maniEnd)}</strong>
            </span>
          )}
        </Period>
      )}

      {/* Lista događaja */}
      <SectionTitle>Događaji manifestacije</SectionTitle>
      <Grid>
        {cards.map((e) => (
          <Card key={e.id}>
            {e.cancelled && <CancelRibbon>OTKAZANO</CancelRibbon>}

            <Poster $image={e.poster}>
              {/* umjesto "Manifestacija" prikaži naziv manifestacije */}
              <PosterTag>{maniTitle}</PosterTag>
            </Poster>

            <Body>
              <Title to={`/dogadjaj/${e.id}`}>{e.title}</Title>

              <Meta>
                {/* Datum i vrijeme (početak – kraj) */}
                <div className="row">
                  <HiClock />
                  <span>
                    {e.start ? fmtDateTime(e.start) : '—'}
                    {e.end && e.end !== e.start ? ` — ${fmtDateTime(e.end)}` : ''}
                  </span>
                </div>

                {/* Lokacija */}
                {e.locationName && (
                  <div className="row">
                    <HiMapPin />
                    <span>{e.locationName}</span>
                  </div>
                )}

                {/* Kategorija */}
                {e.categoryName && (
                  <div className="row">
                    <Fa.FaTag />
                    <Pill>{e.categoryName}</Pill>
                  </div>
                )}

                {/* Institucija */}
                {e.institutionId && (
                  <div className="row">
                    <HiBuildingLibrary />
                    <Link to={`/institution/${e.institutionId}`}>{e.institutionName}</Link>
                  </div>
                )}

                {/* Termini – prikaži sve termine, označi otkazane */}
                {e.hasTerms && e.terms.length > 0 && (
                  <>
                    <div className="row" style={{ fontWeight: 600 }}>
                      <Fa.FaRegClock /> Termini
                    </div>
                    <Pills>
                      {e.terms.map((t, idx) => {
                        const label = t.start_date ? fmtDateTime(t.start_date) : '—';
                        return (
                          <Term
                            key={idx}
                            $cancelled={!!t.otkazano}
                            title={t.otkazano ? 'Otkazano' : ''}
                          >
                            {label}
                            {t.otkazano ? ' — Otkazano' : ''}
                          </Term>
                        );
                      })}
                    </Pills>
                  </>
                )}

                {/* Cijena */}
                <Price>
                  {e.price === 0 ? (
                    <span className="free">Besplatan ulaz</span>
                  ) : (
                    <>Cijena ulaznice: {money(e.price)}</>
                  )}
                </Price>
              </Meta>
            </Body>
          </Card>
        ))}
      </Grid>

      {cards.length === 0 && (
        <div style={{ color: '#6b7280', padding: '.5rem 0' }}>
          Nema događaja u sklopu ove manifestacije.
        </div>
      )}
    </Wrap>
  );
}
