// EventCardNew.jsx
import React, { useMemo } from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import { HiBuildingLibrary, HiMapPin, HiCalendarDateRange } from 'react-icons/hi2';
import { URL } from '../../utils/constants';

// ——— Stilovi ———
const Card = styled.div`
  background: #fff;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 14px 30px rgba(2, 6, 23, 0.08);
  border: 1px solid rgba(2, 6, 23, 0.06);
  width: 100%;
  display: grid;
  grid-template-rows: 180px auto;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const Poster = styled.div`
  position: relative;
  background-image: ${(p) =>
    p.$image
      ? `url(${p.$image})`
      : `linear-gradient(135deg, ${p.$fallback1} 0%, ${p.$fallback2} 100%)`};
  background-size: cover;
  background-position: center;
`;

// 🔴 OTKAZANO overlay (badge + kosa pruga)
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

const Body = styled.div`
  padding: 1rem;
  display: grid;
  gap: 0.75rem;
`;

const Title = styled.h3`
  margin: 0 0 0.25rem;
  font-size: 1.4rem;
  color: #0f172a;
  line-height: 1.3;

  a {
    color: inherit;
    text-decoration: none;
  }
  &:hover {
    color: var(--color-brand-500);
    text-decoration: underline;
  }

  ${(p) =>
    p.$cancelled &&
    css`
      color: #b91c1c;
      text-decoration: line-through;
      text-decoration-thickness: 2px;
      text-decoration-color: #ef4444;
    `}
`;

const Meta = styled.div`
  display: grid;
  gap: 0.45rem;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #334155;
  font-size: 1.2rem;

  svg {
    color: #f97316;
    flex: 0 0 auto;
  }
`;

const CategoryRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.6rem;
  border-radius: 0.65rem;
  background: ${(p) => p.$bg || '#eef2ff'};
  color: #0f172a;
  font-weight: 600;
  font-size: 0.8rem;
  border: 1px solid rgba(2, 6, 23, 0.06);
`;

const InstitutionBadge = styled(Badge)`
  background: #fff;
`;

const TermsWrap = styled.div`
  display: grid;
  gap: 0.4rem;
`;

const TermsHeader = styled.div`
  font-size: 1.2rem;
  color: #0f172a;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.45rem;

  svg {
    color: #f97316;
  }
`;

const TermsPills = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const TermPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  background: #f8fafc;
  border: 1px dashed rgba(2, 6, 23, 0.12);
  font-size: 0.85rem;
  color: #334155;

  ${(p) =>
    p.$cancelled &&
    css`
      color: #b91c1c;
      text-decoration: line-through;
      border-color: rgba(185, 28, 28, 0.45);
      background: #fff1f2;
      font-weight: 700;
    `}
`;

const Extra = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.2rem;
`;

const Price = styled.div`
  font-weight: 700;
  color: #0f172a;
`;

// ——— Helperi ———
const two = (n) => String(n).padStart(2, '0');

function fmtDateISOToLocal(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return `${two(d.getDate())}.${two(d.getMonth() + 1)}.${d.getFullYear()}.`;
}
function fmtTimeISOToLocal(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return `${two(d.getHours())}:${two(d.getMinutes())}`;
}
function sameDay(a, b) {
  const da = new Date(a),
    db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}
function priceText(val) {
  const p = parseFloat(val);
  if (!p)
    return (
      <span
        style={{
          backgroundColor: 'var(--color-green-100, #dcfce7)',
          color: 'var(--color-green-700, #166534)',
          padding: '.2rem 1rem',
          borderRadius: '5.25rem',
        }}
      >
        Besplatan ulaz
      </span>
    );
  return `${p.toFixed(2)} KM`;
}

// ——— Nova komponenta ———
/**
 * Očekuje event objekt kakav vraća tvoj API (vidi tvoj dump).
 */
export default function InstitutionEvent({ event }) {
  const {
    idguid,
    title,
    cijena,
    start_date,
    end_date,
    ima_vise_termina,
    termini = [],
    category,
    category_idguid,
    lokacija,
    location, // tekstualni fallback
    institucija,
    otkazano,
    institucija_idguid,
    storedfile,
  } = event || {};

  const posterUrl =
    event?.slika && event.slika !== '00000000-0000-0000-0000-000000000000'
      ? `${URL}/api/image/${event.slika}?height=300`
      : `${URL}/api/events/slika/${event?.idguid}?height=300`;

  const poster = posterUrl || storedfile?.url || null;
  const fallback1 = (category?.boja && shade(category.boja, -8)) || '#fde4d4';
  const fallback2 = institucija?.boja_pozadine_postera || '#fbd1b8';

  const isMultiDay = useMemo(() => {
    if (!start_date || !end_date) return false;
    return !sameDay(start_date, end_date);
  }, [start_date, end_date]);

  const now = Date.now();
  const sortedTerms = useMemo(() => {
    const arr = Array.isArray(termini) ? [...termini] : [];
    arr.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
    return arr;
  }, [termini]);

  const upcomingTerms = useMemo(() => {
    // možeš vratiti `sortedTerms` ako želiš baš sve
    return sortedTerms.filter((t) => new Date(t.start_date).getTime() >= now);
  }, [sortedTerms, now]);

  const shownTerms = upcomingTerms.slice(0, 4);
  const moreTerms = Math.max(upcomingTerms.length - shownTerms.length, 0);

  const categoryColor = category?.boja || '#eef2ff';
  const categoryName = category?.naziv || 'Kategorija';
  const categoryId = category_idguid || category?.idguid;

  const instName = institucija?.naziv || 'Institucija';
  const instId = institucija_idguid || institucija?.idguid;

  const place = lokacija?.naziv || location || '—';

  return (
    <Card>
      <Poster $image={poster} $fallback1={fallback1} $fallback2={fallback2}>
        {otkazano && (
          <>
            <CancelBadge>OTKAZANO</CancelBadge>
            <CancelStripe />
          </>
        )}
      </Poster>

      <Body>
        <Link to={`/dogadjaj/${idguid}`}>
          <Title $cancelled={!!otkazano}>{title}</Title>
        </Link>

        <Meta>
          <CategoryRow>
            {categoryId ? (
              <Badge $bg={categoryColor}>{categoryName}</Badge>
            ) : (
              <Badge $bg={categoryColor}>{categoryName}</Badge>
            )}
          </CategoryRow>

          <Row>
            <HiMapPin />
            <span>{place}</span>
          </Row>

          {/* Jednodnevni ili višednevni prikaz */}
          {!ima_vise_termina && (
            <Row>
              <HiCalendarDateRange />
              <span>
                {isMultiDay
                  ? `${fmtDateISOToLocal(start_date)} (${fmtTimeISOToLocal(
                      start_date
                    )}h) – ${fmtDateISOToLocal(end_date)} (${fmtTimeISOToLocal(end_date)}h)`
                  : `${fmtDateISOToLocal(start_date)} u ${fmtTimeISOToLocal(start_date)}h`}
              </span>
            </Row>
          )}

          {/* Lista termina – precrtaj crveno one sa t.otkazano === true */}
          {ima_vise_termina && upcomingTerms.length > 0 && (
            <TermsWrap>
              <TermsHeader>
                <FaIcons.FaRegClock /> Termini
              </TermsHeader>
              <TermsPills>
                {shownTerms.map((t, idx) => (
                  <TermPill
                    key={idx}
                    $cancelled={!!t.otkazano}
                    title={t.otkazano ? 'Otkazano' : ''}
                  >
                    {fmtDateISOToLocal(t.start_date)} u {fmtTimeISOToLocal(t.start_date)}h
                    {t.otkazano && ' — otkazano'}
                  </TermPill>
                ))}
                {moreTerms > 0 && <TermPill>+{moreTerms} još</TermPill>}
              </TermsPills>
            </TermsWrap>
          )}

          <Row>
            <HiBuildingLibrary />
            {instId ? (
              <Link to={`/institution/${instId}`}>
                <InstitutionBadge>{instName}</InstitutionBadge>
              </Link>
            ) : (
              <InstitutionBadge>{instName}</InstitutionBadge>
            )}
          </Row>
        </Meta>

        <Extra>
          <Price>
            {parseFloat(cijena) === 0 ? (
              priceText(cijena)
            ) : (
              <>Cijena ulaznice: {priceText(cijena)}</>
            )}
          </Price>
        </Extra>
      </Body>
    </Card>
  );
}

// Mala pomoćna funkcija za lagano zatamnjenje/svjetljenje hexa (fallback gradient)
function shade(hex, pct = -10) {
  try {
    const h = hex.replace('#', '');
    const n = parseInt(h, 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    const f = (v) => Math.max(0, Math.min(255, Math.round(v + (v * pct) / 100)));
    const rr = f(r).toString(16).padStart(2, '0');
    const gg = f(g).toString(16).padStart(2, '0');
    const bb = f(b).toString(16).padStart(2, '0');
    return `#${rr}${gg}${bb}`;
  } catch {
    return hex || '#fde4d4';
  }
}
