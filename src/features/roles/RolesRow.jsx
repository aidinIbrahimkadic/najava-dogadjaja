// import { useNavigate } from 'react-router-dom';

import { useDeleteRole } from './useDeleteRole';

import Table from '../../ui/Table';
import Modal from '../../ui/Modal';
import Menus from '../../ui/Menus';
import ConfirmDelete from '../../ui/ConfirmDelete';

import { HiTrash, HiPencilSquare } from 'react-icons/hi2';
import Cell from '../../ui/Cell';
import CreateRoleForm from './CreateRoleForm';

function RoleRow({ role, index }) {
  const { mutate: deleteRole, isPending } = useDeleteRole();

  const { idguid, name, description } = role;

  function handleDelete(id) {
    deleteRole(id);
  }

  return (
    <Table.Row>
      <Cell>{index + 1}</Cell>
      <Cell>{name}</Cell>
      <Cell>{description}</Cell>
      <Cell>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={idguid} />
            <Menus.List id={idguid}>
              <Modal.Open opens="Uredi rolu">
                <Menus.Button title="Uredi rolu" icon={<HiPencilSquare />}>
                  Uredi
                </Menus.Button>
              </Modal.Open>
              <Modal.Open opens="Izbriši rolu">
                <Menus.Button title="Izbriši rolu" icon={<HiTrash />}>
                  Izbriši
                </Menus.Button>
              </Modal.Open>
            </Menus.List>
          </Menus.Menu>
          <Modal.Window name="Uredi rolu" size="xl">
            <CreateRoleForm roleToEdit={role} />
          </Modal.Window>
          <Modal.Window name="Izbriši rolu" size="small">
            <ConfirmDelete
              resourceName="role"
              disabled={isPending}
              onConfirm={() => handleDelete(idguid)}
            />
          </Modal.Window>
        </Modal>
      </Cell>
    </Table.Row>
  );
}

export default RoleRow;
