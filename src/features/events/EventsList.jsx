import { useGetEvents } from './useEvents';
import { usePostEvent } from './usePostEvent';
import CalendarSpinner from '../../ui/CalendarSpinner';
import Empty from '../../ui/Empty';
import { useDeleteEvent } from './useDeleteEvent';
import Table from '../../ui/Table';
import Pagination from '../../ui/Pagination';
import EventRow from './EventRow';

export default function EventsList() {
  const { events, isLoading, error } = useGetEvents();
  const { isPending, postEvent } = usePostEvent();
  const { mutate: deleteEvent } = useDeleteEvent();

  if (isLoading) return <CalendarSpinner />;
  if (error) return <Empty />;

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

  function handleDelete(id) {
    deleteEvent(id);
  }

  return (
    <>
      <Table columns="0.6fr 2fr 2.4fr 1.4fr  3.2rem">
        <Table.Header>
          <div>Title</div>
          <div>Location</div>
          <div>Start date</div>
          <div>End date</div>
          <div></div>
        </Table.Header>

        {/* <Table.Body data={events} render={(event) => <EventRow key={event.id} event={event} />} /> */}
        <Table.Body>
          {events?.data.map((event) => (
            <Table.Row key={event.id}>
              <div>{event.title}</div>
              <div>{event.location}</div>
              <div>{event.start_date}</div>
              <div>{event.end_date}</div>
              <button onClick={() => handleDelete(event.idguid)}>Delete</button>
              <div></div>
            </Table.Row>
          ))}
        </Table.Body>

        <Table.Footer>
          <Pagination count={15} />
        </Table.Footer>
      </Table>

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
          {isPending ? 'Posting...' : 'Post'}
        </button>
      </form>
    </>
  );
}
