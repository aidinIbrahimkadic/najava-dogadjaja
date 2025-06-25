import { useGetEvents } from './useGetEvents';
import { usePostEvent } from './usePostEvent';
import CalendarSpinner from '../../ui/CalendarSpinner';

export default function EventsTable() {
  const { isLoading, events } = useGetEvents();
  const { isPending, postEvent } = usePostEvent();

  console.log(events);
  if (isLoading) return <CalendarSpinner />;

  function handleSubmit(e) {
    e.preventDefault();
    const title = e.target.title.value;
    const description = e.target.description.value;
    const location = e.target.location.value;
    const start_date = e.target.start_date.value;
    const is_public = true;
    const end_date = e.target.end_date.value;
    const category_idguid = '4a5b1adb-516a-4f90-a90a-b6af65659545';
    postEvent({ title, description, start_date, end_date, is_public, location, category_idguid });
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Location</th>
            <th>Start date</th>
            <th>End date</th>
          </tr>
        </thead>
        <tbody>
          {events.data.map((event) => (
            <tr key={event.id}>
              <td>{event.title}</td>
              <td>{event.location}</td>
              <td>{event.start_date}</td>
              <td>{event.end_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
    </>
  );
}
