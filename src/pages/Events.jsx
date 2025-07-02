import AddEvent from '../features/events/AddEvent';
import EventsTable from '../features/events/EventsTable';
import Heading from '../ui/Heading';
import Row from '../ui/Row';

export default function Events() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All events</Heading>
      </Row>
      <Row type="vertical">
        <AddEvent />
        <EventsTable />
      </Row>
    </>
  );
}
