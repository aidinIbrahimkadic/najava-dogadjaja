// import AddLocation from '../features/locations/AddLocation';
import UsersTable from '../features/users/UsersTable';
import Heading from '../ui/Heading';
import Row from '../ui/Row';

export default function Users() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Svi korisnici</Heading>
        {/* <AddLocation /> */}
      </Row>
      <Row type="vertical">
        <UsersTable />
      </Row>
    </>
  );
}
