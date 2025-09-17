import React, { useMemo, useState, useCallback } from 'react';
import styled, { css } from 'styled-components';
import Heading from '../Heading';
import { FaRegClock } from 'react-icons/fa';
import { FA_ICONS as FaIcons } from '../iconsMap';
import { Link, useNavigate } from 'react-router-dom';
import { HiBuildingLibrary, HiCalendarDateRange, HiMapPin } from 'react-icons/hi2';
import { URL } from '../../utils/constants';
import { useGetManifestationById } from '../../features/front/useManifestationById';
import CalendarSpinner from '../CalendarSpinner';
// Utils
// ---------------------------------------------
const pad = (n) => String(n).padStart(2, '0');

const fmtDate = (isoYmd) => {
  const d = new Date(isoYmd + 'T00:00:00');
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
};

function ManifestBadge({ manifestId }) {
  const { isLoading, manifestation } = useGetManifestationById({ id: manifestId });
  const title = manifestation?.data?.title || 'Manifestacija';

  if (!manifestId) return null;

  if (isLoading) return <CalendarSpinner />;

  return (
    // <PosterTag title={title}>

    //   <Link to={`/manifestation/${manifestId}`}>{title}</Link>
    <PosterTag title={title}>
      <Link to={`/manifestation/${manifestId}`} onClick={(e) => e.stopPropagation()}>
        {title}
      </Link>
    </PosterTag>
  );
}

const fmtDateFromObj = (d) => `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;

const fmtTimeFromObj = (d) =>
  new Intl.DateTimeFormat('bs-BA', { hour: '2-digit', minute: '2-digit' }).format(d);

// string compare for YYYY-MM-DD
const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

// da li se [s,e] (YYYY-MM-DD) preklapa sa [f,t]
function overlapsDaySpan(s, e, f, t) {
  const start = s;
  const end = e || s;
  if (f && t) return cmp(start, t) <= 0 && cmp(end, f) >= 0;
  if (f && !t) return cmp(end, f) >= 0;
  if (!f && t) return cmp(start, t) <= 0;
  return true;
}

// ❗ Lokalno formatiranje, bez UTC pomaka
const toLocalISODate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const thisWeekendRange = () => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=nedjelja, 1=ponedjeljak, ..., 6=subota

  let saturday, sunday;

  if (dayOfWeek === 0) {
    saturday = new Date(now);
    saturday.setDate(now.getDate() - 1);
    sunday = new Date(now);
  } else if (dayOfWeek === 6) {
    saturday = new Date(now);
    sunday = new Date(now);
    sunday.setDate(now.getDate() + 1);
  } else {
    const daysUntilSaturday = 6 - dayOfWeek;
    saturday = new Date(now);
    saturday.setDate(now.getDate() + daysUntilSaturday);
    sunday = new Date(saturday);
    sunday.setDate(saturday.getDate() + 1);
  }

  saturday.setHours(0, 0, 0, 0);
  sunday.setHours(0, 0, 0, 0);

  return { from: toLocalISODate(saturday), to: toLocalISODate(sunday) };
};

const uniq = (arr) => Array.from(new Set(arr));

// ---------------------------------------------
// Styled components
// ---------------------------------------------
const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 7rem 0;
  width: 80%;

  @media (max-width: 550px) {
    margin-top: 2rem;
    gap: 0;
    width: 90%;
    margin: 0 0 5rem 0;
  }
`;

const CategoriesRow = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(84px, 1fr);
  gap: 0.75rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
  margin-bottom: 2rem;
  scrollbar-gutter: stable;

  @media (max-width: 550px) {
    grid-auto-columns: auto;
  }
`;

const CategoryItem = styled.button`
  appearance: none;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.25rem 0.5rem;
  border-radius: 10px;
  transition: background 0.2s ease;

  &:hover {
    background: #f9fafb;
  }

  ${(p) =>
    p.$active &&
    css`
      outline: 2px solid #e5e7eb;
      background: #f3f4f6;
    `}
`;

const CatDot = styled.div`
  width: 6rem;
  height: 6rem;
  border-radius: 5rem;
  display: grid;
  place-items: center;
  color: #111827;
  font-size: 2.4rem;
  border: 2px solid rgba(0, 0, 0, 0.06);
  background-color: #ffffff;

  &:hover {
    ${(p) => css`
      background: ${p.$bg};
    `}
  }

  @media (max-width: 550px) {
    width: 5rem;
    height: 5rem;
    font-size: 2rem;
  }
`;

const CatLabel = styled.div`
  font-size: 1.6rem;
  color: var(--color-grey-500);
  text-align: center;
  line-height: 1.1;

  @media (max-width: 550px) {
    font-size: 1rem;
  }
`;

const FiltersBar = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 3rem;
  align-items: center;

  @media (max-width: 1000px) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    flex-direction: column-reverse;
    gap: 1rem;
  }
`;

const SearchInput = styled.input`
  height: 40px;
  width: 100%;
  align-self: center;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 0.75rem;
  outline: none;
  margin: 3rem 0 2rem 0;

  &:focus {
    border-color: var(--color-brand-500);
  }
`;

const DateRange = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  width: 100%;

  input {
    height: 40px;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 0 0.5rem;
  }

  @media (max-width: 550px) {
    grid-template-columns: 1fr;
    input {
      height: 30px;
    }
  }
`;

const QuickFilters = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Chip = styled.button`
  height: 36px;
  padding: 0 0.8rem;
  background: #ffffff;
  color: #111827;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    background: #f9fafb;
  }

  ${(p) =>
    p.$active &&
    css`
      border-color: var(--color-brand-500);
    `}

  @media (max-width: 550px) {
    font-size: 1.2rem;
    height: 30px;
    margin-bottom: 1rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(15, 1fr);
  gap: 1rem;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(12, 1fr);
  }
  @media (max-width: 1100px) {
    grid-template-columns: repeat(12, 1fr);
  }
  @media (max-width: 900px) {
    grid-template-columns: repeat(12, 1fr);
  }
  @media (max-width: 700px) {
    grid-template-columns: repeat(12, 1fr);
  }
  @media (max-width: 550px) {
    grid-template-columns: repeat(12, 1fr);
  }
  @media (max-width: 440px) {
    width: 80%;
    grid-template-columns: repeat(6, 1fr);
  }
  @media (max-width: 350px) {
    width: 100%;
    grid-template-columns: repeat(6, 1fr);
  }
`;

// const Card = styled(Link)`
const Card = styled.div`
  grid-column: span 3;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
  /* height: 100; */
  height: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    cursor: pointer;
  }

  @media (max-width: 1100px) {
    grid-column: span 3;
  }
  @media (max-width: 900px) {
    grid-column: span 4;
  }
  @media (max-width: 700px) {
    grid-column: span 6;
  }
  @media (max-width: 550px) {
    justify-content: flex-start;
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
  height: 250px;
  background: linear-gradient(135deg, #e5e7eb, #f9fafb);
  border-bottom: 1px solid #e5e7eb;
  position: relative; /* za badge */

  ${(p) =>
    p.$image &&
    css`
      background-image: url(${p.$image});
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    `}

  @media (max-width:550px) {
    height: 150px;
  }
`;

const PosterTag = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  background: #111827;
  color: #fff;
  font-size: 11px;
  padding: 5px 9px;
  border-radius: 999px;
  opacity: 0.95;

  a {
    color: inherit;
    text-decoration: none;
  }
`;

const Body = styled.div`
  padding: 1.2rem 0.9rem 1.8rem 0.9rem;
  display: flex;
  height: 50%;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.4rem 0.75rem;
`;

const Title = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.6rem;
  line-height: 1.25;
  letter-spacing: 0.3px;
  color: var(--color-grey-700);

  ${(p) =>
    p.$cancelled &&
    css`
      color: #991b1b;
      text-decoration: line-through;
    `}

  &:hover {
    color: var(--color-brand-500);
    text-decoration: underline;
  }
`;

const Meta = styled.div`
  display: grid;
  row-gap: 0.25rem;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #374151;
  font-size: 1.4rem;
`;

const CategoryRow = styled(Row)`
  margin-bottom: 1rem;
`;

const Badge = styled.span`
  background: #eef2ff;
  color: #3730a3;
  border: 1px solid #c7d2fe;
  border-radius: 999px;
  padding: 0.3rem 0.7rem;
  font-size: 1.2rem;

  &:hover {
    background: #dae0f3;
  }
`;

const Extra = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  margin-top: 0.3rem;
`;

const InstitutionBadge = styled.span`
  margin-left: 0.2rem;
  &:hover {
    text-decoration: underline;
    color: var(--color-brand-500);
  }
`;

const Price = styled.span`
  font-weight: 700;
  color: #111827;
`;

const Select = styled.select`
  height: 40px;
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 0.5rem;
  background: #fff;

  @media (max-width: 550px) {
    height: 30px;
    font-size: 1.2rem;
  }
`;

// Termini list on card
const TermsWrap = styled.div`
  margin-top: 0.35rem;
  display: grid;
  gap: 0.35rem;
`;
const TermsHeader = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #374151;
  font-size: 1.25rem;
`;
const TermsPills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
`;
const TermPill = styled.span`
  background: #ffffff;
  color: #111827;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  padding: 0.15rem 0.55rem;
  font-size: 1.2rem;

  ${(p) =>
    p.$cancelled &&
    css`
      background: #fee2e2;
      border-color: #fecaca;
      color: #991b1b;
      text-decoration: line-through;
    `}
`;

// ---------------------------------------------
// Component
// ---------------------------------------------
export default function AllEvents({ upcomingEvents = [], allCategories = [] }) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [query, setQuery] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [filterFree, setFilterFree] = useState(false);
  const [filterWeekend, setFilterWeekend] = useState(false);
  const [inst, setInst] = useState('');

  const childrenOnly = (allCategories ?? []).flatMap((p) => p.children ?? []);

  // KATEGORIJE
  const CATEGORY_META = (childrenOnly ?? []).reduce((acc, cat) => {
    const IconComp = FaIcons[cat.ikona];
    acc[cat.naziv] = {
      color: cat.boja || '#9CA3AF',
      icon: IconComp ? <IconComp /> : '•',
    };
    return acc;
  }, {});

  const getCategoryMeta = (name) => CATEGORY_META[name] || { color: '#9CA3AF', icon: '•' };

  // EVENTS (sa end_date/end_time + termini)
  const allEvents = upcomingEvents.map((event) => {
    const start = new Date(event.start_date);
    const dateStr = [start.getFullYear(), pad(start.getMonth() + 1), pad(start.getDate())].join(
      '-'
    );
    const timeStr = [pad(start.getHours()), pad(start.getMinutes())].join(':');

    const end = event.end_date ? new Date(event.end_date) : new Date(event.start_date);
    const endDateStr = [end.getFullYear(), pad(end.getMonth() + 1), pad(end.getDate())].join('-');
    const endTimeStr = [pad(end.getHours()), pad(end.getMinutes())].join(':');

    const posterSlika =
      event.slika !== '00000000-0000-0000-0000-000000000000'
        ? `${URL}/api/image/${event.slika}?height=300`
        : `${URL}/api/events/slika/${event.idguid}?height=300`;

    // ➕ Manifestacija: pokušaj izvući id i/ili naslov ako postoji
    const manifestId =
      event.manif_idguid || event.manifestacija?.idguid || event.manifestation_id || null;
    const manifestTitle =
      (event.manifestacija &&
        typeof event.manifestacija === 'object' &&
        event.manifestacija.title) ||
      event.manifestacija_title ||
      event.manifestation_title ||
      null;

    return {
      id: event.idguid,
      title: event.title,
      price: parseFloat(event.cijena),
      otkazano: !!event.otkazano,
      date: dateStr, // YYYY-MM-DD
      time: timeStr, // HH:MM
      end_date: endDateStr,
      end_time: endTimeStr,
      category: event.category?.naziv ?? event.category, // robustno
      category_idguid: event.category?.idguid ?? event.category_idguid,
      poster: posterSlika,
      location: event.lokacija?.naziv ?? event.location ?? '',
      institution: event.institucija?.naziv ?? event.institution ?? '',
      institution_idguid: event.institucija?.idguid ?? event.institution_idguid,
      ima_vise_termina: !!event.ima_vise_termina,
      termini: Array.isArray(event.termini) ? event.termini : [],
      // manifestacija
      manifest_id: manifestId,
      manifest_title: manifestTitle,
      belongsToManifestation: !!(manifestId || manifestTitle || event.manifestacija === true),
    };
  });

  const institutions = useMemo(
    () => uniq(allEvents.map((e) => e.institution).filter(Boolean)),
    [allEvents]
  );
  const categories = useMemo(
    () => uniq(allEvents.map((e) => e.category).filter(Boolean)),
    [allEvents]
  );

  const weekend = thisWeekendRange();

  // ISPRAVLJENA helper funkcija: da li event zadovoljava date-range/weekend filtere
  const matchesDateFilters = useCallback(
    (e) => {
      let f = from;
      let t = to;
      if (filterWeekend) {
        f = weekend.from;
        t = weekend.to;
      }
      if (!f && !t) return true;

      if (e.ima_vise_termina) {
        const termDates = (e.termini || [])
          .map((tt) => (tt?.start_date ? String(tt.start_date).slice(0, 10) : null))
          .filter(Boolean);

        return termDates.some((termDate) => {
          if (f && t) return cmp(termDate, f) >= 0 && cmp(termDate, t) <= 0;
          if (f && !t) return cmp(termDate, f) >= 0;
          if (!f && t) return cmp(termDate, t) <= 0;
          return true;
        });
      } else {
        const eventStart = e.date;
        const eventEnd = e.end_date || e.date;
        return overlapsDaySpan(eventStart, eventEnd, f, t);
      }
    },
    [from, to, filterWeekend, weekend.from, weekend.to]
  );

  // helper: sortiranje po "narednom nastupu"
  const sortKey = useCallback((e) => {
    if (e.ima_vise_termina) {
      const nowMs = Date.now();
      const future = (e.termini || [])
        .map((tt) => (tt?.start_date ? new Date(tt.start_date) : null))
        .filter((d) => d && d.getTime() >= nowMs)
        .sort((a, b) => a - b);
      if (future[0]) return future[0].toISOString();
    }
    return `${e.date}T${e.time || '00:00'}:00`;
  }, []);

  const filtered = useMemo(() => {
    return allEvents
      .filter((e) => {
        if (selectedCategory && e.category !== selectedCategory) return false;
        if (inst && e.institution !== inst) return false;
        if (filterFree && Number(e.price) > 0) return false;

        const search = query.trim().toLowerCase();
        if (search) {
          const blob =
            `${e.title} ${e.location} ${e.institution} ${e.manifest_title || ''}`.toLowerCase();
          if (!blob.includes(search)) return false;
        }

        if (!matchesDateFilters(e)) return false;

        return true;
      })
      .sort((a, b) => new Date(sortKey(a)) - new Date(sortKey(b)));
  }, [selectedCategory, inst, filterFree, query, allEvents, matchesDateFilters, sortKey]);

  const now = new Date();

  return (
    <Page>
      <Heading as="h1">Pregled svih predstojećih događaja u Tešnju</Heading>

      <SearchInput
        type="text"
        placeholder="Pronađi događaj..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <CategoriesRow>
        {categories.map((c) => {
          const meta = getCategoryMeta(c);
          const active = selectedCategory === c;
          return (
            <CategoryItem
              key={c}
              onClick={() => setSelectedCategory(active ? null : c)}
              $active={active}
              title={c}
            >
              <CatDot $bg={meta.color}>{meta.icon}</CatDot>
              <CatLabel>{c}</CatLabel>
            </CategoryItem>
          );
        })}
      </CategoriesRow>

      {/* Filters */}
      <FiltersBar>
        <QuickFilters>
          <Chip
            onClick={() => {
              setSelectedCategory(null);
              setQuery('');
              setFrom('');
              setTo('');
              setFilterFree(false);
              setFilterWeekend(false);
              setInst('');
            }}
          >
            Svi
          </Chip>
          <Chip $active={filterFree} onClick={() => setFilterFree((v) => !v)}>
            Besplatni
          </Chip>
          <Chip $active={filterWeekend} onClick={() => setFilterWeekend((v) => !v)}>
            Ovaj vikend
          </Chip>
        </QuickFilters>
        <Select value={inst} onChange={(e) => setInst(e.target.value)}>
          <option value="">Sve institucije</option>
          {institutions.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </Select>

        <DateRange>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '1.2rem', alignItems: 'center' }}>
            <span>Datum početka</span>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '1.2rem', alignItems: 'center' }}>
            <span>Datum kraja</span>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
        </DateRange>
      </FiltersBar>

      {/* Cards */}
      <Grid>
        {filtered.map((e) => {
          const isMultiDay = e.end_date && e.end_date !== e.date;

          const startObj = new Date(`${e.date}T${e.time || '00:00'}:00`);
          const endObj = new Date(`${e.end_date || e.date}T${e.end_time || e.time || '23:59'}:00`);

          const hasStarted = now >= startObj;
          const hasEnded = now > endObj;
          const isOngoing = hasStarted && !hasEnded;

          const futureTerms = (e.termini || [])
            .filter((t) => t?.start_date && new Date(t.start_date) > now)
            .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

          const shownTerms = futureTerms.slice(0, 6);
          const moreTerms = Math.max(0, futureTerms.length - shownTerms.length);

          // const showManifestBadge = e.belongsToManifestation;
          // const manifestBadgeContent = e.manifest_title || 'Manifestacija';

          return (
            // <Link to={`/dogadjaj/${e.id}`}>
            // <Card key={e.id} to={`/dogadjaj/${e.id}`}>
            <Card
              key={e.id}
              role="link"
              tabIndex={0}
              onClick={() => navigate(`/dogadjaj/${e.id}`)}
              onKeyDown={(ev) => ev.key === 'Enter' && navigate(`/dogadjaj/${e.id}`)}
            >
              {e.otkazano && <CancelRibbon>OTKAZANO</CancelRibbon>}

              <Poster $image={e.poster}>
                {e.manifest_id && <ManifestBadge manifestId={e.manifest_id} />}
              </Poster>

              <Body>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* <Link to={`/dogadjaj/${e.id}`}> */}
                    <Link to={`/dogadjaj/${e.id}`} onClick={(ev) => ev.stopPropagation()}>
                      <Title $cancelled={e.otkazano}>{e.title}</Title>
                    </Link>
                  </div>
                  {e.category && (
                    <CategoryRow>
                      <Badge>{e.category}</Badge>
                    </CategoryRow>
                  )}
                </div>

                <Meta>
                  {e.location && (
                    <Row>
                      <HiMapPin />
                      <span>{e.location}</span>
                    </Row>
                  )}

                  {!e.ima_vise_termina && (
                    <Row>
                      <HiCalendarDateRange />
                      {isOngoing ? (
                        <span style={{ color: '#6b7280' }}>
                          {isMultiDay
                            ? `${fmtDate(e.date)} (${e.time}h) – ${fmtDate(e.end_date)} (${e.end_time}h)`
                            : `${fmtDate(e.date)} u ${e.time}h`}
                        </span>
                      ) : (
                        <span>
                          {isMultiDay
                            ? `${fmtDate(e.date)} (${e.time}h) – ${fmtDate(e.end_date)} (${e.end_time}h)`
                            : `${fmtDate(e.date)} u ${e.time}h`}
                        </span>
                      )}
                    </Row>
                  )}

                  {/* Termini lista (prikaži i označi otkazane termine) */}
                  {e.ima_vise_termina && shownTerms.length > 0 && (
                    <TermsWrap>
                      <TermsHeader>
                        <FaRegClock /> Termini
                      </TermsHeader>
                      <TermsPills>
                        {shownTerms.map((t, idx) => {
                          const d = new Date(t.start_date);
                          return (
                            <TermPill
                              key={idx}
                              $cancelled={!!t.otkazano}
                              title={t.otkazano ? 'Otkazano' : ''}
                            >
                              {fmtDateFromObj(d)} u {fmtTimeFromObj(d)}h
                              {t.otkazano ? ' — Otkazano' : ''}
                            </TermPill>
                          );
                        })}
                        {moreTerms > 0 && <TermPill>+{moreTerms} još</TermPill>}
                      </TermsPills>
                    </TermsWrap>
                  )}

                  {e.institution && (
                    <Row>
                      <HiBuildingLibrary />
                      {/* <Link to={`/institution/${e.institution_idguid}`}> */}
                      <Link
                        to={`/institution/${e.institution_idguid}`}
                        onClick={(ev) => ev.stopPropagation()}
                      >
                        <InstitutionBadge>{e.institution}</InstitutionBadge>
                      </Link>
                    </Row>
                  )}
                </Meta>

                <Extra>
                  <Price>
                    {Number(e.price) === 0 ? (
                      <span
                        style={{
                          backgroundColor: 'var(--color-green-100)',
                          padding: '.2rem 1rem',
                          borderRadius: '5.25rem',
                          color: 'var(--color-green-700)',
                        }}
                      >
                        Besplatan ulaz
                      </span>
                    ) : (
                      `Cijena ulaznice: ${Number(e.price).toFixed(2)} KM`
                    )}
                  </Price>
                </Extra>
              </Body>
            </Card>
            // </Link>
          );
        })}
      </Grid>

      {filtered.length === 0 && (
        <div style={{ color: '#6b7280', padding: '0.5rem 0' }}>
          Nema događaja za odabrane filtere.
        </div>
      )}
    </Page>
  );
}
