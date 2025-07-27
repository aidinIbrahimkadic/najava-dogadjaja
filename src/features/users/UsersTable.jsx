import { useGetUsers } from './useUsers';
import CalendarSpinner from '../../ui/CalendarSpinner';
import Empty from '../../ui/Empty';
import Table from '../../ui/Table';
import Pagination from '../../ui/Pagination';
import Menus from '../../ui/Menus';
import UserRow from './UsersRow';

export default function UsersTable() {
  const { users, isLoading, error, count } = useGetUsers();
  if (isLoading) return <CalendarSpinner />;

  if (error) return <Empty />;

  return (
    <Menus>
      <Table columns=".1fr 2fr  1fr 1fr 1fr .1fr">
        <Table.Header>
          <div>#</div>
          <div>Email</div>
          <div>Ime</div>
          <div>Prezime</div>
          <div>Institucija</div>
          <div></div>
        </Table.Header>
        <Table.Body
          data={users.data.users}
          render={(user, i) => <UserRow index={i} key={user.idguid} user={user} />}
        />
        <Table.Footer>
          <Pagination count={count} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}
