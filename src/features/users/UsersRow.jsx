// import { useNavigate } from 'react-router-dom';

import { useDeleteUser } from './useDeleteUser';

import Table from '../../ui/Table';
import Modal from '../../ui/Modal';
import Menus from '../../ui/Menus';
import ConfirmDelete from '../../ui/ConfirmDelete';

import { HiTrash, HiPencilSquare } from 'react-icons/hi2';
import Cell from '../../ui/Cell';
// import CreateLocationForm from './CreateLocationForm';

function UserRow({ user, index }) {
  //   const navigate = useNavigate();
  const { mutate: deleteUser, isPending } = useDeleteUser();

  const { idguid, email, first_name, last_name } = user;

  function handleDelete(id) {
    deleteUser(id);
  }

  return (
    <Table.Row>
      <Cell>{index + 1}</Cell>
      <Cell>{email}</Cell>
      <Cell>{first_name}</Cell>
      <Cell>{last_name}</Cell>
      <Cell>Neka institucija</Cell>
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
              <Modal.Open opens="Izbriši korisnika">
                <Menus.Button title="Izbriši korisnika" icon={<HiTrash />}>
                  Izbriši
                </Menus.Button>
              </Modal.Open>
            </Menus.List>
          </Menus.Menu>
          <Modal.Window name="Uredi korisnika" size="large">
            {/* <CreateLocationForm locationToEdit={location} user_email={user_email} /> */}
          </Modal.Window>
          <Modal.Window name="Izbriši korisnika" size="small">
            <ConfirmDelete
              resourceName="user"
              disabled={isPending}
              onConfirm={() => handleDelete(idguid)}
            />
          </Modal.Window>
        </Modal>
      </Cell>
    </Table.Row>
  );
}

export default UserRow;
