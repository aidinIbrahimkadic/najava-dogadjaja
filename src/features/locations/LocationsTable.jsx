import { useState } from 'react';
import { useGetLocations } from './useLocations';
import CalendarSpinner from '../../ui/CalendarSpinner';
import Empty from '../../ui/Empty';
import Table from '../../ui/Table';
import Pagination from '../../ui/Pagination';
import Menus from '../../ui/Menus';
import LocationRow from './LocationRow';
import { PAGE_SIZE } from '../../utils/constants';

export default function LocationsTable() {
  // 1) Kontrolisani query state
  const [query, setQuery] = useState({
    page: 1,
    limit: PAGE_SIZE ?? 10,
    search: undefined,
    sort: { field: 'naziv', order: 'ASC' }, // prilagodi prema backendu
    filters: {
      // npr. naziv: '', adresa: '', mjesto: ''
    },
  });

  // 2) Server fetch (sa prefetchom u hooku)
  const { locations, isLoading, error, count } = useGetLocations(query);

  if (isLoading) return <CalendarSpinner />;
  if (error) return <Empty />;

  return (
    <Menus>
      <Table
        server
        columns=".1fr 2fr  2fr 1fr .1fr"
        query={query}
        onQueryChange={setQuery}
        total={count}
      >
        {/* Globalni search */}
        <Table.Toolbar enableSearch placeholder="Pretraži lokacije..." />

        {/* Header sa sort indikatorima */}
        <Table.Header
          config={[
            { id: 'index', label: '#' },
            {
              id: 'naziv',
              label: 'Naziv',
              field: 'naziv',
              sortable: true,
            },
            {
              id: 'adresa',
              label: 'Adresa',
              field: 'adresa',
              sortable: false,
            },
            {
              id: 'mjesto',
              label: 'Mjesto',
              field: 'mjesto',
              sortable: true,
            },
            { id: 'actions', label: '' },
          ]}
        />

        {/* Red s filterima po kolonama */}
        <Table.FilterRow
          config={[
            { id: 'index', label: '#' },
            {
              id: 'naziv',
              label: 'Naziv',
              field: 'naziv',
            },
            {
              id: 'adresa',
              label: 'Adresa',
              field: 'adresa',
            },
            {
              id: 'mjesto',
              label: 'Mjesto',
              field: 'mjesto',
            },
            { id: 'actions', label: '' },
          ]}
        />

        {/* Tijelo */}
        <Table.Body
          data={locations}
          render={(location, i) => (
            <LocationRow
              index={(query.page - 1) * query.limit + i}
              key={location.idguid}
              location={location}
            />
          )}
        />

        {/* Paginacija (controlled) */}
        <Table.Footer>
          <Pagination
            count={count}
            page={query.page}
            pageSize={query.limit}
            onPageChange={(p) => setQuery((q) => ({ ...q, page: p }))}
          />
        </Table.Footer>
      </Table>
    </Menus>
  );
}
