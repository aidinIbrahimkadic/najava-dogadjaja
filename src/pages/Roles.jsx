import AddRole from '../features/roles/AddRole';
import RolesTable from '../features/roles/RolesTable';
import Heading from '../ui/Heading';
import Row from '../ui/Row';

export default function Roles() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Sve role</Heading>
        <AddRole />
      </Row>
      <Row type="vertical">
        <RolesTable />
      </Row>
    </>
  );
}
