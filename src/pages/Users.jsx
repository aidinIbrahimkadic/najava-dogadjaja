import AddUser from '../features/users/AddUser';
import UsersTable from '../features/users/UsersTable';
import Heading from '../ui/Heading';
import Row from '../ui/Row';

export default function Users() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Svi korisnici</Heading>
        <AddUser />
      </Row>
      <Row type="vertical">
        <UsersTable />
      </Row>
    </>
  );
}
