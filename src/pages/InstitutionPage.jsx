import { useParams } from 'react-router-dom';
import { useGetUpcomingEvents } from '../features/front/useUpcomingEvents';
import CalendarSpinner from '../ui/CalendarSpinner';
import { Page } from '../ui/Front/Page';
import { RightColumn } from '../ui/Front/RightColumn';
import { UpcomingEvents } from '../ui/Front/UpcomingEvents';
import { WeatherForecast3Day } from '../ui/Front/WeatherForecast3Day';

export default function InstitutionPage() {
  const { isLoading: isLoadingEvents, upcomingEvents } = useGetUpcomingEvents();

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

  const { id } = useParams();
  console.log('Institution ID:', id);

  if (isLoadingEvents) {
    <CalendarSpinner />;
  }

  return (
    <>
      <Page>
        <h1>{id}</h1>
        <RightColumn>
          <UpcomingEvents events={allEvents} />
          <WeatherForecast3Day />
        </RightColumn>
      </Page>
    </>
  );
}
