import React from 'react';
import styled, { css } from 'styled-components';
import Heading from '../Heading';
import { FaCheckCircle } from 'react-icons/fa';
import NextButton from './NextButton';

// --- Dummy data (narednih događaja) ---
// Pretpostavka: podaci već dolaze sortirani po datumu/vremenu
const DUMMY_EVENTS = [
  {
    id: 'e1',
    date: '2025-08-12',
    startTime: '09:00',
    title: 'Sajam domaćih proizvoda',
    location: 'Gradski trg, Tešanj',
    category: 'Ekonomija',
    image: '/images/poster.jpg',
    going: 12,
    cijena: 0,
    active: true,
  },
  {
    id: 'e2',
    date: '2025-08-12',
    startTime: '18:30',
    title: 'Koncert klasične muzike',
    location: 'Centar za kulturu i obrazovanje',
    category: 'Kultura',
    image: '/images/poster1.jpg',
    going: 24,
    cijena: 0,
    active: false,
  },
  {
    id: 'e3',
    date: '2025-08-13',
    startTime: '10:00',
    title: 'Radionica za poduzetnike',
    location: 'Poslovni inkubator Tešanj',
    category: 'Edukacija',
    image: '/images/poster2.jpg',
    going: 35,
    cijena: 15,
    active: false,
  },
  {
    id: 'e4',
    date: '2025-08-13',
    startTime: '20:00',
    title: 'Ljetno kino: Dokumentarni film',
    location: 'Amfiteatar parka',
    category: 'Film',
    image: '/images/poster3.jpg',
    going: 2,
    cijena: 23.0,
    active: true,
  },
  {
    id: 'e5',
    date: '2025-08-15',
    startTime: '17:00',
    title: 'Turnir u basketu 3x3',
    location: 'Sportski teren Bukva',
    category: 'Sport',
    image: '/images/poster4.jpg',
    cijena: 0,
    going: 154,
  },
  {
    id: 'e6',
    date: '2025-08-16',
    startTime: '11:00',
    title: 'Slikarska kolonija',
    location: 'Stari grad',
    category: 'Umjetnost',
    image: '/images/poster6.jpg',
    going: 94,
    cijena: 0,
    active: false,
  },
];

// --- Utils ---

const formatDate = (isoDate) => {
  const d = new Date(isoDate + 'T00:00:00');
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
};

// Grupisanje po datumu i uzimanje samo narednih 5 događaja
const groupNextFiveByDate = (events) => {
  const nextFive = events.slice(0, 5);
  return nextFive.reduce((acc, ev) => {
    if (!acc[ev.date]) acc[ev.date] = [];
    acc[ev.date].push(ev);
    return acc;
  }, {});
};

// --- Styled components ---
const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 10rem 0 10rem;
`;

const DateSection = styled.section`
  display: grid;
  grid-template-columns: 15rem 1fr;
  gap: 1.5rem;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const DateBadge = styled.div`
  position: sticky;
  top: 0;
  align-self: start;
  background: #111827;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.3rem;
  border-radius: 14px;
  font-weight: 700;
  text-transform: capitalize;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
`;

const EventsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const EventCard = styled.article`
  display: grid;
  grid-template-columns: 10rem 1fr;
  align-items: center;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  gap: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  overflow: hidden;

  @media (max-width: 900px) {
    grid-template-columns: 80px 120px 1fr;
  }
`;

const TimeCol = styled.div`
  font-weight: 500;
  font-size: 1.6rem;
  color: #111827;
  letter-spacing: 0.3px;
`;

// A4 poster omjer (210x297). Koristimo aspect-ratio (moderno) + fallback.
const Poster = styled.div`
  /* position: relative; */
  max-width: 220px;
  height: 15rem;
  border-radius: 12px 0 0 12px;
  overflow: hidden;
  background: linear-gradient(135deg, #e5e7eb, #f9fafb);
  border: 1px solid #e5e7eb;

  /* Modern browsers */
  aspect-ratio: 210 / 297;

  /* Fallback */
  @supports not (aspect-ratio: 1 / 1) {
    height: 0;
    padding-bottom: calc(297 / 210 * 100%);
  }

  ${({ $image }) =>
    $image &&
    css`
      background-image: url(${$image.startsWith('http')
        ? $image
        : `http://localhost:5177${$image}`});
      background-size: cover;
      /* background-position: center; */
      background-repeat: no-repeat;
    `}
`;

const TitleCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const LocationText = styled.div`
  font-size: 1.2rem;
  color: #6b7280;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.8rem;
  line-height: 1.3;
  color: #111827;
  letter-spacing: 0.6px;
  text-transform: uppercase;
`;

const Category = styled.span`
  justify-self: end;
  background: #eef2ff;
  color: #3730a3;
  font-weight: 700;
  border: 1px solid #c7d2fe;
  padding: 0.4rem 0.7rem;
  border-radius: 999px;
  white-space: nowrap;
  font-size: 0.85rem;

  @media (max-width: 900px) {
    justify-self: end;
  }
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
  gap: 2rem;
  flex-wrap: wrap;
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 0.1fr;
  padding: 1rem;
  align-items: center;
  width: 100%;
`;

const Going = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PriceAndCategoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: space-between;
`;

const Price = styled.div`
  padding: 0.5rem 2rem;
  color: var(--color-grey-600);
  font-size: 1.8rem;
  font-weight: 700;
  border-radius: 50px;
`;
// --- Component ---
export default function NextEvents() {
  // POPRAVITI Brise se state a povlaci podatak iz baze
  const grouped = groupNextFiveByDate(DUMMY_EVENTS);
  const orderedDates = Object.keys(grouped).sort();

  return (
    <Wrapper>
      <Heading as="h2">Nadolazeći događaji</Heading>
      {orderedDates.map((dateKey) => (
        <DateSection key={dateKey}>
          <DateBadge>{formatDate(dateKey)}</DateBadge>

          <EventsColumn>
            {grouped[dateKey].map((ev) => (
              <EventCard key={ev.id}>
                <Poster $image={ev.image} aria-label="A4 poster" />
                <Container>
                  <TitleCol>
                    {/* Lokacija može biti iznad ili ispod naslova; ostavili smo iznad */}
                    <LocationText>{ev.location}</LocationText>
                    <Title>{ev.title}</Title>
                    <TimeCol>{ev.startTime}h</TimeCol>
                    <MetaRow>
                      <Going>
                        <FaCheckCircle size={24} color="green" />
                        Dolazi: {ev.going}
                      </Going>
                      <NextButton active={ev.active}>Dolazim</NextButton>
                    </MetaRow>
                  </TitleCol>

                  <PriceAndCategoryContainer>
                    <Category>{ev.category}</Category>
                    <Price>{ev.cijena} KM</Price>
                  </PriceAndCategoryContainer>
                </Container>
              </EventCard>
            ))}
          </EventsColumn>
        </DateSection>
      ))}
    </Wrapper>
  );
}

// import React, { useEffect, useMemo, useState } from 'react';
// import styled, { css } from 'styled-components';
// import Heading from '../Heading';

// // --- Utils ---

// // Grupisanje po datumu i uzimanje samo narednih 5 događaja
// const groupNextFiveByDate = (events) => {
//   const nextFive = events.slice(0, 5);
//   return nextFive.reduce((acc, ev) => {
//     if (!acc[ev.date]) acc[ev.date] = [];
//     acc[ev.date].push(ev);
//     return acc;
//   }, {});
// };

// // --- Layout wrappers ---
// const Page = styled.div`
//   display: grid;
//   grid-template-columns: 1fr 340px;
//   gap: 2rem;
//   align-items: start;
//   margin: 4rem 0;
//   width: 100%;

//   @media (max-width: 1100px) {
//     grid-template-columns: 1fr;
//   }
// `;

// const Wrapper = styled.div`
//   width: 100%;
//   display: flex;
//   flex-direction: column;
//   gap: 2rem;
// `;

// const Sidebar = styled.aside`
//   position: sticky;
//   top: 0.5rem;
//   display: flex;
//   flex-direction: column;
//   gap: 1rem;
// `;

// // --- Left column (lista događaja) ---
// const DateSection = styled.section`
//   display: grid;
//   grid-template-columns: 15rem 1fr;
//   gap: 1.5rem;
//   align-items: start;

//   @media (max-width: 900px) {
//     grid-template-columns: 1fr;
//   }
// `;

// const DateBadge = styled.div`
//   position: sticky;
//   top: 0;
//   align-self: start;
//   background: #111827;
//   color: #fff;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   padding: 0.6rem 1rem;
//   border-radius: 14px;
//   font-weight: 700;
//   text-transform: none;
//   box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
// `;

// const EventsColumn = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 1.25rem;
// `;

// const EventCard = styled.article`
//   display: grid;
//   grid-template-columns: 10rem 1fr;
//   background: #ffffff;
//   border: 1px solid #e5e7eb;
//   border-radius: 16px;
//   gap: 1rem;
//   box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
//   overflow: hidden;
// `;

// // A4 poster omjer (210x297)
// const Poster = styled.div`
//   max-width: 220px;
//   height: 15rem;
//   border-radius: 12px 0 0 12px;
//   overflow: hidden;
//   background: linear-gradient(135deg, #e5e7eb, #f9fafb);
//   border: 1px solid #e5e7eb;
//   aspect-ratio: 210 / 297;

//   @supports not (aspect-ratio: 1 / 1) {
//     height: 0;
//     padding-bottom: calc(297 / 210 * 100%);
//   }

//   ${({ $image }) =>
//     $image &&
//     css`
//       background-image: url(${($image) => `http://localhost:5177${$image}`});
//       background-size: cover;
//       background-position: center;
//       background-repeat: no-repeat;
//     `}
// `;

// const Content = styled.div`
//   padding: 1rem 1rem 1rem 0.25rem;
//   display: flex;
//   flex-direction: column;
//   gap: 0.6rem;
// `;

// const TopRow = styled.div`
//   display: flex;
//   align-items: flex-start;
//   justify-content: space-between;
//   gap: 1rem;
// `;

// const TitleLink = styled.a`
//   margin: 0;
//   font-size: 1.4rem;
//   line-height: 1.3;
//   color: #111827;
//   letter-spacing: 0.6px;
//   text-transform: uppercase;
//   text-decoration: none;
//   &:hover {
//     text-decoration: underline;
//   }
// `;

// const Category = styled.span`
//   background: #eef2ff;
//   color: #3730a3;
//   font-weight: 700;
//   border: 1px solid #c7d2fe;
//   padding: 0.35rem 0.7rem;
//   border-radius: 999px;
//   white-space: nowrap;
//   font-size: 0.85rem;
// `;

// const LocationText = styled.div`
//   font-size: 1rem;
//   color: #6b7280;
// `;

// const InfoRow = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 1rem;
//   flex-wrap: wrap;
// `;

// const TimeChip = styled.span`
//   font-weight: 600;
//   color: #111827;
// `;

// const GoingChip = styled.span`
//   background: #f3f4f6;
//   border: 1px solid #e5e7eb;
//   border-radius: 999px;
//   padding: 0.25rem 0.6rem;
//   font-size: 0.9rem;
//   color: #374151;
// `;

// const Button = styled.button`
//   appearance: none;
//   border: 1px solid #10b981;
//   background: #10b981;
//   color: white;
//   font-weight: 700;
//   padding: 0.45rem 0.9rem;
//   border-radius: 999px;
//   cursor: pointer;
//   transition: filter 0.2s ease;
//   &:hover {
//     filter: brightness(0.95);
//   }
// `;

// // --- Right column (kalendar + vrijeme) ---
// const Card = styled.div`
//   background: #fff;
//   border: 1px solid #e5e7eb;
//   border-radius: 16px;
//   box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
//   padding: 1rem;
// `;

// const CalendarBox = styled(Card)`
//   aspect-ratio: 1 / 1; /* kvadrat */
//   display: flex;
//   flex-direction: column;
// `;

// const CalHeader = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   padding-bottom: 0.5rem;
//   border-bottom: 1px dashed #e5e7eb;
// `;

// const CalGrid = styled.div`
//   margin-top: 0.75rem;
//   display: grid;
//   grid-template-columns: repeat(7, 1fr);
//   gap: 0.25rem;
//   flex: 1;
// `;

// const CalCell = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   border: 1px solid #f3f4f6;
//   border-radius: 8px;
//   font-size: 0.9rem;
//   color: #374151;
// `;

// const WeatherBox = styled(Card)`
//   display: flex;
//   flex-direction: column;
//   gap: 0.5rem;
// `;

// const WxRow = styled.div`
//   display: grid;
//   grid-template-columns: 1fr auto auto;
//   gap: 0.5rem;
//   align-items: center;
// `;

// // --- Helpers for Calendar (placeholder) ---
// const useCalendar = (baseDate = new Date()) => {
//   return useMemo(() => {
//     const year = baseDate.getFullYear();
//     const month = baseDate.getMonth(); // 0-11
//     const firstDay = new Date(year, month, 1);
//     const startWeekday = (firstDay.getDay() + 6) % 7; // make Monday=0
//     const daysInMonth = new Date(year, month + 1, 0).getDate();

//     const cells = [];
//     for (let i = 0; i < startWeekday; i++) cells.push(null);
//     for (let d = 1; d <= daysInMonth; d++) cells.push(d);
//     while (cells.length % 7 !== 0) cells.push(null);

//     const monthName = new Intl.DateTimeFormat('bs-BA', { month: 'long' }).format(firstDay);
//     return { year, monthName, cells };
//   }, [baseDate]);
// };

// // --- Component ---
// export default function NextEvents() {
//   const grouped = groupNextFiveByDate(DUMMY_EVENTS);
//   const orderedDates = Object.keys(grouped).sort();

//   // Lokalni RSVP state (toggle)
//   const [goingSet, setGoingSet] = useState(new Set());
//   const [goingCounts, setGoingCounts] = useState(() => {
//     const map = new Map();
//     DUMMY_EVENTS.forEach((e) => map.set(e.id, e.going || 0));
//     return map;
//   });

//   const toggleGoing = (id) => {
//     setGoingSet((prev) => {
//       const next = new Set(prev);
//       const wasGoing = next.has(id);
//       const delta = wasGoing ? -1 : 1;
//       if (wasGoing) next.delete(id);
//       else next.add(id);
//       setGoingCounts((m) => new Map(m).set(id, (m.get(id) || 0) + delta));
//       return next;
//     });
//   };

//   // Kalendar (placeholder)
//   const cal = useCalendar(new Date());

//   // Vrijeme za naredna 3 dana (Open‑Meteo, bez API ključa)
//   const [wx, setWx] = useState([]);
//   useEffect(() => {
//     const controller = new AbortController();
//     (async () => {
//       try {
//         const url =
//           'https://api.open-meteo.com/v1/forecast?latitude=44.61&longitude=17.99&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_mean&timezone=auto&forecast_days=3';
//         const res = await fetch(url, { signal: controller.signal });
//         const data = await res.json();
//         const out = (data?.daily?.time || []).map((d, i) => ({
//           date: d,
//           tmax: data.daily.temperature_2m_max?.[i],
//           tmin: data.daily.temperature_2m_min?.[i],
//           pop: data.daily.precipitation_probability_mean?.[i],
//         }));
//         setWx(out);
//       } catch (e) {
//         console.log(e);
//         // swallow for placeholder
//       }
//     })();
//     return () => controller.abort();
//   }, []);

//   return (
//     <Page>
//       {/* LEFT: lista događaja */}
//       <Wrapper>
//         <Heading as="h2">Nadolazeći događaji</Heading>
//         {orderedDates.map((dateKey) => (
//           <DateSection key={dateKey}>
//             <DateBadge>{formatDateNumeric(dateKey)}</DateBadge>

//             <EventsColumn>
//               {grouped[dateKey].map((ev) => (
//                 <EventCard key={ev.id}>
//                   <Poster $image={ev.image} aria-label="A4 poster" />

//                   <Content>
//                     <TopRow>
//                       <TitleLink href={`#/events/${ev.id}`}>{ev.title}</TitleLink>
//                       <Category>{ev.category}</Category>
//                     </TopRow>
//                     <LocationText>{ev.location}</LocationText>

//                     <InfoRow>
//                       <TimeChip>Vrijeme: {ev.startTime}h</TimeChip>
//                       <GoingChip>{goingCounts.get(ev.id) || 0} dolazim</GoingChip>
//                       <Button onClick={() => toggleGoing(ev.id)}>
//                         {goingSet.has(ev.id) ? 'Ne dolazim' : 'Dolazim'}
//                       </Button>
//                     </InfoRow>
//                   </Content>
//                 </EventCard>
//               ))}
//             </EventsColumn>
//           </DateSection>
//         ))}
//       </Wrapper>

//       {/* RIGHT: kalendar + vrijeme */}
//       <Sidebar>
//         <CalendarBox>
//           <CalHeader>
//             <strong style={{ textTransform: 'capitalize' }}>{cal.monthName}</strong>
//             <span>{new Date().getFullYear()}</span>
//           </CalHeader>
//           <CalGrid>
//             {['P', 'U', 'S', 'Č', 'P', 'S', 'N'].map((d) => (
//               <CalCell key={`hdr-${d}`} style={{ fontWeight: 700, background: '#f9fafb' }}>
//                 {d}
//               </CalCell>
//             ))}
//             {cal.cells.map((d, idx) => (
//               <CalCell key={idx}>{d || ''}</CalCell>
//             ))}
//           </CalGrid>
//         </CalendarBox>

//         <WeatherBox>
//           <Heading as="h3">Vrijeme naredna 3 dana</Heading>
//           {wx.length === 0 && <div style={{ color: '#6b7280' }}>Učitavanje prognoze…</div>}
//           {wx.map((r) => (
//             <WxRow key={r.date}>
//               <span>{formatDateNumeric(r.date)}</span>
//               <span>
//                 {Math.round(r.tmin)}° / {Math.round(r.tmax)}°
//               </span>
//               <span>{r.pop}% oborine</span>
//             </WxRow>
//           ))}
//         </WeatherBox>
//       </Sidebar>
//     </Page>
//   );
// }
