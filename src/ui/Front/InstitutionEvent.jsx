// EventCardNew.jsx
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import { HiBuildingLibrary, HiMapPin, HiCalendarDateRange } from 'react-icons/hi2';

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
`;

const Poster = styled.div`
  background-image: ${(p) =>
    p.$image
      ? `url(${p.$image})`
      : `linear-gradient(135deg, ${p.$fallback1} 0%, ${p.$fallback2} 100%)`};
  background-size: cover;
  background-position: center;
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
 * Opcionalno možeš proslijediti `posterUrl` ako imaš direktan URL,
 * inače će se koristiti gradijent iz boje kategorije / institucije.
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
    institucija_idguid,
    storedfile, // ako nekad budeš imao url slike
  } = event || {};

  const posterUrl =
    event.slika !== '00000000-0000-0000-0000-000000000000'
      ? `https://events-opcina.poruci.ba/api/image/${event.slika}?height=300`
      : `https://events-opcina.poruci.ba/api/events/slika/${event.idguid}`;

  // Poster: koristiš direktni URL ako imaš; u suprotnom gradient.
  const poster = posterUrl || storedfile?.url || null;
  const fallback1 = (category?.boja && shade(category.boja, -8)) || '#fde4d4';
  const fallback2 = institucija?.boja_pozadine_postera || '#fbd1b8';

  const isMultiDay = useMemo(() => {
    if (!start_date || !end_date) return false;
    return !sameDay(start_date, end_date);
  }, [start_date, end_date]);

  // Sortiraj termine po datumu; prikazi samo buduće (ili sve – po želji).
  const now = Date.now();
  const sortedTerms = useMemo(() => {
    const arr = Array.isArray(termini) ? [...termini] : [];
    arr.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
    return arr;
  }, [termini]);

  const upcomingTerms = useMemo(() => {
    // ako želiš SVE termine, umjesto filtera vrati `sortedTerms`
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
      <Poster $image={poster} $fallback1={fallback1} $fallback2={fallback2} />

      <Body>
        <Link to={`/dogadjaj/${idguid}`}>
          <Title>{title}</Title>
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
                  ? `${fmtDateISOToLocal(start_date)} (${fmtTimeISOToLocal(start_date)}h) – ${fmtDateISOToLocal(end_date)} (${fmtTimeISOToLocal(end_date)}h)`
                  : `${fmtDateISOToLocal(start_date)} u ${fmtTimeISOToLocal(start_date)}h`}
              </span>
            </Row>
          )}

          {/* Lista termina */}
          {ima_vise_termina && upcomingTerms.length > 0 && (
            <TermsWrap>
              <TermsHeader>
                <FaIcons.FaRegClock /> Termini
              </TermsHeader>
              <TermsPills>
                {shownTerms.map((t, idx) => (
                  <TermPill key={idx}>
                    {fmtDateISOToLocal(t.start_date)} u {fmtTimeISOToLocal(t.start_date)}h
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
          <Price>{priceText(cijena)}</Price>
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
