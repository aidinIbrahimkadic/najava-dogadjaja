import CalendarSpinner from '../../ui/CalendarSpinner';
import Empty from '../../ui/Empty';
import Table from '../../ui/Table';
import Pagination from '../../ui/Pagination';
import Menus from '../../ui/Menus';
import { useGetRoles } from './useRoles';
import RoleRow from './RolesRow';

export default function RolesTable() {
  const { roles, isLoading, error, count } = useGetRoles();
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
          data={roles.data.roles}
          render={(role, i) => <RoleRow index={i} key={role.idguid} role={role} />}
        />
        <Table.Footer>
          <Pagination count={count} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}
