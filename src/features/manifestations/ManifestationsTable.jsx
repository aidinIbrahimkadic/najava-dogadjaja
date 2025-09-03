import { useGetManifestations } from './useManifestations';
import CalendarSpinner from '../../ui/CalendarSpinner';
import Empty from '../../ui/Empty';
import Table from '../../ui/Table';
import ManifestationRow from './ManifestationRow';
import Pagination from '../../ui/Pagination';
import Menus from '../../ui/Menus';

import { useState } from 'react';
import { PAGE_SIZE } from '../../utils/constants'; // ako već imaš
import { useGetLocations } from '../locations/useLocations';
import { useGetInstitutions } from '../institutions/useInstitutions';

export default function ManifestationsTable() {
  const [query, setQuery] = useState({
    page: 1,
    limit: PAGE_SIZE ?? 10,
    search: undefined,
    sort: { field: 'start_time', order: 'ASC' },
    filters: {}, // npr. { title: '...' , category_idguid: '...' , cijena_gte: 0, start_date_from: '2025-08-01', ... }
  });

  const { manifestations, isLoading, error, count } = useGetManifestations(query);
  const { locations, isLoading: isLoadingLocations } = useGetLocations();
  const { institutions, isLoading: isLoadingInstitutions } = useGetInstitutions();

  if (isLoading || isLoadingLocations || isLoadingInstitutions) return <CalendarSpinner />;
  if (error) return <Empty />;

  const locationOptions = locations?.map((l) => {
    return {
      value: l.idguid,
      label: l.naziv,
    };
  });

  const institutionOptions = institutions?.map((i) => {
    return {
      value: i.idguid,
      label: i.naziv,
    };
  });

  return (
    <Menus>
      <Table
        server
        columns=".1fr 1.5fr 1fr 1fr .8fr .8fr .2fr"
        query={query}
        onQueryChange={setQuery}
        total={count}
      >
        <Table.Toolbar enableSearch placeholder="Pretraži manifestacije..." />

        <Table.Header
          config={[
            { id: 'index', label: '#' },
            {
              id: 'title',
              label: 'Naziv',
              field: 'title',
              sortable: true,
              // filter: { type: 'text', placeholder: 'Naziv' },
            },
            {
              id: 'location',
              label: 'Lokacija',
              field: 'location',
              // sortable: true,
              filter: { type: 'select', options: locationOptions },
            },
            {
              id: 'institution',
              label: 'Institucija',
              field: 'institution',
              // sortable: true,
              filter: { type: 'select', options: institutionOptions },
            },
            {
              id: 'start_time',
              label: 'Datum početka',
              field: 'start_time',
              sortable: true,
            },
            {
              id: 'end_time',
              label: 'Datum kraja',
              field: 'end_time',
              sortable: true,
            },
            { id: 'actions', label: '' },
          ]}
        />
        <Table.FilterRow
          config={[
            { id: 'index', label: '#' },
            {
              id: 'title',
              label: 'Naziv',
              field: 'title',
            },
            {
              id: 'location',
              label: 'Lokacija',
              field: 'location',
              filter: { type: 'select', options: locationOptions },
            },
            {
              id: 'institution',
              label: 'Institucija',
              field: 'institution',
              // sortable: true,
              filter: { type: 'select', options: institutionOptions },
            },
            {
              id: 'start_time',
              label: 'Datum početka',
              field: 'start_time',
            },
            {
              id: 'end_time',
              label: 'Datum kraja',
              field: 'end_time',
            },
            { id: 'actions', label: '' },
          ]}
        />

        <Table.Body
          data={manifestations.manifestacije}
          render={(manifestation, i) => (
            <ManifestationRow
              index={(query.page - 1) * query.limit + i}
              key={manifestation.idguid}
              manifestation={manifestation}
            />
          )}
        />

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
