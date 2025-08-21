import { useState } from 'react';
import CalendarSpinner from '../../ui/CalendarSpinner';
import Empty from '../../ui/Empty';
import Heading from '../../ui/Heading';
import Menus from '../../ui/Menus';
import Pagination from '../../ui/Pagination';
import Table from '../../ui/Table';
import CategoryRow from './CategoryRow';
import { useGetCategories } from './useCategories';
import { PAGE_SIZE } from '../../utils/constants';

const ZERO = '00000000-0000-0000-0000-000000000000';

export default function CategoriesTable() {
  const [query, setQuery] = useState({
    page: 1,
    limit: PAGE_SIZE ?? 10,
    search: undefined,
    sort: { field: 'naziv', order: 'ASC' },
    filters: {
      // parent_idguid: ZERO | 'NOT_ZERO' | undefined
    },
  });

  const { isLoading, categories, error, count, page, limit } = useGetCategories(query);

  if (isLoading) return <CalendarSpinner />;
  if (error) return <Empty />;

  return (
    <Menus>
      <Table
        server
        columns=".2fr 1fr .3fr 2fr .2fr"
        query={query}
        onQueryChange={setQuery}
        total={count}
      >
        {/* Globalni search */}
        <Table.Toolbar enableSearch placeholder="Pretraži kategorije..." />

        {/* Header sa sortom + filteri definisani kroz config */}
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
              id: 'ikona',
              label: 'Ikona',
              field: 'ikona',
              sortable: false,
            },
            {
              id: 'grupa',
              label: 'Grupa',
              field: 'parent_idguid',
              sortable: false,
              filter: {
                type: 'select',
                key: 'parent_idguid',
                options: [
                  { value: ZERO, label: 'Samo grupe' },
                  // { value: !ZERO, label: 'Samo podkategorije' },
                ],
                placeholder: '— Sve —',
              },
              // filter: {
              //   type: 'select',
              //   key: 'parent_idguid',
              //   options: [
              //     { value: ZERO, label: 'Samo grupe' },
              //     { value: 'NOT_ZERO', label: 'Samo podkategorije' },
              //   ],
              //   placeholder: '— Sve —',
              // },
            },
            { id: 'actions', label: '' },
          ]}
        />

        <Table.FilterRow
          config={[
            { id: 'index', label: '#' },
            {
              id: 'naziv',
              label: 'Naziv',
              field: 'naziv',
            },
            {
              id: 'ikona',
              label: 'Ikona',
              field: 'ikona',
            },
            {
              id: 'grupa',
              label: 'Grupa',
              field: 'parent_idguid',
              filter: {
                type: 'select',
                key: 'parent_idguid',
                options: [
                  { value: ZERO, label: 'Samo grupe' },
                  // { value: !ZERO, label: 'Samo podkategorije' },
                ],
                placeholder: '— Sve —',
              },
              // filter: {
              //   type: 'select',
              //   key: 'parent_idguid',
              //   options: [
              //     { value: ZERO, label: 'Samo grupe' },
              //     { value: 'NOT_ZERO', label: 'Samo podkategorije' },
              //   ],
              //   placeholder: '— Sve —',
              // },
            },
            { id: 'actions', label: '' },
          ]}
        />

        <Table.Body
          data={categories}
          render={(category, i) => (
            <CategoryRow index={(page - 1) * limit + i} key={category.idguid} category={category} />
          )}
        />

        <Table.Footer>
          <Pagination
            count={count ?? 0}
            page={page ?? query.page}
            pageSize={limit ?? query.limit}
            onPageChange={(p) => setQuery((q) => ({ ...q, page: p }))}
          />
        </Table.Footer>
      </Table>
    </Menus>
  );
}
