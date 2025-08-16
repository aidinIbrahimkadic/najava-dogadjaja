// import React, { useMemo } from 'react';
// import styled from 'styled-components';
// import { FaMapMarkerAlt, FaClock, FaMoneyBillAlt, FaTicketAlt } from 'react-icons/fa';
// import { Calendar, Badge } from 'antd';
// import { Link } from 'react-router-dom';
// import { HiTicket } from 'react-icons/hi2';
// import Heading from '../Heading';

// const Card = styled.div`
//   background: #fff;
//   border-radius: 1rem;
//   box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
//   padding: 1rem;
// `;

// const Title = styled.div`
//   margin: 0 0 2rem 0;
//   font-size: 1.8rem;
//   display: flex;
//   align-items: center;
//   gap: 1rem;
//   letter-spacing: 0.2px;
// `;

// const Ticket = styled.div`
//   position: relative;
//   background: linear-gradient(180deg, #ffffff 0%, #fcfcff 100%);
//   border: 1px solid #eef2ff;
//   border-radius: 16px;
//   padding: 0.9rem 1rem;
//   display: grid;
//   grid-template-columns: auto 1fr auto;
//   align-items: center;
//   gap: 0.85rem;
//   overflow: hidden;

//   &::before,
//   &::after {
//     content: '';
//     position: absolute;
//     top: 50%;
//     transform: translateY(-50%);
//     width: 16px;
//     height: 16px;
//     background: #fbfdff;
//     border: 1px solid #eef2ff;
//     border-radius: 50%;
//   }
//   &::before {
//     left: -8px;
//   }
//   &::after {
//     right: -8px;
//   }
// `;

// const TicketStripe = styled.div`
//   width: 6px;
//   height: 100%;
//   background: linear-gradient(180deg, var(--color-brand-300) 0%, var(--color-brand-500) 100%);
//   border-radius: 8px;
// `;

// const TicketTitle = styled.div`
//   font-weight: 600;
//   font-size: 1.2rem;

//   &:hover {
//     text-decoration: underline;
//     color: #4f46e5;
//   }
// `;

// const Meta = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 0.65rem 1rem;
//   color: #52525b;
//   font-size: 1rem;
// `;

// const MetaItem = styled.span`
//   display: inline-flex;
//   align-items: center;
//   gap: 0.4rem;
// `;

// const DateHeader = styled.div`
//   margin: 1rem 0 0.5rem 0;
//   display: flex;
//   align-items: center;
//   gap: 0.6rem;
//   color: #374151;
//   font-weight: 600;
// `;

// const Square = styled(Card)`
//   aspect-ratio: 1 / 1;
//   display: flex;
//   flex-direction: column;
//   overflow: hidden;
// `;

// function formatDateLabel(isoDate) {
//   const d = new Date(isoDate);
//   const dd = String(d.getDate()).padStart(2, '0');
//   const mm = String(d.getMonth() + 1).padStart(2, '0');
//   const yyyy = d.getFullYear();
//   const weekdayRaw = new Intl.DateTimeFormat('bs-BA', { weekday: 'long' }).format(d);
//   const weekday = weekdayRaw.charAt(0).toUpperCase() + weekdayRaw.slice(1);
//   return `${dd}.${mm}.${yyyy} - ${weekday}`;
// }

// function timeHM(dateStr, timeStr) {
//   try {
//     const d = new Date(`${dateStr}T${timeStr}:00`);
//     return new Intl.DateTimeFormat('bs-BA', { hour: '2-digit', minute: '2-digit' }).format(d);
//   } catch {
//     return timeStr;
//   }
// }

// export function UpcomingEvents({ events = [] }) {
//   const upcoming = useMemo(() => {
//     if (!events.length) return [];
//     return [...events]
//       .sort((a, b) => new Date(`${a.date}T${a.time}:00`) - new Date(`${b.date}T${b.time}:00`))
//       .slice(0, 5);
//   }, [events]);

//   const groups = useMemo(() => {
//     const map = new Map();
//     for (const e of upcoming) {
//       const key = e.date;
//       if (!map.has(key)) map.set(key, []);
//       map.get(key).push(e);
//     }
//     return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
//   }, [upcoming]);

//   return (
//     <Card>
//       <Title>
//         <HiTicket style={{ color: 'var(--color-brand-500)' }} />
//         <Heading as="h3">Predstojeći događaji</Heading>
//       </Title>
//       {groups.length === 0 && <div>Nema predstojećih događaja.</div>}
//       {groups.map(([dateKey, items]) => (
//         <div key={dateKey}>
//           <DateHeader>
//             <FaTicketAlt /> {formatDateLabel(dateKey)}
//           </DateHeader>
//           <div style={{ display: 'grid', gap: '0.8rem' }}>
//             {items.map((e) => (
//               <Ticket key={e.id}>
//                 <TicketStripe />
//                 <div>
//                   <TicketTitle>
//                     <Link to={`/dogadjaj/${e.id}`}>{e.title}</Link>
//                   </TicketTitle>
//                   <Meta>
//                     <MetaItem>
//                       <FaClock /> {timeHM(e.date, e.time)}
//                     </MetaItem>
//                     {e.price != null && (
//                       <MetaItem>
//                         <FaMoneyBillAlt /> {e.price === 0 ? 'Besplatno' : `${e.price} KM`}
//                       </MetaItem>
//                     )}
//                     {e.location && (
//                       <MetaItem>
//                         <FaMapMarkerAlt /> {e.location}
//                       </MetaItem>
//                     )}
//                   </Meta>
//                 </div>
//                 <div />
//               </Ticket>
//             ))}
//           </div>
//         </div>
//       ))}
//     </Card>
//   );
// }

// export function EventsCalendar({ eventsByDate = {} }) {
//   const dateCellRender = (value) => {
//     const key = value.format('YYYY-MM-DD');
//     const items = eventsByDate[key] || [];
//     return (
//       <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
//         {items.map((e) => (
//           <li key={e.id} style={{ marginBottom: 4 }}>
//             <Badge status="processing" text={e.title} />
//           </li>
//         ))}
//       </ul>
//     );
//   };

//   return (
//     <Square>
//       <Title>📅 Kalendar događaja</Title>
//       <div style={{ flex: 1, minHeight: 0 }}>
//         <Calendar
//           fullscreen={true}
//           cellRender={(current, info) => {
//             if (info.type === 'date') return dateCellRender(current);
//             return info.originNode;
//           }}
//         />
//       </div>
//     </Square>
//   );
// }

// DODAJEMO endDate

// === File: UpcomingEvents.jsx ===
// import React, { useMemo } from 'react';
// import styled from 'styled-components';
// import { FaMapMarkerAlt, FaClock, FaMoneyBillAlt, FaTicketAlt } from 'react-icons/fa';
// import { Link } from 'react-router-dom';
// import { HiTicket } from 'react-icons/hi2';
// import Heading from '../Heading';

// const Card = styled.div`
//   background: #fff;
//   border-radius: 1rem;
//   box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
//   padding: 1rem;
// `;

// const Title = styled.div`
//   margin: 0 0 2rem 0;
//   font-size: 1.8rem;
//   display: flex;
//   align-items: center;
//   gap: 1rem;
//   letter-spacing: 0.2px;
// `;

// const Ticket = styled.div`
//   position: relative;
//   background: linear-gradient(180deg, #ffffff 0%, #fcfcff 100%);
//   border: 1px solid #eef2ff;
//   border-radius: 16px;
//   padding: 0.9rem 1rem;
//   display: grid;
//   grid-template-columns: auto 1fr auto;
//   align-items: center;
//   gap: 0.85rem;
//   overflow: hidden;

//   &::before,
//   &::after {
//     content: '';
//     position: absolute;
//     top: 50%;
//     transform: translateY(-50%);
//     width: 16px;
//     height: 16px;
//     background: #fbfdff;
//     border: 1px solid #eef2ff;
//     border-radius: 50%;
//   }
//   &::before {
//     left: -8px;
//   }
//   &::after {
//     right: -8px;
//   }
// `;

// const TicketStripe = styled.div`
//   width: 6px;
//   height: 100%;
//   background: linear-gradient(180deg, var(--color-brand-300) 0%, var(--color-brand-500) 100%);
//   border-radius: 8px;
// `;

// const TicketTitle = styled.div`
//   font-weight: 600;
//   font-size: 1.2rem;
//   display: inline-flex;
//   align-items: center;
//   gap: 0.5rem;
//   flex-wrap: wrap;

//   a:hover {
//     text-decoration: underline;
//     color: #4f46e5;
//   }
// `;

// const Chip = styled.span`
//   font-size: 0.75rem;
//   padding: 0.1rem 0.45rem;
//   border-radius: 999px;
//   background: #fff0e6;
//   border: 1px solid #ffd6bf;
//   color: #7c2d12;
// `;

// const Meta = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 0.65rem 1rem;
//   color: #52525b;
//   font-size: 1rem;
// `;

// const MetaItem = styled.span`
//   display: inline-flex;
//   align-items: center;
//   gap: 0.4rem;
// `;

// const DateHeader = styled.div`
//   margin: 1rem 0 0.5rem 0;
//   display: flex;
//   align-items: center;
//   gap: 0.6rem;
//   color: #374151;
//   font-weight: 600;
// `;

// function formatDateLabel(isoDate) {
//   const d = new Date(isoDate);
//   const dd = String(d.getDate()).padStart(2, '0');
//   const mm = String(d.getMonth() + 1).padStart(2, '0');
//   const yyyy = d.getFullYear();
//   const weekdayRaw = new Intl.DateTimeFormat('bs-BA', { weekday: 'long' }).format(d);
//   const weekday = weekdayRaw.charAt(0).toUpperCase() + weekdayRaw.slice(1);
//   return `${dd}.${mm}.${yyyy} - ${weekday}`;
// }

// function timeHM(dateStr, timeStr) {
//   try {
//     const d = new Date(`${dateStr}T${timeStr || '00:00'}:00`);
//     return new Intl.DateTimeFormat('bs-BA', { hour: '2-digit', minute: '2-digit' }).format(d);
//   } catch {
//     return timeStr || '';
//   }
// }

// // kratak prikaz raspona (isti dan → samo vrijeme; različiti dani → datumi)
// function rangeShort(e) {
//   const start = new Date(`${e.date}T${e.time || '00:00'}:00`);
//   const end = new Date(`${e.end_date}T${e.end_time || '23:59'}:00`);

//   const sameDay =
//     start.getFullYear() === end.getFullYear() &&
//     start.getMonth() === end.getMonth() &&
//     start.getDate() === end.getDate();

//   if (sameDay) {
//     return timeHM(e.date, e.time);
//   }

//   const fmt = (d) =>
//     `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.`;
//   return `${fmt(start)}–${fmt(end)}`;
// }

// export function UpcomingEvents({ events = [] }) {
//   // “Narednih 5” uz podršku za višednevne i prioritet “u toku”
//   const upcoming = useMemo(() => {
//     if (!events.length) return [];

//     const now = new Date();

//     return events
//       .map((e) => {
//         const start = new Date(`${e.date}T${e.time || '00:00'}:00`);
//         const end = new Date(`${e.end_date || e.date}T${e.end_time || '23:59'}:00`);
//         const ongoing = start <= now && end >= now;
//         const relevantAt = ongoing ? now : start;
//         return { ...e, _start: start, _end: end, _ongoing: ongoing, _relevantAt: relevantAt };
//       })
//       .filter((e) => e._end >= now) // izbaci potpuno prošle
//       .sort((a, b) => {
//         if (a._ongoing && !b._ongoing) return -1;
//         if (!a._ongoing && b._ongoing) return 1;
//         return a._relevantAt - b._relevantAt;
//       })
//       .slice(0, 5);
//   }, [events]);

//   // grupisanje po startnom datumu (bez širenja višednevnih)
//   const groups = useMemo(() => {
//     const map = new Map();
//     for (const e of upcoming) {
//       const key = e.date;
//       if (!map.has(key)) map.set(key, []);
//       map.get(key).push(e);
//     }
//     return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
//   }, [upcoming]);

//   return (
//     <Card>
//       <Title>
//         <HiTicket style={{ color: 'var(--color-brand-500)' }} />
//         <Heading as="h3">Predstojeći događaji</Heading>
//       </Title>

//       {groups.length === 0 && <div>Nema predstojećih događaja.</div>}

//       {groups.map(([dateKey, items]) => (
//         <div key={dateKey}>
//           <DateHeader>
//             <FaTicketAlt /> {formatDateLabel(dateKey)}
//           </DateHeader>

//           <div style={{ display: 'grid', gap: '0.8rem' }}>
//             {items.map((e) => (
//               <Ticket key={e.id}>
//                 <TicketStripe />
//                 <div>
//                   <TicketTitle>
//                     <Link to={`/dogadjaj/${e.id}`}>{e.title}</Link>
//                     {e._ongoing && <Chip>u toku</Chip>}
//                   </TicketTitle>

//                   <Meta>
//                     <MetaItem>
//                       <FaClock /> {rangeShort(e)}
//                     </MetaItem>

//                     {e.price != null && Number.isFinite(e.price) && (
//                       <MetaItem>
//                         <FaMoneyBillAlt /> {e.price === 0 ? 'Besplatno' : `${e.price} KM`}
//                       </MetaItem>
//                     )}

//                     {e.location && (
//                       <MetaItem>
//                         <FaMapMarkerAlt /> {e.location}
//                       </MetaItem>
//                     )}
//                   </Meta>
//                 </div>

//                 <div />
//               </Ticket>
//             ))}
//           </div>
//         </div>
//       ))}
//     </Card>
//   );
// }

// ZADNJA

// === File: UpcomingEvents.jsx ===
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { FaMapMarkerAlt, FaClock, FaMoneyBillAlt, FaTicketAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { HiTicket } from 'react-icons/hi2';
import Heading from '../Heading';

const Card = styled.div`
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  padding: 1rem;
`;

const Title = styled.div`
  margin: 0 0 2rem 0;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  letter-spacing: 0.2px;
`;

const Ticket = styled.div`
  position: relative;
  background: linear-gradient(180deg, #ffffff 0%, #fcfcff 100%);
  border: 1px solid #eef2ff;
  border-radius: 16px;
  padding: 0.9rem 1rem;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.85rem;
  overflow: hidden;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    background: #fbfdff;
    border: 1px solid #eef2ff;
    border-radius: 50%;
  }
  &::before {
    left: -8px;
  }
  &::after {
    right: -8px;
  }
`;

const TicketStripe = styled.div`
  width: 6px;
  height: 100%;
  background: linear-gradient(180deg, var(--color-brand-300) 0%, var(--color-brand-500) 100%);
  border-radius: 8px;
`;

const TicketTitle = styled.div`
  font-weight: 600;
  font-size: 1.2rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;

  a:hover {
    text-decoration: underline;
    color: #4f46e5;
  }
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem 1rem;
  color: #52525b;
  font-size: 1rem;
`;

const MetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
`;

const DateHeader = styled.div`
  margin: 1rem 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #374151;
  font-weight: 600;
`;

function ymd(d) {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
}

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function formatDateLabel(isoYmd) {
  const d = new Date(`${isoYmd}T00:00:00`);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const weekdayRaw = new Intl.DateTimeFormat('bs-BA', { weekday: 'long' }).format(d);
  const weekday = weekdayRaw.charAt(0).toUpperCase() + weekdayRaw.slice(1);
  return `${dd}.${mm}.${yyyy} - ${weekday}`;
}

function fmtDateHuman(d) {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

function timeHM(dateStr, timeStr) {
  try {
    const d = new Date(`${dateStr}T${timeStr || '00:00'}:00`);
    return new Intl.DateTimeFormat('bs-BA', { hour: '2-digit', minute: '2-digit' }).format(d);
  } catch {
    return timeStr || '';
  }
}

// Label za prikaz u redu karte:
// - višednevni: "DD.MM.YYYY – DD.MM.YYYY"
// - jednokratni: samo vrijeme (iz starta)
function labelForRow(base) {
  if (base._isMultiDay) {
    const s = new Date(`${base.date}T${base.time || '00:00'}:00`);
    const e = new Date(`${base.end_date}T${base.end_time || '23:59'}:00`);
    return `${fmtDateHuman(s)} – ${fmtDateHuman(e)}`;
  }
  return timeHM(base.date, base.time);
}

export function UpcomingEvents({ events = [] }) {
  // Ekspanzija u "instancije" po danu:
  // - višednevni → jedna instanca po svakom budućem danu (dok ne istekne)
  // - više termina → svaka buduća stavka iz `termini` kao posebna instanca
  // - jednokratni → ako je start u budućnosti, jedna instanca
  const flat = useMemo(() => {
    if (!events.length) return [];
    const now = new Date();
    const today0 = startOfDay(now);
    const tomorrow0 = addDays(today0, 1); // "samo buduće dane" → od sutra nadalje

    const out = [];

    for (const e of events) {
      const hasMultiTerms =
        Boolean(e.ima_vise_termina) && Array.isArray(e.termini) && e.termini.length > 0;

      if (hasMultiTerms) {
        // Svaki budući termin -> posebna instanca; koristi start_date termina
        for (const t of e.termini) {
          if (!t?.start_date) continue;
          const s = new Date(t.start_date);
          if (s <= now) continue; // samo buduće
          const dayKey = ymd(startOfDay(s));
          out.push({
            ...e,
            // group po danu prikaza
            _dayKey: dayKey,
            // za prikaz vremena/reda
            date: ymd(s), // "YYYY-MM-DD"
            time: `${String(s.getHours()).padStart(2, '0')}:${String(s.getMinutes()).padStart(2, '0')}`,
            _isMultiDay: false, // ovo je konkretan termin
            // koristimo originalni e.id (link vodi na isti event)
          });
        }
        continue;
      }

      // Jedan raspon (single ili multi-day)
      const s = e._startISO ? new Date(e._startISO) : new Date(`${e.date}T${e.time || '00:00'}:00`);
      const eEnd = e._endISO
        ? new Date(e._endISO)
        : new Date(`${e.end_date || e.date}T${e.end_time || '23:59'}:00`);

      const sDay = startOfDay(s);
      const eDay = startOfDay(eEnd);

      const isMultiDay =
        sDay.getFullYear() !== eDay.getFullYear() ||
        sDay.getMonth() !== eDay.getMonth() ||
        sDay.getDate() !== eDay.getDate();

      if (isMultiDay) {
        // dodaj po danu, ali samo buduće dane (>= sutra 00:00)
        let cursor = sDay < tomorrow0 ? tomorrow0 : sDay; // počni od sutra ili startDay, šta je kasnije
        while (cursor <= eDay) {
          const dayKey = ymd(cursor);
          out.push({
            ...e,
            _dayKey: dayKey, // dan u kojem ga prikazujemo
            _isMultiDay: true,
            // za label koristimo originalni raspon; ali `date`/`time` možemo ostaviti iz originalnog starta
          });
          cursor = addDays(cursor, 1);
        }
      } else {
        // jednokratni → samo ako je start u budućnosti (strogo)
        if (s > now) {
          const dayKey = ymd(startOfDay(s));
          out.push({
            ...e,
            _dayKey: dayKey,
            _isMultiDay: false,
          });
        }
      }
    }

    // Sort: po danu, pa po početnom vremenu (ako ima)
    out.sort((a, b) => {
      if (a._dayKey !== b._dayKey) return a._dayKey.localeCompare(b._dayKey);
      // ako su oba "termina", poredi po konkretnom vremenu
      const aTime = a.time || '00:00';
      const bTime = b.time || '00:00';
      return aTime.localeCompare(bTime);
    });

    // uzmi prvih 5 instanci
    return out.slice(0, 7);
  }, [events]);

  // Grupisanje po danu prikaza (_dayKey)
  const groups = useMemo(() => {
    const map = new Map();
    for (const row of flat) {
      const key = row._dayKey;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(row);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [flat]);

  return (
    <Card>
      <Title>
        <HiTicket style={{ color: 'var(--color-brand-500)' }} />
        <Heading as="h3">Predstojeći događaji</Heading>
      </Title>

      {groups.length === 0 && <div>Nema predstojećih događaja.</div>}

      {groups.map(([dayKey, items]) => (
        <div key={dayKey}>
          <DateHeader>
            <FaTicketAlt /> {formatDateLabel(dayKey)}
          </DateHeader>

          <div style={{ display: 'grid', gap: '0.8rem' }}>
            {items.map((e) => (
              <Ticket key={`${e.id}-${e._dayKey}-${e.time || 'xx'}`}>
                <TicketStripe />
                <div>
                  <TicketTitle>
                    <Link to={`/dogadjaj/${e.id}`}>{e.title}</Link>
                  </TicketTitle>

                  <Meta>
                    <MetaItem>
                      <FaClock /> {labelForRow(e)}
                    </MetaItem>

                    {e.price != null && Number.isFinite(e.price) && (
                      <MetaItem>
                        <FaMoneyBillAlt /> {e.price === 0 ? 'Besplatno' : `${e.price} KM`}
                      </MetaItem>
                    )}

                    {e.location && (
                      <MetaItem>
                        <FaMapMarkerAlt /> {e.location}
                      </MetaItem>
                    )}
                  </Meta>
                </div>

                <div />
              </Ticket>
            ))}
          </div>
        </div>
      ))}
    </Card>
  );
}
