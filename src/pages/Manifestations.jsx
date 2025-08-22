import AddManifestation from '../features/manifestations/AddManifestation';
import ManifestationsTable from '../features/manifestations/ManifestationsTable';
import Heading from '../ui/Heading';
import Row from '../ui/Row';

export default function Manifestations() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Sve manifestacije</Heading>
        <AddManifestation />
      </Row>
      <Row type="vertical">
        <ManifestationsTable />
      </Row>
    </>
  );
}
