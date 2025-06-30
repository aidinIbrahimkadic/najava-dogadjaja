import { useGetEvents } from './useEvents';
import { usePostEvent } from './usePostEvent';
import CalendarSpinner from '../../ui/CalendarSpinner';
import Empty from '../../ui/Empty';
import Table from '../../ui/Table';
import EventRow from './EventRow';
import Pagination from '../../ui/Pagination';
import Menus from '../../ui/Menus';

export default function EventsTable() {
  const { events, isLoading, error, count } = useGetEvents();
  const { isPending, postEvent } = usePostEvent();

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

  return (
    <Menus>
      <Table columns=".2fr 2fr 2fr 2fr 2.5fr 1fr 1fr 1fr 1fr 1fr .2fr">
        <Table.Header>
          <div>#</div>
          <div>Title</div>
          <div>Location</div>
          <div>Category</div>
          <div>Description</div>
          <div>Image_url</div>
          <div>Public</div>
          <div>Start Date</div>
          <div>End Date</div>
          <div></div>
        </Table.Header>
        <Table.Body
          data={events}
          render={(event, i) => <EventRow index={i} key={event.idguid} event={event} />}
        />
        <Table.Footer>
          <Pagination count={count} />
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
    </Menus>
  );
}
