// import React, { useMemo, useState } from 'react';
// import styled from 'styled-components';
// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   LineChart,
//   Line,
// } from 'recharts';
// import * as Fa from 'react-icons/fa';
// import * as XLSX from 'xlsx';
// import Heading from './Heading';

// /**
//  * EventsStatsDashboard
//  * -------------------------------------------------------
//  * • JSX + styled-components
//  * • Charts rendered with recharts (npm i recharts styled-components)
//  * • Uses dummy data shaped like your API; pass `events` prop to override
//  * • Shows:
//  *    - Total events by institution
//  *    - Total events by category
//  *    - Active vs Past by institution
//  *    - Active vs Past by category
//  *    - Events per month (year selector)
//  */

// // —— Brand palette (adjust as needed) ——
// const BRAND = '#f97316'; // primary
// const SURFACE = '#ffffff';
// const INK = '#0f172a';
// const MUTED = '#64748b';

// // —— Layout ——
// const Page = styled.div`
//   --brand: ${BRAND};
//   --surface: ${SURFACE};
//   --ink: ${INK};
//   --muted: ${MUTED};

//   padding: 1rem 0;
//   color: var(--ink);
//   min-height: 100vh;
//   display: flex;
//   flex-direction: column;
//   gap: 1.5rem;
// `;

// const TitleRow = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   gap: 1rem;
// `;

// const H1 = styled.h1`
//   margin: 0;
//   font-size: 1.75rem;
//   font-weight: 800;
//   letter-spacing: 0.2px;
// `;

// const Filters = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 0.75rem;

//   select {
//     padding: 0.5rem 0.75rem;
//     border-radius: 0.75rem;
//     border: 1px solid #e2e8f0;
//     background: var(--surface);
//     color: var(--ink);
//   }
// `;

// const Grid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(12, 1fr);
//   gap: 1rem;
// `;

// const Card = styled.div`
//   background: var(--surface);
//   border: 1px solid #e2e8f0;
//   border-radius: 1rem;
//   padding: 1rem;
//   box-shadow: 0 10px 24px rgba(2, 6, 23, 0.06);
// `;

// const CardTitle = styled.h2`
//   font-size: 1rem;
//   font-weight: 700;
//   margin: 0 0 0.5rem 0;
//   color: var(--muted);
// `;

// // —— Filter bar ——
// const FilterBar = styled(Card)`
//   display: grid;
//   grid-template-columns: repeat(12, minmax(0, 1fr));
//   gap: 0.75rem;
//   align-items: end;
// `;
// const Field = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 0.25rem;
//   grid-column: span 3;
//   label {
//     font-size: 0.8rem;
//     color: var(--muted);
//   }
//   input,
//   select {
//     padding: 0.55rem 0.75rem;
//     border-radius: 0.75rem;
//     border: 1px solid #e2e8f0;
//     background: var(--surface);
//     color: var(--ink);
//     outline: none;
//   }
// `;
// const Actions = styled.div`
//   grid-column: span 3;
//   display: flex;
//   gap: 0.5rem;
//   justify-content: flex-end;
// `;
// const Btn = styled.button`
//   padding: 0.6rem 0.9rem;
//   border-radius: 0.75rem;
//   border: 1px solid transparent;
//   font-weight: 700;
//   cursor: pointer;
//   background: ${BRAND};
//   color: #fff;
//   transition:
//     transform 0.15s ease,
//     box-shadow 0.15s ease;
//   box-shadow: 0 10px 18px rgba(249, 115, 22, 0.25);
//   &:hover {
//     transform: translateY(-1px);
//   }
//   &[data-variant='ghost'] {
//     background: #fff;
//     color: var(--ink);
//     border-color: #e2e8f0;
//     box-shadow: none;
//   }
// `;

// // —— KPI Cards ——
// const KPIRow = styled.div`
//   display: grid;
//   grid-template-columns: repeat(4, 1fr);
//   gap: 1rem;
// `;
// const KPICard = styled(Card)`
//   position: relative;
//   overflow: hidden;
//   background: linear-gradient(135deg, #fff 0%, #fff 60%, rgba(249, 115, 22, 0.06) 100%);
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   min-height: 112px;
// `;
// const KPIGroup = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 0.35rem;
// `;
// const KPILabel = styled.span`
//   color: var(--muted);
//   font-weight: 700;
// `;
// const KPIValue = styled.span`
//   font-size: 2rem;
//   line-height: 1;
//   font-weight: 900;
// `;
// const KPISub = styled.span`
//   font-size: 0.8rem;
//   color: var(--muted);
// `;
// const KPIIconBubble = styled.div`
//   width: 56px;
//   height: 56px;
//   display: grid;
//   place-items: center;
//   border-radius: 50%;
//   background: rgba(249, 115, 22, 0.15);
//   color: var(--brand);
// `;

// const StatRow = styled.div`
//   display: grid;
//   grid-template-columns: repeat(4, 1fr);
//   gap: 1rem;
// `;

// const Stat = styled(Card)`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
// `;

// const StatLabel = styled.span`
//   color: var(--muted);
//   font-weight: 600;
// `;

// const StatValue = styled.span`
//   font-size: 1.75rem;
//   font-weight: 800;
//   color: var(--ink);
// `;

// // ————————————————————————————————————————————————————
// // Helpers
// // ————————————————————————————————————————————————————

// const MONTHS_BA = [
//   'Januar',
//   'Februar',
//   'Mart',
//   'April',
//   'Maj',
//   'Juni',
//   'Juli',
//   'August',
//   'Septembar',
//   'Oktobar',
//   'Novembar',
//   'Decembar',
// ];

// function toDate(d) {
//   return d instanceof Date ? d : new Date(d);
// }

// function eventRange(e) {
//   // Earliest start and latest end across main dates + termini
//   const starts = [e.start_date, ...(e.termini || []).map((t) => t.start_date)]
//     .filter(Boolean)
//     .map(toDate);
//   const ends = [e.end_date, ...(e.termini || []).map((t) => t.end_date)]
//     .filter(Boolean)
//     .map(toDate);
//   const start = starts.length ? new Date(Math.min(...starts)) : undefined;
//   const end = ends.length ? new Date(Math.max(...ends)) : undefined;
//   return { start, end };
// }

// function groupCountBy(list, getKey) {
//   const map = new Map();
//   for (const item of list) {
//     const k = getKey(item);
//     map.set(k, (map.get(k) || 0) + 1);
//   }
//   return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
// }

// function groupActivePastBy(list, getKey, now = new Date()) {
//   const map = new Map(); // key -> {Active, Past}
//   for (const e of list) {
//     const { end } = eventRange(e);
//     const key = getKey(e);
//     const bucket = map.get(key) || { name: key, Active: 0, Past: 0 };
//     if (end && end < now) bucket.Past += 1;
//     else bucket.Active += 1;
//     map.set(key, bucket);
//   }
//   return Array.from(map.values());
// }

// function yearsFromEvents(list) {
//   const s = new Set();
//   for (const e of list) {
//     s.add(toDate(e.start_date).getFullYear());
//     for (const t of e.termini || []) s.add(toDate(t.start_date).getFullYear());
//   }
//   return Array.from(s).sort((a, b) => a - b);
// }

// function monthlyCounts(list, year, mode = 'events') {
//   const months = Array.from({ length: 12 }, (_, i) => ({ month: MONTHS_BA[i], count: 0 }));

//   for (const e of list) {
//     const hasTerms = !!(e.ima_vise_termina && e.termini && e.termini.length);

//     if (mode === 'termini' && hasTerms) {
//       // Broji svaki termin zasebno
//       for (const t of e.termini) {
//         const d = toDate(t.start_date);
//         if (d.getFullYear() === year) months[d.getMonth()].count += 1;
//       }
//       // Ako ima termine, ne brojimo osnovni start_date posebno (da izbjegnemo duplo računanje)
//     } else {
//       // "Događaji" režim — brojimo događaj jednom u prvom mjesecu u kojem se pojavljuje u toj godini
//       const candidates = [e.start_date, ...(e.termini || []).map((t) => t.start_date)]
//         .filter(Boolean)
//         .map(toDate)
//         .filter((d) => d.getFullYear() === year)
//         .sort((a, b) => a - b);

//       if (candidates.length) {
//         const m = candidates[0].getMonth();
//         months[m].count += 1;
//       }
//     }
//   }
//   return months;
// }

// // ————————————————————————————————————————————————————
// // Component
// // ————————————————————————————————————————————————————

// export default function EventsStatsDashboard({ events = [] }) {
//   const now = useMemo(() => new Date(), []);

//   // —— Filters state ——
//   const [query, setQuery] = useState('');
//   const [insFilter, setInsFilter] = useState('ALL');
//   const [catFilter, setCatFilter] = useState('ALL');
//   const [statusFilter, setStatusFilter] = useState('ALL');
//   const [dateFrom, setDateFrom] = useState('');
//   const [dateTo, setDateTo] = useState('');
//   const [exportFormat, setExportFormat] = useState('xlsx');
//   const [monthMode, setMonthMode] = useState('events');

//   // Options
//   const institutions = useMemo(
//     () => Array.from(new Set(events.map((e) => e.institucija?.naziv).filter(Boolean))).sort(),
//     [events]
//   );
//   const categories = useMemo(
//     () => Array.from(new Set(events.map((e) => e.category?.naziv).filter(Boolean))).sort(),
//     [events]
//   );

//   // Year selector options
//   const yearOptions = useMemo(() => yearsFromEvents(events), [events]);
//   const [year, setYear] = useState(() =>
//     yearOptions.includes(new Date().getFullYear())
//       ? new Date().getFullYear()
//       : yearOptions[yearOptions.length - 1] || new Date().getFullYear()
//   );

//   // Apply filters
//   const filteredEvents = useMemo(() => {
//     return events.filter((e) => {
//       const titleMatch = !query || (e.title || '').toLowerCase().includes(query.toLowerCase());
//       const insMatch = insFilter === 'ALL' || e.institucija?.naziv === insFilter;
//       const catMatch = catFilter === 'ALL' || e.category?.naziv === catFilter;

//       const { start, end } = eventRange(e);
//       const isPast = end ? end < now : false;
//       const statusMatch = statusFilter === 'ALL' || (statusFilter === 'ACTIVE' ? !isPast : isPast);

//       const from = dateFrom ? new Date(dateFrom) : null;
//       const to = dateTo ? new Date(dateTo + 'T23:59:59') : null;
//       const inRange = (!from || (start && end && end >= from)) && (!to || (start && start <= to));

//       return titleMatch && insMatch && catMatch && statusMatch && inRange;
//     });
//   }, [events, query, insFilter, catFilter, statusFilter, dateFrom, dateTo, now]);

//   const source = filteredEvents;

//   // Export helpers (backend url + Excel export)
//   const BACKEND_EXPORT_URL = '/api/events/export-excel'; // replace when wiring backend
//   const getCurrentFilters = () => ({
//     query,
//     institution: insFilter,
//     category: catFilter,
//     status: statusFilter,
//     date_from: dateFrom,
//     date_to: dateTo,
//     year,
//   });
//   const buildExportUrl = (base, params) => {
//     const q = new URLSearchParams();
//     Object.entries(params).forEach(([k, v]) => {
//       if (v && v !== 'ALL') q.append(k, v);
//     });
//     return `${base}?${q.toString()}`;
//   };
//   const exportToExcel = (rows, fmt = exportFormat) => {
//     const data = rows.map((e) => {
//       const { end } = eventRange(e);
//       const status = end && end < now ? 'past' : 'active';
//       return {
//         ID: e.idguid,
//         Naslov: e.title || '',
//         Kategorija: e.category?.naziv || '',
//         Institucija: e.institucija?.naziv || '',
//         Pocetak: e.start_date || '',
//         Kraj: e.end_date || '',
//         Cijena: e.cijena || '',
//         Status: status,
//       };
//     });
//     const wb = XLSX.utils.book_new();
//     const ws = XLSX.utils.json_to_sheet(data);
//     XLSX.utils.book_append_sheet(wb, ws, 'Događaji');
//     const ext = fmt === 'xls' ? 'xls' : 'xlsx';
//     XLSX.writeFile(wb, `events-export.${ext}`, { bookType: ext });
//   };
//   const handleExport = () => {
//     const url = buildExportUrl(BACKEND_EXPORT_URL, getCurrentFilters());
//     console.log('Export URL:', url);
//     exportToExcel(source, exportFormat);
//   };

//   // Metrics from filtered source
//   const total = source.length;
//   const pastCount = useMemo(
//     () => source.filter((e) => (eventRange(e).end || now) < now).length,
//     [source, now]
//   );
//   const activeCount = total - pastCount;
//   const instCount = useMemo(
//     () => new Set(source.map((e) => e.institucija?.naziv).filter(Boolean)).size,
//     [source]
//   );
//   const catCount = useMemo(
//     () => new Set(source.map((e) => e.category?.naziv).filter(Boolean)).size,
//     [source]
//   );

//   const byInstitution = useMemo(
//     () => groupCountBy(source, (e) => e.institucija?.naziv || 'Nepoznato'),
//     [source]
//   );
//   const byCategory = useMemo(
//     () => groupCountBy(source, (e) => e.category?.naziv || 'Bez kategorije'),
//     [source]
//   );
//   const activePastByInstitution = useMemo(
//     () => groupActivePastBy(source, (e) => e.institucija?.naziv || 'Nepoznato', now),
//     [source, now]
//   );
//   const activePastByCategory = useMemo(
//     () => groupActivePastBy(source, (e) => e.category?.naziv || 'Bez kategorije', now),
//     [source, now]
//   );
//   const monthly = useMemo(() => monthlyCounts(source, year, monthMode), [source, year, monthMode]);

//   return (
//     <Page>
//       <TitleRow>
//         <Heading as="h1">Dashboard</Heading>
//       </TitleRow>

//       <FilterBar>
//         {/* <Field style={{ gridColumn: 'span 3' }}>
//           <label>Pretraga (naslov)</label>
//           <input
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="npr. koncert, film..."
//           />
//         </Field> */}
//         <Field>
//           <label>Institucija</label>
//           <select value={insFilter} onChange={(e) => setInsFilter(e.target.value)}>
//             <option value="ALL">Sve</option>
//             {institutions.map((n) => (
//               <option key={n} value={n}>
//                 {n}
//               </option>
//             ))}
//           </select>
//         </Field>
//         <Field>
//           <label>Kategorija</label>
//           <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
//             <option value="ALL">Sve</option>
//             {categories.map((n) => (
//               <option key={n} value={n}>
//                 {n}
//               </option>
//             ))}
//           </select>
//         </Field>
//         <Field>
//           <label>Status</label>
//           <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
//             <option value="ALL">Svi</option>
//             <option value="ACTIVE">Aktivni</option>
//             <option value="PAST">Prošli</option>
//           </select>
//         </Field>
//         <Field>
//           <label>Godina (za mjesece)</label>
//           <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
//             {yearOptions.map((y) => (
//               <option key={y} value={y}>
//                 {y}
//               </option>
//             ))}
//           </select>
//         </Field>
//         <Field>
//           <label>Od datuma</label>
//           <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
//         </Field>
//         <Field>
//           <label>Do datuma</label>
//           <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
//         </Field>
//         <Field>
//           <label>Brojanje</label>
//           <select value={monthMode} onChange={(e) => setMonthMode(e.target.value)}>
//             <option value="events">Događaji</option>
//             <option value="termini">Termini</option>
//           </select>
//         </Field>
//         <Actions>
//           <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value)}>
//             <option value="xlsx">.xlsx</option>
//             <option value="xls">.xls</option>
//           </select>
//           <Btn
//             data-variant="ghost"
//             onClick={() => {
//               setQuery('');
//               setInsFilter('ALL');
//               setCatFilter('ALL');
//               setStatusFilter('ALL');
//               setDateFrom('');
//               setDateTo('');
//             }}
//           >
//             Reset
//           </Btn>
//           <Btn onClick={handleExport}>
//             <Fa.FaFileExport style={{ marginRight: '.4rem' }} /> Export
//           </Btn>
//         </Actions>
//       </FilterBar>

//       <KPIRow>
//         <KPICard>
//           <KPIGroup>
//             <KPILabel>Ukupno događaja</KPILabel>
//             <KPIValue>{total}</KPIValue>
//             <KPISub>prema filterima</KPISub>
//           </KPIGroup>
//           <KPIIconBubble>
//             <Fa.FaCalendarAlt size={24} />
//           </KPIIconBubble>
//         </KPICard>

//         <KPICard>
//           <KPIGroup>
//             <KPILabel>Aktivnih (nadolazećih + tekućih)</KPILabel>
//             <KPIValue>{activeCount}</KPIValue>
//             <KPISub>ne uključuje prošle</KPISub>
//           </KPIGroup>
//           <KPIIconBubble>
//             <Fa.FaPlayCircle size={24} />
//           </KPIIconBubble>
//         </KPICard>

//         <KPICard>
//           <KPIGroup>
//             <KPILabel>Prošlih</KPILabel>
//             <KPIValue>{pastCount}</KPIValue>
//             <KPISub>završeni događaji</KPISub>
//           </KPIGroup>
//           <KPIIconBubble>
//             <Fa.FaHistory size={24} />
//           </KPIIconBubble>
//         </KPICard>

//         <KPICard>
//           <KPIGroup>
//             <KPILabel>Institucija / Kategorija</KPILabel>
//             <KPIValue>
//               {instCount} / {catCount}
//             </KPIValue>
//             <KPISub>različitih vrijednosti</KPISub>
//           </KPIGroup>
//           <KPIIconBubble>
//             <Fa.FaUniversity size={24} />
//           </KPIIconBubble>
//         </KPICard>
//       </KPIRow>

//       <Grid>
//         <Card style={{ gridColumn: 'span 12' }}>
//           <CardTitle>
//             Broj {monthMode === 'termini' ? 'termina' : 'događaja'} po mjesecima ({year})
//           </CardTitle>
//           <ChartLine data={monthly} dataKeyA="count" labelA="Događaji" xKey="month" />
//         </Card>
//         <Card style={{ gridColumn: 'span 12' }}>
//           <CardTitle>Ukupno događaja po instituciji</CardTitle>
//           <ChartBar data={byInstitution} dataKeyA="count" labelA="Događaji" />
//         </Card>

//         <Card style={{ gridColumn: 'span 12' }}>
//           <CardTitle>Ukupno događaja po kategoriji</CardTitle>
//           <ChartBar data={byCategory} dataKeyA="count" labelA="Događaji" />
//         </Card>

//         <Card style={{ gridColumn: 'span 12' }}>
//           <CardTitle>Aktivni vs. Prošli po instituciji</CardTitle>
//           <ChartStacked
//             data={activePastByInstitution}
//             dataKeyA="Active"
//             dataKeyB="Past"
//             labelA="Aktivni"
//             labelB="Prošli"
//           />
//         </Card>

//         <Card style={{ gridColumn: 'span 12' }}>
//           <CardTitle>Aktivni vs. Prošli po kategoriji</CardTitle>
//           <ChartStacked
//             data={activePastByCategory}
//             dataKeyA="Active"
//             dataKeyB="Past"
//             labelA="Aktivni"
//             labelB="Prošli"
//           />
//         </Card>
//       </Grid>
//     </Page>
//   );
// }

// // ————————————————————————————————————————————————————
// // Small chart wrappers (consistent styling)
// // ————————————————————————————————————————————————————

// function ChartBar({ data, dataKeyA, labelA }) {
//   return (
//     <ResponsiveContainer width="100%" height={320}>
//       <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="name" interval={0} angle={-10} textAnchor="end" height={60} />
//         <YAxis allowDecimals={false} />
//         <Tooltip />
//         <Legend />
//         <Bar dataKey={dataKeyA} name={labelA} fill={BRAND} radius={[6, 6, 0, 0]} />
//       </BarChart>
//     </ResponsiveContainer>
//   );
// }

// function ChartStacked({ data, dataKeyA, dataKeyB, labelA, labelB }) {
//   return (
//     <ResponsiveContainer width="100%" height={320}>
//       <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="name" interval={0} angle={-10} textAnchor="end" height={60} />
//         <YAxis allowDecimals={false} />
//         <Tooltip />
//         <Legend />
//         <Bar dataKey={dataKeyA} name={labelA} stackId="a" fill={BRAND} radius={[6, 6, 0, 0]} />
//         <Bar dataKey={dataKeyB} name={labelB} stackId="a" fill="#d1d5db" radius={[6, 6, 0, 0]} />
//       </BarChart>
//     </ResponsiveContainer>
//   );
// }

// function ChartLine({ data, dataKeyA, labelA, xKey = 'name' }) {
//   return (
//     <ResponsiveContainer width="100%" height={320}>
//       <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey={xKey} />
//         <YAxis allowDecimals={false} />
//         <Tooltip />
//         <Legend />
//         <Line
//           type="monotone"
//           dataKey={dataKeyA}
//           name={labelA}
//           stroke={BRAND}
//           strokeWidth={2.5}
//           dot={{ r: 4 }}
//         />
//       </LineChart>
//     </ResponsiveContainer>
//   );
// }

// // ————————————————————————————————————————————————————
// // Usage notes
// // ————————————————————————————————————————————————————
// /**
//  * Install deps:
//  *   npm i recharts styled-components
//  *
//  * Use:
//  *   import EventsStatsDashboard from "./EventsStatsDashboard";
//  *   <EventsStatsDashboard events={yourEventsArray} />
//  *
//  * Data assumptions:
//  *   - "active" = svi događaji kojima najkasniji datum završetka (event.end_date ili neki termin.end_date) NIJE u prošlosti
//  *   - "past" = najkasniji datum završetka < danas
//  *   - mjesečni grafikon broji svaki termin kao poseban prikaz u mjesecu izvođenja
//  */
import React, { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import Heading from './Heading';
import { FaFileExport, FaCalendarAlt, FaPlayCircle, FaHistory, FaUniversity } from 'react-icons/fa';

/**
 * EventsStatsDashboard (optimised)
 * - XLSX se učitava on-demand (dinamički import)
 * - Recharts se učitava dinamički unutar svake Chart* komponente
 * - Ikone se uvoze selektivno (bez wildcarda)
 */

// —— Brand palette —— //
const BRAND = '#f97316';
const SURFACE = '#ffffff';
const INK = '#0f172a';
const MUTED = '#64748b';

// —— Layout —— //
const Page = styled.div`
  --brand: ${BRAND};
  --surface: ${SURFACE};
  --ink: ${INK};
  --muted: ${MUTED};

  padding: 1rem 0;
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

// —— Filter bar —— //
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

// —— KPI Cards —— //
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

function monthlyCounts(list, year, mode = 'events') {
  const months = Array.from({ length: 12 }, (_, i) => ({ month: MONTHS_BA[i], count: 0 }));
  for (const e of list) {
    const hasTerms = !!(e.ima_vise_termina && e.termini && e.termini.length);

    if (mode === 'termini' && hasTerms) {
      for (const t of e.termini) {
        const d = toDate(t.start_date);
        if (d.getFullYear() === year) months[d.getMonth()].count += 1;
      }
    } else {
      const candidates = [e.start_date, ...(e.termini || []).map((t) => t.start_date)]
        .filter(Boolean)
        .map(toDate)
        .filter((d) => d.getFullYear() === year)
        .sort((a, b) => a - b);
      if (candidates.length) months[candidates[0].getMonth()].count += 1;
    }
  }
  return months;
}

// ————————————————————————————————————————————————————
// Dinamičko učitavanje Recharts (unutar mini-hooka)
// ————————————————————————————————————————————————————
function useRecharts() {
  const [R, setR] = useState(null);
  useEffect(() => {
    let mounted = true;
    import('recharts').then((mod) => {
      if (mounted) setR(mod);
    });
    return () => {
      mounted = false;
    };
  }, []);
  return R;
}

// ————————————————————————————————————————————————————
// Component
// ————————————————————————————————————————————————————
export default function EventsStatsDashboard({ events = [] }) {
  const now = useMemo(() => new Date(), []);

  // —— Filters state —— //
  const [query, setQuery] = useState('');
  const [insFilter, setInsFilter] = useState('ALL');
  const [catFilter, setCatFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [exportFormat, setExportFormat] = useState('xlsx');
  const [monthMode, setMonthMode] = useState('events');

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

  // Export helpers – XLSX on-demand
  const BACKEND_EXPORT_URL = '/api/events/export-excel'; // zamijeni po potrebi
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

  const exportToExcel = async (rows, fmt = exportFormat) => {
    const XLSX = await import('xlsx'); // <— on-demand
    const data = rows.map((e) => {
      const { end } = eventRange(e);
      const status = end && end < now ? 'past' : 'active';
      return {
        ID: e.idguid,
        Naslov: e.title || '',
        Kategorija: e.category?.naziv || '',
        Institucija: e.institucija?.naziv || '',
        Pocetak: e.start_date || '',
        Kraj: e.end_date || '',
        Cijena: e.cijena || '',
        Status: status,
      };
    });
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Događaji');
    const ext = fmt === 'xls' ? 'xls' : 'xlsx';
    XLSX.writeFile(wb, `events-export.${ext}`, { bookType: ext });
  };

  const handleExport = async () => {
    const url = buildExportUrl(BACKEND_EXPORT_URL, getCurrentFilters());
    console.log('Export URL:', url);
    await exportToExcel(source, exportFormat);
  };

  // Metrics
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
  const monthly = useMemo(() => monthlyCounts(source, year, monthMode), [source, year, monthMode]);

  return (
    <Page>
      <TitleRow>
        <Heading as="h1">Dashboard</Heading>
      </TitleRow>

      <FilterBar>
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
          <label>Godina (za mjesece)</label>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
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
          <label>Brojanje</label>
          <select value={monthMode} onChange={(e) => setMonthMode(e.target.value)}>
            <option value="events">Događaji</option>
            <option value="termini">Termini</option>
          </select>
        </Field>
        <Actions>
          <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value)}>
            <option value="xlsx">.xlsx</option>
            <option value="xls">.xls</option>
          </select>
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
            <FaFileExport style={{ marginRight: '.4rem' }} /> Export
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
            <FaCalendarAlt size={24} />
          </KPIIconBubble>
        </KPICard>

        <KPICard>
          <KPIGroup>
            <KPILabel>Aktivnih (nadolazećih + tekućih)</KPILabel>
            <KPIValue>{activeCount}</KPIValue>
            <KPISub>ne uključuje prošle</KPISub>
          </KPIGroup>
          <KPIIconBubble>
            <FaPlayCircle size={24} />
          </KPIIconBubble>
        </KPICard>

        <KPICard>
          <KPIGroup>
            <KPILabel>Prošlih</KPILabel>
            <KPIValue>{pastCount}</KPIValue>
            <KPISub>završeni događaji</KPISub>
          </KPIGroup>
          <KPIIconBubble>
            <FaHistory size={24} />
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
            <FaUniversity size={24} />
          </KPIIconBubble>
        </KPICard>
      </KPIRow>

      <Grid>
        <Card style={{ gridColumn: 'span 12' }}>
          <CardTitle>
            Broj {monthMode === 'termini' ? 'termina' : 'događaja'} po mjesecima ({year})
          </CardTitle>
          <ChartLine data={monthly} dataKeyA="count" labelA="Događaji" xKey="month" />
        </Card>

        <Card style={{ gridColumn: 'span 12' }}>
          <CardTitle>Ukupno događaja po instituciji</CardTitle>
          <ChartBar data={byInstitution} dataKeyA="count" labelA="Događaji" />
        </Card>

        <Card style={{ gridColumn: 'span 12' }}>
          <CardTitle>Ukupno događaja po kategoriji</CardTitle>
          <ChartBar data={byCategory} dataKeyA="count" labelA="Događaji" />
        </Card>

        <Card style={{ gridColumn: 'span 12' }}>
          <CardTitle>Aktivni vs. Prošli po instituciji</CardTitle>
          <ChartStacked
            data={activePastByInstitution}
            dataKeyA="Active"
            dataKeyB="Past"
            labelA="Aktivni"
            labelB="Prošli"
          />
        </Card>

        <Card style={{ gridColumn: 'span 12' }}>
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
// Chart wrappers (dinamički import 'recharts')
// ————————————————————————————————————————————————————
function ChartBar({ data, dataKeyA, labelA }) {
  const R = useRecharts();
  if (!R) return <div style={{ height: 320 }} />; // skeleton/placeholder
  const { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } = R;
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
  const R = useRecharts();
  if (!R) return <div style={{ height: 320 }} />;
  const { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } = R;
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
  const R = useRecharts();
  if (!R) return <div style={{ height: 320 }} />;
  const { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } = R;
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
