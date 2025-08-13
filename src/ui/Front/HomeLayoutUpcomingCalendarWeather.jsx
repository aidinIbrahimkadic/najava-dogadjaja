// === File: HomeLayout.jsx ===
import React from 'react';
import styled from 'styled-components';
import { UpcomingEvents } from './UpcomingEvents';
import { EventsCalendar } from './EventsCalendar';
import { WeatherForecast3Day } from './WeatherForecast3Day';

const Page = styled.div`
  width: 80%;
  /* min-height: 100vh; */
  background: #fbfdff;
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 1.5rem;
  padding: 1.5rem;
  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const RightColumn = styled.div`
  display: grid;
  grid-template-rows: 1fr auto;
  gap: 1.5rem;
  @media (max-width: 1100px) {
    grid-template-rows: auto auto;
  }
`;

export default function HomeLayoutUpcomingCalendarWeather({ events = [] }) {
  // ⬇️ Fallback na tvoje dummy podatke ako props.events nije proslijeđen
  const DEMO_EVENTS = [
    {
      id: 'e101',
      title: 'Koncert klasične muzike',
      date: '2025-08-16',
      time: '19:30',
      location: 'Centar za kulturu',
      category: 'Kultura',
      institution: 'JU CKiO Tešanj',
      price: 10,
      going: 42,
      poster: '/images/poster1.jpg',
    },
    {
      id: 'e222',
      title: 'Neki drugi događaj isti dan',
      date: '2025-08-16',
      time: '20:30',
      location: 'Centar za kulturu',
      category: 'Kultura',
      institution: 'JU CKiO Tešanj',
      price: 10,
      going: 42,
      poster: '/images/poster1.jpg',
    },
    {
      id: 'e102',
      title: 'Ljetno kino: Dokumentarni film',
      date: '2025-08-17',
      time: '21:00',
      location: 'Amfiteatar parka',
      category: 'Film',
      institution: 'Film Klub Tešanj',
      price: 0,
      going: 85,
      poster: '/images/poster3.jpg',
    },
    {
      id: 'e103',
      title: 'Radionica za poduzetnike',
      date: '2025-08-20',
      time: '10:00',
      location: 'Poslovni inkubator',
      category: 'Edukacija',
      institution: 'RA Tešanj',
      price: 0,
      going: 19,
      poster: '/images/poster2.jpg',
    },
    {
      id: 'e104',
      title: 'Turnir u basketu 3x3',
      date: '2025-08-23',
      time: '17:00',
      location: 'Sportski teren Bukva',
      category: 'Sport',
      institution: 'Sportski savez',
      price: 5,
      going: 61,
      poster: '/images/poster4.jpg',
    },
    {
      id: 'e105',
      title: 'Slikarska kolonija',
      date: '2025-08-25',
      time: '11:00',
      location: 'Stari grad',
      category: 'Umjetnost',
      institution: 'Likovno Udruženje',
      price: 0,
      going: 24,
      poster: '/images/poster6.jpg',
    },
    {
      id: 'e106',
      title: 'Sajam domaćih proizvoda',
      date: '2025-08-18',
      time: '09:00',
      location: 'Gradski trg',
      category: 'Ekonomija',
      institution: 'Općina Tešanj',
      price: 0,
      going: 73,
      poster: '/images/poster.jpg',
    },
    {
      id: 'e107',
      title: 'Tech Meetup: React & Node',
      date: '2025-08-22',
      time: '18:00',
      location: 'Coworking Hub',
      category: 'Tehnologija',
      institution: 'iDevelop Studio',
      price: 0,
      going: 37,
      poster: '/images/poster5.jpg',
    },
  ];

  const data = Array.isArray(events) && events.length > 0 ? events : DEMO_EVENTS;
  const eventsByDate = toEventsByDate(data);

  return (
    <Page>
      <EventsCalendar eventsByDate={eventsByDate} />
      <RightColumn>
        <UpcomingEvents events={data} />
        <WeatherForecast3Day />
      </RightColumn>
    </Page>
  );
}

// helpers (može ostati kako jeste)
function toEventsByDate(events) {
  const map = {};
  for (const e of events) {
    const key = e.date;
    if (!map[key]) map[key] = [];
    map[key].push({ id: e.id, title: e.title });
  }
  return map;
}
