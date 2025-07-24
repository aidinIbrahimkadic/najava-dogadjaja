import AddLocation from '../features/locations/AddLocation';
import LocationsTable from '../features/locations/LocationsTable';
import Heading from '../ui/Heading';
import Row from '../ui/Row';

export default function Locations() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Sve lokacije</Heading>
        <AddLocation />
      </Row>
      <Row type="vertical">
        <LocationsTable />
      </Row>
    </>
  );
}
