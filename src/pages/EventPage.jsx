import { useParams } from 'react-router-dom';
import { useGetEventById } from '../features/front/useEventById';
import { useGetUpcomingEvents } from '../features/front/useUpcomingEvents';
import CalendarSpinner from '../ui/CalendarSpinner';
import { Page } from '../ui/Front/Page';
import { RightColumn } from '../ui/Front/RightColumn';
import SingleEvent from '../ui/Front/SingleEvent';
import { UpcomingEvents } from '../ui/Front/UpcomingEvents';
import { WeatherForecast3Day } from '../ui/Front/WeatherForecast3Day';

export default function EventPage() {
  const { id } = useParams();
  const { isLoading: isLoadingEvents, upcomingEvents } = useGetUpcomingEvents();
  const { isLoading: isLoadingEvent, event } = useGetEventById(id);

  // Mapirajmo i start i end (fallback end=start)
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
      category: ev.category?.naziv,
      category_idguid: ev.category?.idguid,
      location: ev.lokacija?.naziv,
      institution: ev.institucija?.naziv,
      institution_idguid: ev.institucija?.idguid,
    };
  });

  if (isLoadingEvents || isLoadingEvent) {
    return <CalendarSpinner />;
  }

  return (
    <Page>
      <SingleEvent event={event?.data} />
      <RightColumn>
        <UpcomingEvents events={allEvents} />
        <WeatherForecast3Day />
      </RightColumn>
    </Page>
  );
}
