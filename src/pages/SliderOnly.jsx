import { useGetUpcomingEvents } from '../features/front/useUpcomingEvents';
import CalendarSpinner from '../ui/CalendarSpinner';
import PosterCarousel from '../ui/Front/PosterCarousel';

export default function SliderOnly() {
  const { upcomingEvents, isLoading } = useGetUpcomingEvents();

  if (isLoading) <CalendarSpinner />;
  return <PosterCarousel upcomingEvents={upcomingEvents} />;
}
