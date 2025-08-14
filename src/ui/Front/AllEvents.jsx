import React, { useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import Heading from '../Heading';
import * as FaIcons from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { HiBuildingLibrary, HiCalendarDateRange, HiMapPin } from 'react-icons/hi2';

// ---------------------------------------------
// Dummy data
// ---------------------------------------------

// ---------------------------------------------
// Category meta (boje + ikonice)
// ---------------------------------------------

// ---------------------------------------------
// Utils
// ---------------------------------------------
const fmtDate = (iso) => {
  const d = new Date(iso + 'T00:00:00');
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
};

const inRange = (iso, from, to) => {
  if (!from && !to) return true;
  const t = new Date(iso + 'T00:00:00').getTime();
  if (from && t < new Date(from + 'T00:00:00').getTime()) return false;
  if (to && t > new Date(to + 'T00:00:00').getTime()) return false;
  return true;
};

const thisWeekendRange = () => {
  const now = new Date();
  // Make Monday=0..Sunday=6
  const day = (now.getDay() + 6) % 7;
  const saturday = new Date(now);
  saturday.setDate(now.getDate() + ((5 - day + 7) % 7));
  const sunday = new Date(saturday);
  sunday.setDate(saturday.getDate() + 1);
  const toISO = (d) => d.toISOString().slice(0, 10);
  return { from: toISO(saturday), to: toISO(sunday) };
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
`;

const CategoriesRow = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(84px, 1fr);
  gap: 0.75rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
  margin-bottom: 2rem;
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
  /* ${(p) => css`
    background: ${p.$bg};
  `} */

  &:hover {
    ${(p) => css`
      background: ${p.$bg};
    `}
  }
`;

const CatLabel = styled.div`
  font-size: 1.4rem;
  color: var(--color-grey-500);
  text-align: center;
  line-height: 1.1;
`;

const FiltersBar = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 3rem;
  align-items: center;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

const SearchInput = styled.input`
  height: 40px;
  width: 50%;
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

  input {
    height: 40px;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 0 0.5rem;
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
      /* background: #f3f4f6; */
      border-color: var(--color-brand-500);
    `}
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(15, 1fr);
  gap: 1rem;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(9, 1fr);
  }
  @media (max-width: 1100px) {
    grid-template-columns: repeat(8, 1fr);
  }
  @media (max-width: 900px) {
    grid-template-columns: repeat(6, 1fr);
  }
  @media (max-width: 700px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const Card = styled.article`
  grid-column: span 3; /* 4 cards per row on large */
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
  height: 100;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);

  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
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
`;

const Poster = styled.div`
  height: 250px; /* ograničena visina */
  background: linear-gradient(135deg, #e5e7eb, #f9fafb);
  border-bottom: 1px solid #e5e7eb;
  ${(p) =>
    p.$image &&
    css`
      background-image: url(${p.$image});
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    `}
`;

const Body = styled.div`
  padding: 1.2rem 0.9rem 1.8rem 0.9rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: space-between;
  /* display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas:
    'title like'
    'meta meta'
    'extra extra'; */
  gap: 0.4rem 0.75rem;
`;

const Title = styled.h3`
  grid-area: title;
  margin: 0;
  font-size: 1.6rem;
  margin-bottom: 1rem;
  line-height: 1.25;
  letter-spacing: 0.3px;
  color: var(--color-grey-700);

  &:hover {
    color: var(--color-brand-500);
    text-decoration: underline;
  }
`;

const Meta = styled.div`
  grid-area: meta;
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
  grid-area: extra;
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
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 0.5rem;
  background: #fff;
`;

// ---------------------------------------------
// Component
// ---------------------------------------------
export default function AllEvents({ upcomingEvents = [], allCategories = [] }) {
  const [selectedCategory, setSelectedCategory] = useState(null); // string | null
  const [query, setQuery] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [filterFree, setFilterFree] = useState(false);
  const [filterWeekend, setFilterWeekend] = useState(false);
  const [inst, setInst] = useState(''); // '' = sve

  const childrenOnly = (allCategories ?? []).flatMap((p) => p.children ?? []);

  //KATEGORIJE
  const CATEGORY_META = (childrenOnly ?? []).reduce((acc, cat) => {
    const IconComp = FaIcons[cat.ikona]; // npr. "FaFilm" -> komponenta
    acc[cat.naziv] = {
      color: cat.boja || '#9CA3AF',
      icon: IconComp ? <IconComp /> : '•',
    };
    return acc;
  }, {});

  const getCategoryMeta = (name) => CATEGORY_META[name] || { color: '#9CA3AF', icon: '•' };

  //EVENTS
  const allEvents = upcomingEvents.map((event) => {
    const startDate = new Date(event.start_date);
    const formatedDate =
      startDate.getFullYear() +
      '-' +
      String(startDate.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(startDate.getDate()).padStart(2, '0');

    const formattedTime =
      String(startDate.getHours()).padStart(2, '0') +
      ':' +
      String(startDate.getMinutes()).padStart(2, '0');

    let posterSlika;

    if (event.slika !== '00000000-0000-0000-0000-000000000000') {
      posterSlika = `https://events-opcina.poruci.ba/api/image/${event.slika}?height=300`;
    } else {
      posterSlika = `https://events-opcina.poruci.ba/api/events/slika/${event.idguid}`;
    }

    return {
      id: event.idguid,
      title: event.title,
      price: parseFloat(event.cijena),
      date: formatedDate,
      time: formattedTime,
      category: event.category.naziv,
      category_idguid: event.category.idguid,
      poster: posterSlika,
      location: 'Coworking Hub',
      institution: event.institucija.naziv,
      institution_idguid: event.institucija.idguid,
      going: 37,
    };
  });

  const institutions = useMemo(() => uniq(allEvents.map((e) => e.institution)), [allEvents]);

  const weekend = thisWeekendRange();

  const categories = useMemo(() => uniq(allEvents.map((e) => e.category)), [allEvents]);

  const filtered = useMemo(() => {
    return allEvents
      .filter((e) => {
        if (selectedCategory && e.category !== selectedCategory) return false;
        if (inst && e.institution !== inst) return false;
        if (filterFree && Number(e.price) > 0) return false;

        const search = query.trim().toLowerCase();
        if (search) {
          const blob = `${e.title} ${e.location} ${e.institution}`.toLowerCase();
          if (!blob.includes(search)) return false;
        }

        let f = from,
          t = to;
        if (filterWeekend) {
          f = weekend.from;
          t = weekend.to;
        }
        if (!inRange(e.date, f, t)) return false;

        return true;
      })
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  }, [
    selectedCategory,
    inst,
    filterFree,
    query,
    from,
    to,
    filterWeekend,
    weekend.from,
    weekend.to,
    allEvents,
  ]);

  return (
    <Page>
      {/* Categories strip */}
      <Heading as="h2">Pregled svih predstojećih događaja u Tešnju</Heading>
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
            All
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
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </DateRange>
      </FiltersBar>
      {/* Cards */}
      <Grid>
        {filtered.map((e) => {
          return (
            <Card key={e.id}>
              <Poster $image={e.poster} />
              <Body>
                <Link to={`/dogadjaj/${e.id}`}>
                  <Title>{e.title}</Title>
                </Link>
                <Meta>
                  <CategoryRow>
                    <Link to={`/category/${e.category_idguid}`}>
                      <Badge>{e.category}</Badge>
                    </Link>
                  </CategoryRow>
                  <Row>
                    {/* <span>📍</span> */}
                    <HiMapPin />
                    <span>{e.location}</span>
                  </Row>
                  <Row>
                    {/* <span>📅</span> */}
                    <HiCalendarDateRange />
                    <span>
                      {fmtDate(e.date)} u {e.time}h
                    </span>
                  </Row>
                  <Row>
                    <HiBuildingLibrary />
                    <Link to={`/institution/${e.institution_idguid}`}>
                      {/* <span>🏛️</span> */}
                      <InstitutionBadge>{e.institution}</InstitutionBadge>
                      {/* <span style={{ marginLeft: '0.35rem', color: '#6b7280' }}></span> */}
                    </Link>
                  </Row>
                </Meta>
                <Extra>
                  <Price>
                    {e.price === 0 ? (
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
                      `${e.price.toFixed(2)} KM`
                    )}
                  </Price>
                </Extra>
              </Body>
            </Card>
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
