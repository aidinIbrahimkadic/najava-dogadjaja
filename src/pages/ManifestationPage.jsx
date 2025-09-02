import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useGetEventsByManifestationId } from '../features/front/useAllEventsByManifestationId';
import { useGetManifestationById } from '../features/front/useManifestationById';
import { useGetUpcomingEvents } from '../features/front/useUpcomingEvents';
import CalendarSpinner from '../ui/CalendarSpinner';
import { RightColumn } from '../ui/Front/RightColumn';
import SingleManifestation from '../ui/Front/SingleManifestation';
import { UpcomingEvents } from '../ui/Front/UpcomingEvents';
import { WeatherForecast3Day } from '../ui/Front/WeatherForecast3Day';
// ⬇️ prilagodi putanju ako je drugačija

export const Page = styled.div`
  width: 100%;
  /* min-height: 100vh; */
  background: #fbfdff;
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 1.5rem;
  padding: 7rem 5rem 10rem 5rem;

  /* margin-bottom: 3rem; */

  @media (max-width: 1300px) {
    grid-template-columns: 1fr;
  }
  @media (max-width: 550px) {
    padding: 2rem 1rem 5rem 1rem;
  }
`;

export default function ManifestationPage() {
  const { id } = useParams();

  const { isLoading, events } = useGetEventsByManifestationId({ id });
  const { isLoading: isLoadingManifestation, manifestation } = useGetManifestationById({ id });
  const { isLoading: isLoadingEvents, upcomingEvents } = useGetUpcomingEvents();

  // const  {isLoading: isLoadingManifestation, manifestation} = useGetMani
  if (!id) {
    return <h2>Manifestacija nije pronađena (nedostaje ID u URL-u)</h2>;
  }

  {
    (isLoading || isLoadingManifestation || isLoadingEvents) && <CalendarSpinner />;
  }
  console.log(upcomingEvents, 'upcomingEvents');
  const allEvents = (upcomingEvents || []).map((ev) => {
    const start = new Date(ev.start_date);
    const end = ev.end_date ? new Date(ev.end_date) : new Date(ev.start_date);

    const fmtDate = (d) =>
      [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, '0'),
        String(d.getDate()).padStart(2, '0'),
      ].join('-');
    const fmtTime = (d) =>
      [String(d.getHours()).padStart(2, '0'), String(d.getMinutes()).padStart(2, '0')].join(':');

    return {
      id: ev.idguid,
      title: ev.title,
      price: Number.isFinite(parseFloat(ev.cijena)) ? parseFloat(ev.cijena) : null,
      date: fmtDate(start),
      time: fmtTime(start),
      end_date: fmtDate(end),
      end_time: fmtTime(end),
      otkazano: ev.otkazano,
      ima_vise_termina: ev.ima_vise_termina,
      termini: ev.termini,
      category: ev.category?.naziv,
      category_idguid: ev.category?.idguid,
      location: ev.lokacija?.naziv,
      institution: ev.institucija?.naziv,
      institution_idguid: ev.institucija?.idguid,
    };
  });

  return (
    <Page>
      <SingleManifestation events={events} manifestation={manifestation} />
      <RightColumn>
        <UpcomingEvents events={allEvents} />
        <WeatherForecast3Day />
      </RightColumn>
    </Page>
  );
}
