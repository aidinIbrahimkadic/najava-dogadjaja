// // import { useGetInstitutions } from './useInstitutions';
// // import CalendarSpinner from '../../ui/CalendarSpinner';
// // import Empty from '../../ui/Empty';
// // import Table from '../../ui/Table';
// // import Pagination from '../../ui/Pagination';
// // import Menus from '../../ui/Menus';
// // import InstitutionRow from './InstitutionsRow';

// // export default function InstitutionsTable() {
// //   const { institutions, isLoading, error, count } = useGetInstitutions();
// //   if (isLoading) return <CalendarSpinner />;

// //   if (error) return <Empty />;

// //   return (
// //     <Menus>
// //       <Table columns=".1fr 1fr 2fr .1fr">
// //         <Table.Header>
// //           <div>#</div>
// //           <div>Naziv</div>
// //           <div>Opis</div>
// //           <div></div>
// //         </Table.Header>
// //         <Table.Body
// //           data={institutions.data}
// //           render={(institution, i) => (
// //             <InstitutionRow index={i} key={institution.idguid} institution={institution} />
// //           )}
// //         />
// //         <Table.Footer>
// //           <Pagination count={count} />
// //         </Table.Footer>
// //       </Table>
// //     </Menus>
// //   );
// // }

// // features/institutions/InstitutionsTable.jsx
// import { useState } from 'react';
// import { useGetInstitutions } from './useInstitutions';
// import CalendarSpinner from '../../ui/CalendarSpinner';
// import Empty from '../../ui/Empty';
// import Table from '../../ui/Table';
// import Pagination from '../../ui/Pagination';
// import Menus from '../../ui/Menus';
// import InstitutionRow from './InstitutionsRow';
// import { PAGE_SIZE } from '../../utils/constants';

// export default function InstitutionsTable() {
//   // Kontrolisani server-side upit
//   const [query, setQuery] = useState({
//     page: 1,
//     limit: PAGE_SIZE ?? 10,
//     search: undefined,
//     sort: { field: 'naziv', order: 'ASC' }, // prilagodi backend polju
//     filters: {
//       // npr. naziv: '', opis: ''
//     },
//   });

//   const { institutions, isLoading, error, count, page, limit } = useGetInstitutions(query);

//   if (isLoading) return <CalendarSpinner />;
//   if (error) return <Empty />;

//   return (
//     <Menus>
//       <Table
//         server
//         columns=".1fr 1fr 2fr .1fr"
//         query={query}
//         onQueryChange={setQuery}
//         total={count}
//       >
//         {/* Globalni Search */}
//         <Table.Toolbar enableSearch placeholder="Pretraži institucije..." />

//         {/* Header sa sortom i kolonskim filterima */}
//         <Table.Header
//           config={[
//             { id: 'index', label: '#' },
//             {
//               id: 'naziv',
//               label: 'Naziv',
//               field: 'naziv',
//               sortable: true,
//             },
//             {
//               id: 'ime_direktora',
//               label: 'Direktor',
//               field: 'ime_direktora',
//               sortable: false,
//             },
//             { id: 'actions', label: '' },
//           ]}
//         />

//         <Table.FilterRow
//           config={[
//             { id: 'index', label: '#' },
//             {
//               id: 'naziv',
//               label: 'Naziv',
//               field: 'naziv',
//             },
//             {
//               id: 'opis',
//               label: 'Opis',
//               field: 'opis',
//             },
//             { id: 'actions', label: '' },
//           ]}
//         />

//         <Table.Body
//           data={institutions}
//           render={(institution, i) => (
//             <InstitutionRow
//               index={(page - 1) * limit + i}
//               key={institution.idguid}
//               institution={institution}
//             />
//           )}
//         />

//         <Table.Footer>
//           <Pagination
//             count={count ?? 0}
//             page={page ?? query.page}
//             pageSize={limit ?? query.limit}
//             onPageChange={(p) => setQuery((q) => ({ ...q, page: p }))}
//           />
//         </Table.Footer>
//       </Table>
//     </Menus>
//   );
// }

// features/institutions/InstitutionsTable.jsx
import { useState } from 'react';
import { useGetInstitutions } from './useInstitutions';
import CalendarSpinner from '../../ui/CalendarSpinner';
import Empty from '../../ui/Empty';
import Table from '../../ui/Table';
import Pagination from '../../ui/Pagination';
import Menus from '../../ui/Menus';
import InstitutionRow from './InstitutionsRow';
import { PAGE_SIZE, SUPER_ADMIN_ROLE } from '../../utils/constants';
import { useUserPermissions } from '../authentication/useUserPermissions';
import { useGetUser } from '../users/useUser';

export default function InstitutionsTable() {
  const [query, setQuery] = useState({
    page: 1,
    limit: PAGE_SIZE ?? 10,
    search: undefined,
    sort: { field: 'naziv', order: 'ASC' },
    filters: {},
  });

  // Ko je korisnik i da li je superadmin?
  const { user: userBrief } = useUserPermissions(); // obično sadrži bar idguid
  const { user: userFull } = useGetUser(userBrief?.idguid); // puni podaci + roles + institucija

  const isSuperAdmin = userFull?.data?.roles?.some(
    (r) => r?.name?.toLowerCase() === (SUPER_ADMIN_ROLE || 'super_admin').toLowerCase()
  );

  const myInstitutionId = userFull?.data?.institucija?.idguid;

  // Ako nije superadmin → filtriraj na njegovu instituciju i forsiraj ALL
  const effectiveQuery = isSuperAdmin
    ? query
    : {
        ...query,
        all: true,
        // šaljemo i serveru (ako podrži), a hook će i klijentski filtrirati
        filters: { ...(query.filters || {}), idguid: myInstitutionId },
      };

  const { institutions, isLoading, error, count, page, limit } = useGetInstitutions(effectiveQuery);

  if (isLoading) return <CalendarSpinner />;
  if (error) return <Empty />;

  return (
    <Menus>
      <Table
        server
        columns=".1fr 1fr 2fr .1fr"
        query={query}
        onQueryChange={setQuery}
        total={count}
      >
        <Table.Toolbar enableSearch placeholder="Pretraži institucije..." />

        <Table.Header
          config={[
            { id: 'index', label: '#' },
            { id: 'naziv', label: 'Naziv', field: 'naziv', sortable: true },
            { id: 'ime_direktora', label: 'Direktor', field: 'ime_direktora' },
            { id: 'actions', label: '' },
          ]}
        />

        <Table.FilterRow
          config={[
            { id: 'index', label: '#' },
            { id: 'naziv', label: 'Naziv', field: 'naziv' },
            { id: 'opis', label: 'Opis', field: 'opis' },
            { id: 'actions', label: '' },
          ]}
        />

        <Table.Body
          data={institutions}
          render={(institution, i) => (
            <InstitutionRow
              index={(page - 1) * (limit || 1) + i}
              key={institution.idguid}
              institution={institution}
            />
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
