import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import * as Fa from 'react-icons/fa';
import Heading from './Heading';

/**
 * EventsStatsDashboard
 * -------------------------------------------------------
 * • JSX + styled-components
 * • Charts rendered with recharts (npm i recharts styled-components)
 * • Uses dummy data shaped like your API; pass `events` prop to override
 * • Shows:
 *    - Total events by institution
 *    - Total events by category
 *    - Active vs Past by institution
 *    - Active vs Past by category
 *    - Events per month (year selector)
 */

// —— Brand palette (adjust as needed) ——
const BRAND = '#f97316'; // primary
const SURFACE = '#ffffff';
const INK = '#0f172a';
const MUTED = '#64748b';

// —— Layout ——
const Page = styled.div`
  --brand: ${BRAND};
  --surface: ${SURFACE};
  --ink: ${INK};
  --muted: ${MUTED};

  padding: 1rem 0rem;
  /* background: #f8fafc; */
  color: var(--ink);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const H1 = styled.h1`
  margin: 0;
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: 0.2px;
`;

const Filters = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  select {
    padding: 0.5rem 0.75rem;
    border-radius: 0.75rem;
    border: 1px solid #e2e8f0;
    background: var(--surface);
    color: var(--ink);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;
`;

const Card = styled.div`
  background: var(--surface);
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 10px 24px rgba(2, 6, 23, 0.06);
`;

const CardTitle = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: var(--muted);
`;

// —— Filter bar ——
const FilterBar = styled(Card)`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 0.75rem;
  align-items: end;
`;
const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  grid-column: span 3;
  label {
    font-size: 0.8rem;
    color: var(--muted);
  }
  input,
  select {
    padding: 0.55rem 0.75rem;
    border-radius: 0.75rem;
    border: 1px solid #e2e8f0;
    background: var(--surface);
    color: var(--ink);
    outline: none;
  }
`;
const Actions = styled.div`
  grid-column: span 3;
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;
const Btn = styled.button`
  padding: 0.6rem 0.9rem;
  border-radius: 0.75rem;
  border: 1px solid transparent;
  font-weight: 700;
  cursor: pointer;
  background: ${BRAND};
  color: #fff;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
  box-shadow: 0 10px 18px rgba(249, 115, 22, 0.25);
  &:hover {
    transform: translateY(-1px);
  }
  &[data-variant='ghost'] {
    background: #fff;
    color: var(--ink);
    border-color: #e2e8f0;
    box-shadow: none;
  }
`;

// —— KPI Cards ——
const KPIRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
`;
const KPICard = styled(Card)`
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #fff 0%, #fff 60%, rgba(249, 115, 22, 0.06) 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 112px;
`;
const KPIGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;
const KPILabel = styled.span`
  color: var(--muted);
  font-weight: 700;
`;
const KPIValue = styled.span`
  font-size: 2rem;
  line-height: 1;
  font-weight: 900;
`;
const KPISub = styled.span`
  font-size: 0.8rem;
  color: var(--muted);
`;
const KPIIconBubble = styled.div`
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(249, 115, 22, 0.15);
  color: var(--brand);
`;

const StatRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
`;

const Stat = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StatLabel = styled.span`
  color: var(--muted);
  font-weight: 600;
`;

const StatValue = styled.span`
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--ink);
`;

// ————————————————————————————————————————————————————
// Dummy data (replace with API data via `events` prop)
// ————————————————————————————————————————————————————

const DUMMY_EVENTS = [
  // Given example
  {
    idguid: 'b7f7f0c9-6b5a-4e5f-93a0-5a1f2b7c9d12',
    title: 'Tešanjski ljetni jazz',
    description: 'Večeri jazza na otvorenom uz regionalne izvođače.',
    cijena: '10.00',
    start_date: '2025-09-05T19:30:00',
    end_date: '2025-09-07T22:00:00',
    ima_vise_termina: true,
    termini: [
      { start_date: '2025-09-05T19:30:00', end_date: '2025-09-05T21:30:00' },
      { start_date: '2025-09-06T20:00:00', end_date: '2025-09-06T22:00:00' },
      { start_date: '2025-09-07T20:00:00', end_date: '2025-09-07T22:00:00' },
    ],
    category: {
      idguid: 'f1a2b3c4-d5e6-4789-9abc-1234567890ab',
      naziv: 'Muzika',
      boja: '#eef2ff',
      ikona: 'FaMusic',
    },
    lokacija: {
      naziv: 'Dom kulture Tešanj',
      adresa: 'Ul. Kulturna 1, Tešanj',
      latitude: 44.61321,
      longitude: 17.98567,
    },
    institucija: {
      idguid: '0a1b2c3d-4e5f-6789-abcd-0123456789ab',
      naziv: 'JU Dom kulture Tešanj',
      logo: 'https://example.com/logos/dom-kulture.png',
      email: 'info@domkulture-tesanj.ba',
      web_stranica: 'https://domkulture-tesanj.ba',
    },
    slika: '3c0b1a2d-9e88-4d6a-bc12-34567890abcd',
  },
  // More dummy
  {
    idguid: '11111111-2222-3333-4444-555555555555',
    title: 'Filmska noć klasika',
    description: 'Projekcije klasičnih filmova.',
    cijena: '0.00',
    start_date: '2025-08-20T20:30:00',
    end_date: '2025-08-20T23:00:00',
    ima_vise_termina: false,
    termini: [],
    category: {
      idguid: 'c1a2b3c4-d5e6-4789-9abc-0987654321aa',
      naziv: 'Film',
      boja: '#f3cece',
      ikona: 'FaFilm',
    },
    lokacija: {
      naziv: 'Ljetna pozornica',
      adresa: 'Park, Tešanj',
      latitude: 44.614,
      longitude: 17.986,
    },
    institucija: {
      idguid: 'b1b2c3d4-e5f6-789a-bcde-111122223333',
      naziv: 'Kino klub Tešanj',
      logo: 'https://example.com/logos/kino.png',
      email: 'kino@tesanj.ba',
      web_stranica: 'https://kino.tesanj.ba',
    },
    slika: 'abc111',
  },
  {
    idguid: '22222222-3333-4444-5555-666666666666',
    title: 'Izložba skulptura mladih umjetnika',
    description: 'Savremene skulpture iz BiH.',
    cijena: '3.00',
    start_date: '2025-07-10T18:00:00',
    end_date: '2025-07-25T20:00:00',
    ima_vise_termina: false,
    termini: [],
    category: {
      idguid: '9c9c9c9c-aaaa-bbbb-cccc-ddddeeeeffff',
      naziv: 'Izložba',
      boja: '#e3f8ef',
      ikona: 'FaImage',
    },
    lokacija: {
      naziv: 'Gradska galerija',
      adresa: 'Centar bb, Tešanj',
      latitude: 44.612,
      longitude: 17.988,
    },
    institucija: {
      idguid: '9999aaaa-bbbb-cccc-dddd-eeeeffff0000',
      naziv: 'JU Muzej i galerija Tešanj',
      logo: 'https://example.com/logos/muzej.png',
      email: 'muzej@tesanj.ba',
      web_stranica: 'https://muzej.tesanj.ba',
    },
    slika: 'abc222',
  },
  {
    idguid: '33333333-4444-5555-6666-777777777777',
    title: 'Promocija knjige: Hronike Tešnja',
    description: 'Susret sa autorom i potpisivanje.',
    cijena: '0.00',
    start_date: '2025-10-02T18:00:00',
    end_date: '2025-10-02T19:30:00',
    ima_vise_termina: false,
    termini: [],
    category: {
      idguid: 'abab107e-2a93-4cd5-aea7-b4ad2446b10e',
      naziv: 'Promocija knjige',
      boja: '#c3c2ff',
      ikona: 'FaBook',
    },
    lokacija: {
      naziv: 'Gradska biblioteka',
      adresa: 'Ul. Knjige 2, Tešanj',
      latitude: 44.6128,
      longitude: 17.9822,
    },
    institucija: {
      idguid: '12121212-3434-5656-7878-909090909090',
      naziv: 'Gradska biblioteka Tešanj',
      logo: 'https://example.com/logos/biblioteka.png',
      email: 'info@biblioteka.tesanj.ba',
      web_stranica: 'https://biblioteka.tesanj.ba',
    },
    slika: 'abc333',
  },
  {
    idguid: '44444444-5555-6666-7777-888888888888',
    title: 'Pozorišna predstava: Hamlet (gostovanje)',
    description: 'Klasik u modernoj interpretaciji.',
    cijena: '8.00',
    start_date: '2025-11-15T19:00:00',
    end_date: '2025-11-15T21:30:00',
    ima_vise_termina: false,
    termini: [],
    category: {
      idguid: '12ab12ab-34cd-56ef-78ab-90cd12ef34ab',
      naziv: 'Pozorište',
      boja: '#e3f8ef',
      ikona: 'FaTheaterMasks',
    },
    lokacija: {
      naziv: 'Pozorišna sala',
      adresa: 'Ul. Scene 5, Tešanj',
      latitude: 44.6115,
      longitude: 17.9877,
    },
    institucija: {
      idguid: '0a1b2c3d-4e5f-6789-abcd-0123456789ab',
      naziv: 'JU Dom kulture Tešanj',
      logo: 'https://example.com/logos/dom-kulture.png',
      email: 'info@domkulture-tesanj.ba',
      web_stranica: 'https://domkulture-tesanj.ba',
    },
    slika: 'abc444',
  },
  {
    idguid: '55555555-6666-7777-8888-999999999999',
    title: 'Tribina: Digitalna transformacija u lokalnoj upravi',
    description: 'Panel sa IT stručnjacima.',
    cijena: '0.00',
    start_date: '2025-03-12T17:00:00',
    end_date: '2025-03-12T18:30:00',
    ima_vise_termina: false,
    termini: [],
    category: {
      idguid: '77aa66bb-55cc-44dd-33ee-22ff11aa0099',
      naziv: 'Tribina',
      boja: '#fef9c3',
      ikona: 'FaUsers',
    },
    lokacija: {
      naziv: 'Općinska sala',
      adresa: 'Trg Općine 1, Tešanj',
      latitude: 44.6105,
      longitude: 17.9841,
    },
    institucija: {
      idguid: '3333eeee-4444-5555-6666-7777aaaa9999',
      naziv: 'Općina Tešanj',
      logo: 'https://example.com/logos/opcina.png',
      email: 'info@tesanj.ba',
      web_stranica: 'https://tesanj.ba',
    },
    slika: 'abc555',
  },
  {
    idguid: '66666666-7777-8888-9999-000000000000',
    title: 'Zimski festival dječijeg teatra',
    description: 'Predstave za djecu kroz tri dana.',
    cijena: '5.00',
    start_date: '2024-12-20T17:00:00',
    end_date: '2024-12-22T19:00:00',
    ima_vise_termina: true,
    termini: [
      { start_date: '2024-12-20T17:00:00', end_date: '2024-12-20T18:00:00' },
      { start_date: '2024-12-21T17:00:00', end_date: '2024-12-21T18:00:00' },
      { start_date: '2024-12-22T18:00:00', end_date: '2024-12-22T19:00:00' },
    ],
    category: {
      idguid: '12ab12ab-34cd-56ef-78ab-90cd12ef34ab',
      naziv: 'Pozorište',
      boja: '#e3f8ef',
      ikona: 'FaTheaterMasks',
    },
    lokacija: {
      naziv: 'Dom kulture Tešanj',
      adresa: 'Ul. Kulturna 1, Tešanj',
      latitude: 44.61321,
      longitude: 17.98567,
    },
    institucija: {
      idguid: '0a1b2c3d-4e5f-6789-abcd-0123456789ab',
      naziv: 'JU Dom kulture Tešanj',
      logo: 'https://example.com/logos/dom-kulture.png',
      email: 'info@domkulture-tesanj.ba',
      web_stranica: 'https://domkulture-tesanj.ba',
    },
    slika: 'abc666',
  },
  {
    idguid: '77777777-8888-9999-0000-aaaaaaaaaaaa',
    title: 'Večer narodne muzike',
    description: 'Gostovanje KUD-ova iz regije.',
    cijena: '6.00',
    start_date: '2026-02-14T19:00:00',
    end_date: '2026-02-14T21:30:00',
    ima_vise_termina: false,
    termini: [],
    category: {
      idguid: 'f1a2b3c4-d5e6-4789-9abc-1234567890ab',
      naziv: 'Muzika',
      boja: '#eef2ff',
      ikona: 'FaMusic',
    },
    lokacija: {
      naziv: 'Sportska dvorana',
      adresa: 'Industrijska bb, Tešanj',
      latitude: 44.616,
      longitude: 17.98,
    },
    institucija: {
      idguid: '9999aaaa-bbbb-cccc-dddd-eeeeffff0000',
      naziv: 'JU Muzej i galerija Tešanj',
      logo: 'https://example.com/logos/muzej.png',
      email: 'muzej@tesanj.ba',
      web_stranica: 'https://muzej.tesanj.ba',
    },
    slika: 'abc777',
  },
  {
    idguid: '88888888-9999-0000-aaaa-bbbbbbbbbbbb',
    title: 'Sajam knjige i autorskih prava',
    description: 'Izdavači i promocije.',
    cijena: '0.00',
    start_date: '2025-04-02T10:00:00',
    end_date: '2025-04-05T20:00:00',
    ima_vise_termina: true,
    termini: [
      { start_date: '2025-04-02T10:00:00', end_date: '2025-04-02T18:00:00' },
      { start_date: '2025-04-03T10:00:00', end_date: '2025-04-03T18:00:00' },
      { start_date: '2025-04-04T10:00:00', end_date: '2025-04-04T18:00:00' },
      { start_date: '2025-04-05T10:00:00', end_date: '2025-04-05T20:00:00' },
    ],
    category: {
      idguid: 'abab107e-2a93-4cd5-aea7-b4ad2446b10e',
      naziv: 'Promocija knjige',
      boja: '#c3c2ff',
      ikona: 'FaBook',
    },
    lokacija: {
      naziv: 'Gradska biblioteka',
      adresa: 'Ul. Knjige 2, Tešanj',
      latitude: 44.6128,
      longitude: 17.9822,
    },
    institucija: {
      idguid: '12121212-3434-5656-7878-909090909090',
      naziv: 'Gradska biblioteka Tešanj',
      logo: 'https://example.com/logos/biblioteka.png',
      email: 'info@biblioteka.tesanj.ba',
      web_stranica: 'https://biblioteka.tesanj.ba',
    },
    slika: 'abc888',
  },
  {
    idguid: '99999999-0000-aaaa-bbbb-cccccccccccc',
    title: 'Humanitarni koncert za školu',
    description: 'Regionalni izvođači.',
    cijena: '10.00',
    start_date: '2025-01-22T19:00:00',
    end_date: '2025-01-22T21:00:00',
    ima_vise_termina: false,
    termini: [],
    category: {
      idguid: 'f1a2b3c4-d5e6-4789-9abc-1234567890ab',
      naziv: 'Muzika',
      boja: '#eef2ff',
      ikona: 'FaMusic',
    },
    lokacija: {
      naziv: 'Dom kulture Tešanj',
      adresa: 'Ul. Kulturna 1, Tešanj',
      latitude: 44.61321,
      longitude: 17.98567,
    },
    institucija: {
      idguid: '0a1b2c3d-4e5f-6789-abcd-0123456789ab',
      naziv: 'JU Dom kulture Tešanj',
      logo: 'https://example.com/logos/dom-kulture.png',
      email: 'info@domkulture-tesanj.ba',
      web_stranica: 'https://domkulture-tesanj.ba',
    },
    slika: 'abc999',
  },
  {
    idguid: 'aaaa1111-bbbb-2222-cccc-3333dddd4444',
    title: 'Regionalni sajam startupa',
    description: 'Pitch takmičenje i paneli.',
    cijena: '0.00',
    start_date: '2025-06-10T10:00:00',
    end_date: '2025-06-12T18:00:00',
    ima_vise_termina: true,
    termini: [
      { start_date: '2025-06-10T10:00:00', end_date: '2025-06-10T18:00:00' },
      { start_date: '2025-06-11T10:00:00', end_date: '2025-06-11T18:00:00' },
      { start_date: '2025-06-12T10:00:00', end_date: '2025-06-12T18:00:00' },
    ],
    category: {
      idguid: '77aa66bb-55cc-44dd-33ee-22ff11aa0099',
      naziv: 'Tribina',
      boja: '#fef9c3',
      ikona: 'FaUsers',
    },
    lokacija: {
      naziv: 'Općinska sala',
      adresa: 'Trg Općine 1, Tešanj',
      latitude: 44.6105,
      longitude: 17.9841,
    },
    institucija: {
      idguid: '3333eeee-4444-5555-6666-7777aaaa9999',
      naziv: 'Općina Tešanj',
      logo: 'https://example.com/logos/opcina.png',
      email: 'info@tesanj.ba',
      web_stranica: 'https://tesanj.ba',
    },
    slika: 'abcd0001',
  },
  {
    idguid: 'bbbb2222-cccc-3333-dddd-4444eeee5555',
    title: 'Jesenski jazz mini-fest',
    description: 'Trio i gosti.',
    cijena: '7.00',
    start_date: '2025-09-25T20:00:00',
    end_date: '2025-09-26T22:00:00',
    ima_vise_termina: true,
    termini: [
      { start_date: '2025-09-25T20:00:00', end_date: '2025-09-25T22:00:00' },
      { start_date: '2025-09-26T20:00:00', end_date: '2025-09-26T22:00:00' },
    ],
    category: {
      idguid: 'f1a2b3c4-d5e6-4789-9abc-1234567890ab',
      naziv: 'Muzika',
      boja: '#eef2ff',
      ikona: 'FaMusic',
    },
    lokacija: {
      naziv: 'Dom kulture Tešanj',
      adresa: 'Ul. Kulturna 1, Tešanj',
      latitude: 44.61321,
      longitude: 17.98567,
    },
    institucija: {
      idguid: '0a1b2c3d-4e5f-6789-abcd-0123456789ab',
      naziv: 'JU Dom kulture Tešanj',
      logo: 'https://example.com/logos/dom-kulture.png',
      email: 'info@domkulture-tesanj.ba',
      web_stranica: 'https://domkulture-tesanj.ba',
    },
    slika: 'abcd0002',
  },
  {
    idguid: 'cccc3333-dddd-4444-eeee-5555ffff6666',
    title: 'Dokumentarni film: Riječni čuvari',
    description: 'Projekcija i razgovor sa autorima.',
    cijena: '4.00',
    start_date: '2024-05-18T19:00:00',
    end_date: '2024-05-18T20:30:00',
    ima_vise_termina: false,
    termini: [],
    category: {
      idguid: 'c1a2b3c4-d5e6-4789-9abc-0987654321aa',
      naziv: 'Film',
      boja: '#f3cece',
      ikona: 'FaFilm',
    },
    lokacija: {
      naziv: 'Kino dvorana',
      adresa: 'Centar bb, Tešanj',
      latitude: 44.6125,
      longitude: 17.9815,
    },
    institucija: {
      idguid: 'b1b2c3d4-e5f6-789a-bcde-111122223333',
      naziv: 'Kino klub Tešanj',
      logo: 'https://example.com/logos/kino.png',
      email: 'kino@tesanj.ba',
      web_stranica: 'https://kino.tesanj.ba',
    },
    slika: 'abcd0003',
  },
];

// ————————————————————————————————————————————————————
// Helpers
// ————————————————————————————————————————————————————

const MONTHS_BA = [
  'Januar',
  'Februar',
  'Mart',
  'April',
  'Maj',
  'Juni',
  'Juli',
  'August',
  'Septembar',
  'Oktobar',
  'Novembar',
  'Decembar',
];

function toDate(d) {
  return d instanceof Date ? d : new Date(d);
}

function eventRange(e) {
  // Earliest start and latest end across main dates + termini
  const starts = [e.start_date, ...(e.termini || []).map((t) => t.start_date)]
    .filter(Boolean)
    .map(toDate);
  const ends = [e.end_date, ...(e.termini || []).map((t) => t.end_date)]
    .filter(Boolean)
    .map(toDate);
  const start = starts.length ? new Date(Math.min(...starts)) : undefined;
  const end = ends.length ? new Date(Math.max(...ends)) : undefined;
  return { start, end };
}

function groupCountBy(list, getKey) {
  const map = new Map();
  for (const item of list) {
    const k = getKey(item);
    map.set(k, (map.get(k) || 0) + 1);
  }
  return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
}

function groupActivePastBy(list, getKey, now = new Date()) {
  const map = new Map(); // key -> {Active, Past}
  for (const e of list) {
    const { end } = eventRange(e);
    const key = getKey(e);
    const bucket = map.get(key) || { name: key, Active: 0, Past: 0 };
    if (end && end < now) bucket.Past += 1;
    else bucket.Active += 1;
    map.set(key, bucket);
  }
  return Array.from(map.values());
}

function yearsFromEvents(list) {
  const s = new Set();
  for (const e of list) {
    s.add(toDate(e.start_date).getFullYear());
    for (const t of e.termini || []) s.add(toDate(t.start_date).getFullYear());
  }
  return Array.from(s).sort((a, b) => a - b);
}

function monthlyCounts(list, year) {
  const months = Array.from({ length: 12 }, (_, i) => ({ month: MONTHS_BA[i], count: 0 }));

  for (const e of list) {
    if (e.ima_vise_termina && e.termini && e.termini.length) {
      for (const t of e.termini) {
        const d = toDate(t.start_date);
        if (d.getFullYear() === year) months[d.getMonth()].count += 1;
      }
    } else {
      const d = toDate(e.start_date);
      if (d.getFullYear() === year) months[d.getMonth()].count += 1;
    }
  }
  return months;
}

// ————————————————————————————————————————————————————
// Component
// ————————————————————————————————————————————————————

export default function Dashboard({ events = DUMMY_EVENTS }) {
  const now = useMemo(() => new Date(), []);

  // —— Filters state ——
  const [query, setQuery] = useState('');
  const [insFilter, setInsFilter] = useState('ALL');
  const [catFilter, setCatFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Options
  const institutions = useMemo(
    () => Array.from(new Set(events.map((e) => e.institucija?.naziv).filter(Boolean))).sort(),
    [events]
  );
  const categories = useMemo(
    () => Array.from(new Set(events.map((e) => e.category?.naziv).filter(Boolean))).sort(),
    [events]
  );

  // Year selector options
  const yearOptions = useMemo(() => yearsFromEvents(events), [events]);
  const [year, setYear] = useState(() =>
    yearOptions.includes(new Date().getFullYear())
      ? new Date().getFullYear()
      : yearOptions[yearOptions.length - 1] || new Date().getFullYear()
  );

  // Apply filters
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const titleMatch = !query || (e.title || '').toLowerCase().includes(query.toLowerCase());
      const insMatch = insFilter === 'ALL' || e.institucija?.naziv === insFilter;
      const catMatch = catFilter === 'ALL' || e.category?.naziv === catFilter;

      const { start, end } = eventRange(e);
      const isPast = end ? end < now : false;
      const statusMatch = statusFilter === 'ALL' || (statusFilter === 'ACTIVE' ? !isPast : isPast);

      const from = dateFrom ? new Date(dateFrom) : null;
      const to = dateTo ? new Date(dateTo + 'T23:59:59') : null;
      const inRange = (!from || (start && end && end >= from)) && (!to || (start && start <= to));

      return titleMatch && insMatch && catMatch && statusMatch && inRange;
    });
  }, [events, query, insFilter, catFilter, statusFilter, dateFrom, dateTo, now]);

  const source = filteredEvents;

  // Export helpers (backend url + CSV fallback)
  const BACKEND_EXPORT_URL = '/api/events/export-excel'; // replace when wiring backend
  const getCurrentFilters = () => ({
    query,
    institution: insFilter,
    category: catFilter,
    status: statusFilter,
    date_from: dateFrom,
    date_to: dateTo,
    year,
  });
  const buildExportUrl = (base, params) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v && v !== 'ALL') q.append(k, v);
    });
    return `${base}?${q.toString()}`;
  };
  const downloadCSV = (rows, filename = 'events-export.csv') => {
    const headers = [
      'id',
      'title',
      'category',
      'institution',
      'start_date',
      'end_date',
      'price',
      'status',
    ];
    const lines = [headers.join(',')];
    rows.forEach((e) => {
      const { end } = eventRange(e);
      const status = end && end < now ? 'past' : 'active';
      const vals = [
        e.idguid,
        e.title || '',
        e.category?.naziv || '',
        e.institucija?.naziv || '',
        e.start_date || '',
        e.end_date || '',
        e.cijena || '',
        status,
      ];
      lines.push(vals.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','));
    });
    const blob = new Blob([lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleExport = () => {
    const url = buildExportUrl(BACKEND_EXPORT_URL, getCurrentFilters());
    console.log('Export URL:', url);
    downloadCSV(source);
  };

  // Metrics from filtered source
  const total = source.length;
  const pastCount = useMemo(
    () => source.filter((e) => (eventRange(e).end || now) < now).length,
    [source, now]
  );
  const activeCount = total - pastCount;
  const instCount = useMemo(
    () => new Set(source.map((e) => e.institucija?.naziv).filter(Boolean)).size,
    [source]
  );
  const catCount = useMemo(
    () => new Set(source.map((e) => e.category?.naziv).filter(Boolean)).size,
    [source]
  );

  const byInstitution = useMemo(
    () => groupCountBy(source, (e) => e.institucija?.naziv || 'Nepoznato'),
    [source]
  );
  const byCategory = useMemo(
    () => groupCountBy(source, (e) => e.category?.naziv || 'Bez kategorije'),
    [source]
  );
  const activePastByInstitution = useMemo(
    () => groupActivePastBy(source, (e) => e.institucija?.naziv || 'Nepoznato', now),
    [source, now]
  );
  const activePastByCategory = useMemo(
    () => groupActivePastBy(source, (e) => e.category?.naziv || 'Bez kategorije', now),
    [source, now]
  );
  const monthly = useMemo(() => monthlyCounts(source, year), [source, year]);

  return (
    <Page>
      <TitleRow>
        <Heading as="h1">Dashboard</Heading>
      </TitleRow>

      <FilterBar>
        <Field style={{ gridColumn: 'span 3' }}>
          <label>Pretraga (naslov)</label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="npr. koncert, film..."
          />
        </Field>
        <Field>
          <label>Institucija</label>
          <select value={insFilter} onChange={(e) => setInsFilter(e.target.value)}>
            <option value="ALL">Sve</option>
            {institutions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </Field>
        <Field>
          <label>Kategorija</label>
          <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
            <option value="ALL">Sve</option>
            {categories.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </Field>
        <Field>
          <label>Status</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">Svi</option>
            <option value="ACTIVE">Aktivni</option>
            <option value="PAST">Prošli</option>
          </select>
        </Field>
        <Field>
          <label>Od datuma</label>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </Field>
        <Field>
          <label>Do datuma</label>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </Field>
        <Field>
          <label>Godina (za mjesece)</label>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </Field>
        <Actions>
          <Btn
            data-variant="ghost"
            onClick={() => {
              setQuery('');
              setInsFilter('ALL');
              setCatFilter('ALL');
              setStatusFilter('ALL');
              setDateFrom('');
              setDateTo('');
            }}
          >
            Reset
          </Btn>
          <Btn onClick={handleExport}>
            <Fa.FaFileExport style={{ marginRight: '.4rem' }} /> Export u Excel
          </Btn>
        </Actions>
      </FilterBar>

      <KPIRow>
        <KPICard>
          <KPIGroup>
            <KPILabel>Ukupno događaja</KPILabel>
            <KPIValue>{total}</KPIValue>
            <KPISub>prema filterima</KPISub>
          </KPIGroup>
          <KPIIconBubble>
            <Fa.FaCalendarAlt size={24} />
          </KPIIconBubble>
        </KPICard>

        <KPICard>
          <KPIGroup>
            <KPILabel>Aktivnih (nadolazećih + tekućih)</KPILabel>
            <KPIValue>{activeCount}</KPIValue>
            <KPISub>ne uključuje prošle</KPISub>
          </KPIGroup>
          <KPIIconBubble>
            <Fa.FaPlayCircle size={24} />
          </KPIIconBubble>
        </KPICard>

        <KPICard>
          <KPIGroup>
            <KPILabel>Prošlih</KPILabel>
            <KPIValue>{pastCount}</KPIValue>
            <KPISub>završeni događaji</KPISub>
          </KPIGroup>
          <KPIIconBubble>
            <Fa.FaHistory size={24} />
          </KPIIconBubble>
        </KPICard>

        <KPICard>
          <KPIGroup>
            <KPILabel>Institucija / Kategorija</KPILabel>
            <KPIValue>
              {instCount} / {catCount}
            </KPIValue>
            <KPISub>različitih vrijednosti</KPISub>
          </KPIGroup>
          <KPIIconBubble>
            <Fa.FaUniversity size={24} />
          </KPIIconBubble>
        </KPICard>
      </KPIRow>

      <Grid>
        <Card style={{ gridColumn: 'span 12' }}>
          <CardTitle>Broj događaja po mjesecima ({year})</CardTitle>
          <ChartLine data={monthly} dataKeyA="count" labelA="Događaji" xKey="month" />
        </Card>
        <Card style={{ gridColumn: 'span 6' }}>
          <CardTitle>Ukupno događaja po instituciji</CardTitle>
          <ChartBar data={byInstitution} dataKeyA="count" labelA="Događaji" />
        </Card>

        <Card style={{ gridColumn: 'span 6' }}>
          <CardTitle>Ukupno događaja po kategoriji</CardTitle>
          <ChartBar data={byCategory} dataKeyA="count" labelA="Događaji" />
        </Card>

        <Card style={{ gridColumn: 'span 6' }}>
          <CardTitle>Aktivni vs. Prošli po instituciji</CardTitle>
          <ChartStacked
            data={activePastByInstitution}
            dataKeyA="Active"
            dataKeyB="Past"
            labelA="Aktivni"
            labelB="Prošli"
          />
        </Card>

        <Card style={{ gridColumn: 'span 6' }}>
          <CardTitle>Aktivni vs. Prošli po kategoriji</CardTitle>
          <ChartStacked
            data={activePastByCategory}
            dataKeyA="Active"
            dataKeyB="Past"
            labelA="Aktivni"
            labelB="Prošli"
          />
        </Card>
      </Grid>
    </Page>
  );
}

// ————————————————————————————————————————————————————
// Small chart wrappers (consistent styling)
// ————————————————————————————————————————————————————

function ChartBar({ data, dataKeyA, labelA }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" interval={0} angle={-10} textAnchor="end" height={60} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey={dataKeyA} name={labelA} fill={BRAND} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function ChartStacked({ data, dataKeyA, dataKeyB, labelA, labelB }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" interval={0} angle={-10} textAnchor="end" height={60} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey={dataKeyA} name={labelA} stackId="a" fill={BRAND} radius={[6, 6, 0, 0]} />
        <Bar dataKey={dataKeyB} name={labelB} stackId="a" fill="#d1d5db" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function ChartLine({ data, dataKeyA, labelA, xKey = 'name' }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey={dataKeyA}
          name={labelA}
          stroke={BRAND}
          strokeWidth={2.5}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ————————————————————————————————————————————————————
// Usage notes
// ————————————————————————————————————————————————————
/**
 * Install deps:
 *   npm i recharts styled-components
 *
 * Use:
 *   import EventsStatsDashboard from "./EventsStatsDashboard";
 *   <EventsStatsDashboard events={yourEventsArray} />
 *
 * Data assumptions:
 *   - "active" = svi događaji kojima najkasniji datum završetka (event.end_date ili neki termin.end_date) NIJE u prošlosti
 *   - "past" = najkasniji datum završetka < danas
 *   - mjesečni grafikon broji svaki termin kao poseban prikaz u mjesecu izvođenja
 */
