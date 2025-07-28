import InstitutionsTable from '../features/institutions/InstitutionsTable';
import Heading from '../ui/Heading';
import AddInstitution from '../features/institutions/AddInstitution.jsx';
import Row from '../ui/Row';

export default function Institutions() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Sve institucije</Heading>
        <AddInstitution />
      </Row>
      <Row type="vertical">
        <InstitutionsTable />
      </Row>
    </>
  );
}
