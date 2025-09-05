import InstitutionsTable from '../features/institutions/InstitutionsTable';
import Heading from '../ui/Heading';
import AddInstitution from '../features/institutions/AddInstitution.jsx';
import Row from '../ui/Row';
import { useUserPermissions } from '../features/authentication/useUserPermissions';
import Spinner from '../ui/Spinner';

export default function Institutions() {
  const { isLoading, hasPermission } = useUserPermissions();

  if (isLoading) <Spinner />;
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Sve institucije</Heading>
        {hasPermission('events_institucije_delete') && <AddInstitution />}
      </Row>
      <Row type="vertical">
        <InstitutionsTable />
      </Row>
    </>
  );
}
