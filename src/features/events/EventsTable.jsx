import { useGetEvents } from './useEvents';
import CalendarSpinner from '../../ui/CalendarSpinner';
import Empty from '../../ui/Empty';
import Table from '../../ui/Table';
import EventRow from './EventRow';
import Pagination from '../../ui/Pagination';
import Menus from '../../ui/Menus';

export default function EventsTable() {
  const { events, isLoading, error, count } = useGetEvents();

  if (isLoading) return <CalendarSpinner />;
  if (error) return <Empty />;

  return (
    <Menus>
      <Table columns=".2fr 2fr 2fr 2fr 2.5fr 1fr 1fr 1fr 1fr 1fr .2fr">
        <Table.Header>
          <div>#</div>
          <div>Title</div>
          <div>Location</div>
          <div>Category</div>
          <div>Description</div>
          <div>Image url</div>
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
    </Menus>
  );
}
