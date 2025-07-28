import { useGetInstitutions } from './useInstitutions';
import CalendarSpinner from '../../ui/CalendarSpinner';
import Empty from '../../ui/Empty';
import Table from '../../ui/Table';
import Pagination from '../../ui/Pagination';
import Menus from '../../ui/Menus';
import InstitutionRow from './InstitutionsRow';

export default function InstitutionsTable() {
  const { institutions, isLoading, error, count } = useGetInstitutions();
  if (isLoading) return <CalendarSpinner />;

  if (error) return <Empty />;

  return (
    <Menus>
      <Table columns=".1fr 1fr 2fr .1fr">
        <Table.Header>
          <div>#</div>
          <div>Naziv</div>
          <div>Opis</div>
          <div></div>
        </Table.Header>
        <Table.Body
          data={institutions.data}
          render={(institution, i) => (
            <InstitutionRow index={i} key={institution.idguid} institution={institution} />
          )}
        />
        <Table.Footer>
          <Pagination count={count} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}
