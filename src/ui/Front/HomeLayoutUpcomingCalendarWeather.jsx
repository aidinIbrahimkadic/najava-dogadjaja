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

export default function HomeLayoutUpcomingCalendarWeather({ events = [], upcomingEvents }) {
  // ⬇️ Fallback na tvoje dummy podatke ako props.events nije proslijeđen

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

    return {
      id: event.idguid,
      title: event.title,
      price: parseFloat(event.cijena),
      date: formatedDate,
      time: formattedTime,
      category: event.category.naziv,
      category_idguid: event.category.idguid,
      location: event.lokacija.naziv,
      institution: event.institucija.naziv,
      institution_idguid: event.institucija.idguid,
    };
  });

  const data = Array.isArray(events) && events.length > 0 ? events : allEvents;
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
