import { useGetEvents } from './useGetEvents';
import { usePostEvent } from './usePostEvent';
import CalendarSpinner from '../../ui/CalendarSpinner';

export default function EventsTable() {
  const { isLoading, events } = useGetEvents();
  const { isPending, postEvent } = usePostEvent();

  if (isLoading) return <CalendarSpinner />;
  console.log(events);

  function handleSubmit(e) {
    e.preventDefault();
    const title = e.target.title.value;
    const description = e.target.description.value;
    const location = e.target.location.value;
    const start_date = e.target.start_date.value;
    const is_public = true;
    const end_date = e.target.end_date.value;

    postEvent({ title, description, start_date, end_date, is_public, location });
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Unesi title: </label>
      <input type="text" id="title" required />
      <label htmlFor="description">Unesi description:</label>
      <input type="text" id="description" required />
      <label htmlFor="location">Unesi location:</label>
      <input type="text" id="location" required />
      <label htmlFor="start_date">Odaberi start datum:</label>
      <input type="date" id="start_date" />
      <label htmlFor="end_date">Odaberi end datum:</label>
      <input type="date" id="end_date" />

      <button type="submit" disabled={isPending}>
        Post
      </button>
    </form>
  );
}
