// import { useNavigate } from 'react-router-dom';

import { useDeleteUser } from './useDeleteUser';

import Table from '../../ui/Table';
import Modal from '../../ui/Modal';
import Menus from '../../ui/Menus';
import ConfirmDelete from '../../ui/ConfirmDelete';

import { HiTrash, HiPencilSquare, HiLockClosed } from 'react-icons/hi2';
import Cell from '../../ui/Cell';
import CreateUserForm from './CreateUserForm';
import { useGetUser } from './useUser';
import EditUserPasswordForm from './EditUserPasswordForm';
import Spinner from '../../ui/Spinner';
import { useUserPermissions } from '../authentication/useUserPermissions';
import Checkbox from '../../ui/Checkbox';
// import CreateLocationForm from './CreateLocationForm';

function UserRow({ user, index }) {
  //   const navigate = useNavigate();
  const { mutate: deleteUser, isPending } = useDeleteUser();
  const { isLoading, hasPermission } = useUserPermissions();

  const { idguid, email, first_name, last_name, institucija, active } = user;

  const { isLoading: isLoadingMoreOnUser, user: moreOnUser } = useGetUser(idguid);

  // const fullUser = { ...user, role: moreOnUser?.data?.roles[0] };
  function handleDelete(id) {
    deleteUser(id);
  }

  {
    isLoading && <Spinner />;
  }

  return (
    <Table.Row>
      <Cell>{index + 1}</Cell>
      <Cell>{email}</Cell>
      <Cell>{first_name}</Cell>
      <Cell>{last_name}</Cell>
      <Cell>{institucija?.naziv}</Cell>
      <Cell>
        {isLoadingMoreOnUser ? <Spinner size="small" /> : moreOnUser?.data?.roles[0]?.name}
      </Cell>
      <Cell>
        <Checkbox checked={active} disabled />
      </Cell>
      <Cell>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={idguid} />
            <Menus.List id={idguid}>
              <Modal.Open opens="Uredi korisnika">
                <Menus.Button title="Uredi korisnika" icon={<HiPencilSquare />}>
                  Uredi
                </Menus.Button>
              </Modal.Open>
              {hasPermission('admin_users_save') && (
                <Modal.Open opens="Izmijeni password">
                  <Menus.Button title="Izmijeni password" icon={<HiLockClosed />}>
                    Izmijeni password
                  </Menus.Button>
                </Modal.Open>
              )}
              {hasPermission('admin_users_delete') && (
                <Modal.Open opens="Izbriši korisnika">
                  <Menus.Button title="Izbriši korisnika" icon={<HiTrash />}>
                    Izbriši
                  </Menus.Button>
                </Modal.Open>
              )}
            </Menus.List>
          </Menus.Menu>
          {hasPermission('admin_users_save') && (
            <>
              <Modal.Window name="Uredi korisnika" size="large">
                <CreateUserForm userToEdit={user} />
              </Modal.Window>
              <Modal.Window name="Izmijeni password" size="large">
                <EditUserPasswordForm userToEdit={user} />
              </Modal.Window>
            </>
          )}

          {hasPermission('admin_users_delete') && (
            <Modal.Window name="Izbriši korisnika" size="small">
              <ConfirmDelete
                resourceName="user"
                disabled={isPending}
                onConfirm={() => handleDelete(idguid)}
              />
            </Modal.Window>
          )}
        </Modal>
      </Cell>
    </Table.Row>
  );
}

export default UserRow;
