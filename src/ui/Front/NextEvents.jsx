import React from 'react';
import styled, { css } from 'styled-components';
import Heading from '../Heading';

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
  },
  {
    id: 'e2',
    date: '2025-08-12',
    startTime: '18:30',
    title: 'Koncert klasične muzike',
    location: 'Centar za kulturu i obrazovanje',
    category: 'Kultura',
    image: '/images/poster1.jpg',
  },
  {
    id: 'e3',
    date: '2025-08-13',
    startTime: '10:00',
    title: 'Radionica za poduzetnike',
    location: 'Poslovni inkubator Tešanj',
    category: 'Edukacija',
    image: '/images/poster2.jpg',
  },
  {
    id: 'e4',
    date: '2025-08-14',
    startTime: '20:00',
    title: 'Ljetno kino: Dokumentarni film',
    location: 'Amfiteatar parka',
    category: 'Film',
    image: '/images/poster3.jpg',
  },
  {
    id: 'e5',
    date: '2025-08-15',
    startTime: '17:00',
    title: 'Turnir u basketu 3x3',
    location: 'Sportski teren Bukva',
    category: 'Sport',
    image: '/images/poster4.jpg',
  },
  {
    id: 'e6',
    date: '2025-08-16',
    startTime: '11:00',
    title: 'Slikarska kolonija',
    location: 'Stari grad',
    category: 'Umjetnost',
    image: '/images/poster6.jpg',
  },
];

// --- Utils ---
const formatDate = (isoDate) => {
  const date = new Date(isoDate + 'T00:00:00');
  const opts = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };
  return new Intl.DateTimeFormat('bs-BA', opts).format(date);
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
  margin: 4rem 0;
`;

const DateSection = styled.section`
  display: grid;
  grid-template-columns: 200px 1fr;
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
  grid-template-columns: 0.1fr 1fr;
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
  height: 14rem;
  width: 10rem;
  max-width: 220px;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, #e5e7eb, #f9fafb);
  border: 1px solid #e5e7eb;

  /* Modern browsers */
  /* aspect-ratio: 210 / 297; */

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
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 0.1fr;
  padding: 1rem;
  align-items: center;
  width: 100%;
`;

// --- Component ---
export default function NextEvents() {
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
                    <MetaRow />
                  </TitleCol>

                  <Category>{ev.category}</Category>
                </Container>
              </EventCard>
            ))}
          </EventsColumn>
        </DateSection>
      ))}
    </Wrapper>
  );
}
