import { useGetEvents } from './useEvents';
import CalendarSpinner from '../../ui/CalendarSpinner';
import Empty from '../../ui/Empty';
import Table from '../../ui/Table';
import EventRow from './EventRow';
import Pagination from '../../ui/Pagination';
import Menus from '../../ui/Menus';
import { useGetCategories } from '../categories/useCategories';

import { useState } from 'react';
import { PAGE_SIZE } from '../../utils/constants'; // ako već imaš
import { useGetLocations } from '../locations/useLocations';

export default function EventsTable() {
  const [query, setQuery] = useState({
    page: 1,
    limit: PAGE_SIZE ?? 10,
    search: undefined,
    sort: { field: 'start_date', order: 'ASC' },
    filters: {}, // npr. { title: '...' , category_idguid: '...' , cijena_gte: 0, start_date_from: '2025-08-01', ... }
  });

  const { events, isLoading, error, count } = useGetEvents(query);
  const { categories, isLoading: isLoadingCategories } = useGetCategories();
  const { locations, isLoading: isLoadingLocations } = useGetLocations();

  if (isLoading || isLoadingCategories || isLoadingLocations) return <CalendarSpinner />;
  if (error) return <Empty />;

  const categoryOptions = categories.map((c) => {
    return {
      value: c.idguid,
      label: c.naziv,
    };
  });

  const locationOptions = locations?.map((l) => {
    return {
      value: l.idguid,
      label: l.naziv,
    };
  });

  return (
    <Menus>
      <Table
        server
        columns=".1fr 1.5fr .5fr 1fr .8fr 1fr  .3fr .2fr"
        query={query}
        onQueryChange={setQuery}
        total={count}
      >
        <Table.Toolbar enableSearch placeholder="Pretraži događaje..." />

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
              id: 'cijena',
              label: 'Cijena',
              field: 'cijena',
              sortable: false,
              // filter: { type: 'numberRange' },
            },
            {
              id: 'lokacija',
              label: 'Lokacija',
              field: 'location_idguid',
              // sortable: true,
              filter: { type: 'select', options: locationOptions },
            },
            {
              id: 'kategorija',
              label: 'Kategorija',
              field: 'category_idguid',
              // sortable: true,
              filter: { type: 'select', options: categoryOptions },
            },
            {
              id: 'start_date',
              label: 'Datum početka',
              field: 'start_date',
              sortable: true,
              filter: { type: 'dateRange' },
            },
            {
              id: 'is_public',
              label: 'Javno',
              field: 'is_public',
              sortable: true,
              filter: { type: 'boolean' },
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
              // filter: { type: 'text', placeholder: 'Naziv' },
            },
            { id: 'cijena', label: 'Cijena', field: 'cijena' },
            {
              id: 'lokacija',
              label: 'Lokacija',
              field: 'location_idguid',
              filter: { type: 'select', options: locationOptions },
            },
            {
              id: 'kategorija',
              label: 'Kategorija',
              field: 'category_idguid',
              filter: { type: 'select', options: categoryOptions },
            },
            {
              id: 'start_date',
              label: 'Datum početka',
              field: 'start_date',
              filter: { type: 'dateRange' },
            },
            { id: 'is_public', label: 'Javno', field: 'is_public', filter: { type: 'boolean' } },
            { id: 'actions', label: '' },
          ]}
        />

        <Table.Body
          data={events}
          render={(event, i) => (
            <EventRow index={(query.page - 1) * query.limit + i} key={event.idguid} event={event} />
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
