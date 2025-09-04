// // import { useGetUsers } from './useUsers';
// // import CalendarSpinner from '../../ui/CalendarSpinner';
// // import Empty from '../../ui/Empty';
// // import Table from '../../ui/Table';
// // import Pagination from '../../ui/Pagination';
// // import Menus from '../../ui/Menus';
// // import UserRow from './UsersRow';

// // export default function UsersTable() {
// //   const { users, isLoading, error, count } = useGetUsers();
// //   if (isLoading) return <CalendarSpinner />;

// //   if (error) return <Empty />;

// //   return (
// //     <Menus>
// //       <Table columns=".1fr 2fr  1fr 1fr 1fr 1fr .2fr .1fr">
// //         <Table.Header>
// //           <div>#</div>
// //           <div>Email</div>
// //           <div>Ime</div>
// //           <div>Prezime</div>
// //           <div>Institucija</div>
// //           <div>Uloga</div>
// //           <div>Aktivan</div>
// //           <div></div>
// //         </Table.Header>
// //         <Table.Body
// //           data={users.data.users}
// //           render={(user, i) => <UserRow index={i} key={user.idguid} user={user} />}
// //         />
// //         <Table.Footer>
// //           <Pagination count={count} />
// //         </Table.Footer>
// //       </Table>
// //     </Menus>
// //   );
// // }

// // features/users/UsersTable.jsx
// // features/users/UsersTable.jsx
// import { useState } from 'react';
// import { useGetUsers } from './useUsers';
// import CalendarSpinner from '../../ui/CalendarSpinner';
// import Empty from '../../ui/Empty';
// import Table from '../../ui/Table';
// import Pagination from '../../ui/Pagination';
// import Menus from '../../ui/Menus';
// import UserRow from './UsersRow';
// import { PAGE_SIZE } from '../../utils/constants';
// import { useGetRoles } from '../roles/useRoles';
// import { useGetInstitutions } from '../institutions/useInstitutions';

// export default function UsersTable() {
//   const [query, setQuery] = useState({
//     page: 1,
//     limit: PAGE_SIZE ?? 10, // VAŽNO: šaljemo limit serveru, da "pages" ne bude 13 za 13 total 🙂
//     search: undefined,
//     sort: { field: 'email', order: 'ASC' },
//     filters: {
//       // email: '',
//       // first_name: '',
//       // last_name: '',
//       // institucija_idguid: '',
//       // role_idguid: '',
//       // active: 'true' | 'false',
//     },
//   });

//   const { users, isLoading, error, count, page, limit } = useGetUsers(query);

//   const { institutions: instList, isLoading: loadingInst } = useGetInstitutions({
//     page: 1,
//     limit: 1000,
//   });

//   const { roles: rolesList, isLoading: loadingRoles } = useGetRoles({ page: 1, limit: 1000 });

//   if (isLoading || loadingRoles || loadingInst) return <CalendarSpinner />;
//   if (error) return <Empty />;

//   const institutionOptions = instList.map((i) => ({ value: i.idguid, label: i.naziv })) ?? [];

//   const roleOptions = rolesList.data.roles.map((r) => ({ value: r.idguid, label: r.name })) ?? [];

//   return (
//     <Menus>
//       <Table
//         server
//         columns=".1fr 2fr  1fr 1fr 1fr 1fr .2fr .1fr"
//         query={query}
//         onQueryChange={setQuery}
//         total={count}
//       >
//         <Table.Toolbar enableSearch placeholder="Pretraži korisnike..." />

//         <Table.Header
//           config={[
//             { id: 'index', label: '#' },

//             {
//               id: 'email',
//               label: 'Email',
//               field: 'email',
//               sortable: true,
//             },

//             {
//               id: 'first_name',
//               label: 'Ime',
//               field: 'first_name',
//               sortable: true,
//             },

//             {
//               id: 'last_name',
//               label: 'Prezime',
//               field: 'last_name',
//               sortable: true,
//             },

//             // Ako želiš select za instituciju/ulogu, ovdje dodaš options kao kod Users ranije
//             {
//               id: 'institucija_idguid',
//               label: 'Institucija',
//               field: 'institucija_idguid',
//               sortable: false,
//               filter: {
//                 type: 'select',
//                 options: institutionOptions,
//                 key: 'institucija_idguid',
//                 placeholder: '— Sve —',
//               },
//             },

//             {
//               id: 'role',
//               label: 'Uloga',
//               field: 'role',
//               sortable: false,
//               filter: {
//                 type: 'select',
//                 options: roleOptions,
//                 key: 'role_idguid',
//                 placeholder: '— Sve —',
//               },
//             },

//             {
//               id: 'active',
//               label: 'Aktivan',
//               field: 'active',
//               sortable: true,
//             },

//             { id: 'actions', label: '' },
//           ]}
//         />

//         <Table.FilterRow
//           config={[
//             { id: 'index', label: '#' },
//             {
//               id: 'email',
//               label: 'Email',
//               field: 'email',
//             },
//             {
//               id: 'first_name',
//               label: 'Ime',
//               field: 'first_name',
//             },
//             {
//               id: 'last_name',
//               label: 'Prezime',
//               field: 'last_name',
//             },
//             { id: 'institucija', label: 'Institucija', field: 'institucija' },
//             { id: 'role', label: 'Uloga', field: 'role' },
//             { id: 'active', label: 'Aktivan', field: 'active' },
//             { id: 'actions', label: '' },
//           ]}
//         />

//         <Table.Body
//           data={users}
//           render={(user, i) => (
//             <UserRow index={(page - 1) * limit + i} key={user.idguid} user={user} />
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

// features/users/UsersTable.jsx
import { useState } from 'react';
import { useGetUsers } from './useUsers';
import { useGetInstitutions } from '../institutions/useInstitutions';
import { useGetRoles } from '../roles/useRoles';

import CalendarSpinner from '../../ui/CalendarSpinner';
import Empty from '../../ui/Empty';
import Table from '../../ui/Table';
import Pagination from '../../ui/Pagination';
import Menus from '../../ui/Menus';
import UserRow from './UsersRow';
import { PAGE_SIZE } from '../../utils/constants';

export default function UsersTable() {
  const [query, setQuery] = useState({
    page: 1,
    limit: PAGE_SIZE ?? 10,
    search: undefined,
    sort: { field: 'first_name', order: 'ASC' },
    filters: {
      // email: '',
      // first_name: '',
      // last_name: '',
      // institucija_idguid: '',
      // role_idguid: '',
      // active: 'true' | 'false',
    },
  });

  // Glavni fetch (server-side + prefetch u hooku)
  const { users, isLoading, error, count, page, limit } = useGetUsers(query);

  // Fallback veći limit za selecte
  const { institutions: instList, isLoading: loadingInst } = useGetInstitutions({
    page: 1,
    limit: 1000,
  });
  const { roles: rolesList, isLoading: loadingRoles } = useGetRoles({
    page: 1,
    limit: 1000,
  });

  if (isLoading || loadingInst || loadingRoles) return <CalendarSpinner />;
  if (error) return <Empty />;

  // ⚠️ Ispravno mapiranje (tvoji hookovi vraćaju niz, ne rolesList.data.roles)
  const institutionOptions =
    (instList ?? []).map((i) => ({ value: i.idguid, label: i.naziv })) ?? [];

  const roleOptions =
    rolesList.data.roles.map((r) => ({ value: r.idguid, label: r.naziv ?? r.name })) ?? [];

  return (
    <Menus>
      <Table
        server
        columns=".1fr 1.5fr 1fr 1fr .2fr .1fr"
        query={query}
        onQueryChange={setQuery}
        total={count}
      >
        <Table.Toolbar enableSearch placeholder="Pretraži korisnike..." />

        <Table.Header
          config={[
            { id: 'index', label: '#' },

            {
              id: 'email',
              label: 'Email',
              field: 'email',
              sortable: true,
            },
            // 👇 Select filter po instituciji (šalje ?institucija_idguid=<id>)
            {
              id: 'institucija',
              label: 'Institucija',
              field: 'institucija_idguid',
              sortable: false,
              filter: {
                type: 'select',
                key: 'institucija_idguid',
                options: institutionOptions,
                placeholder: '— Sve —',
              },
            },

            // 👇 Select filter po ulozi (šalje ?role_idguid=<id>)
            {
              id: 'uloga',
              label: 'Uloga',
              field: 'role',
              sortable: false,
              filter: {
                type: 'select',
                key: 'role',
                options: roleOptions,
                placeholder: '— Sve —',
              },
            },

            {
              id: 'active',
              label: 'Aktivan',
              field: 'active',
              sortable: false,
            },

            { id: 'actions', label: '' },
          ]}
        />

        <Table.FilterRow
          config={[
            { id: 'index', label: '#' },

            {
              id: 'email',
              label: 'Email',
              field: 'email',
            },
            {
              id: 'institucija',
              label: 'Institucija',
              field: 'institucija_idguid',
              filter: {
                type: 'select',
                key: 'institucija_idguid',
                options: institutionOptions,
                placeholder: '— Sve —',
              },
            },

            {
              id: 'uloga',
              label: 'Uloga',
              field: 'role',
              filter: {
                type: 'select',
                key: 'role',
                options: roleOptions,
                placeholder: '— Sve —',
              },
            },

            { id: 'active', label: 'Aktivan', field: 'active' },

            { id: 'actions', label: '' },
          ]}
        />

        <Table.Body
          data={users}
          render={(user, i) => (
            <UserRow index={(page - 1) * limit + i} key={user.idguid} user={user} />
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
