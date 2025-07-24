import { useGetLocations } from './useLocations';
import CalendarSpinner from '../../ui/CalendarSpinner';
import Empty from '../../ui/Empty';
import Table from '../../ui/Table';
import Pagination from '../../ui/Pagination';
import Menus from '../../ui/Menus';
import LocationRow from './LocationRow';

export default function LocationsTable() {
  const { locations, isLoading, error, count } = useGetLocations();

  if (isLoading) return <CalendarSpinner />;
  if (error) return <Empty />;

  return (
    <Menus>
      <Table columns=".1fr 2fr 1fr 1.5fr 1fr  1fr .1fr">
        <Table.Header>
          <div>#</div>
          <div>Naziv</div>
          <div>Opis</div>
          <div>Adresa</div>
          <div>Mjesto</div>
          <div>Operater</div>
          <div></div>
        </Table.Header>
        <Table.Body
          data={locations}
          render={(location, i) => (
            <LocationRow index={i} key={location.idguid} location={location} />
          )}
        />
        <Table.Footer>
          <Pagination count={count} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}
