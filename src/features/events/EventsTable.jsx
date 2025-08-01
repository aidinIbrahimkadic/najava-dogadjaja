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
      <Table columns=".1fr 1fr 1fr 1fr 1.5fr 1fr 1fr  .3fr .2fr">
        <Table.Header>
          <div>#</div>
          <div>Naziv</div>
          <div>Poster</div>
          <div>Cijena</div>
          <div>Lokacija</div>
          <div>Kategorija</div>
          <div>Datum početka</div>
          <div>Javno</div>
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
