import { useGetEvents } from '../features/events/useEvents';
import CalendarSpinner from '../ui/CalendarSpinner';
import Dashboard from '../ui/Dashboard';

export default function DashboardPage() {
  const { isLoading, events } = useGetEvents();

  console.log(events);

  return <>{isLoading ? <CalendarSpinner /> : <Dashboard events={events} />}</>;
}
