// import { useNavigate } from 'react-router-dom';

import { useDeleteInstitution } from './useDeleteInstitution';

import Table from '../../ui/Table';
import Modal from '../../ui/Modal';
import Menus from '../../ui/Menus';
import ConfirmDelete from '../../ui/ConfirmDelete';

import { HiTrash, HiPencilSquare } from 'react-icons/hi2';
import Cell from '../../ui/Cell';
import CreateInstitutionForm from './CreateInstitutionForm';

function InstitutionRow({ institution, index }) {
  const { mutate: deleteInstitution, isPending } = useDeleteInstitution();

  const { idguid, naziv, opis } = institution;

  function handleDelete(id) {
    deleteInstitution(id);
  }

  return (
    <Table.Row>
      <Cell>{index + 1}</Cell>
      <Cell>{naziv}</Cell>
      <Cell>{opis}</Cell>
      <Cell>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={idguid} />
            <Menus.List id={idguid}>
              <Modal.Open opens="Uredi instituciju">
                <Menus.Button title="Uredi instituciju" icon={<HiPencilSquare />}>
                  Uredi
                </Menus.Button>
              </Modal.Open>
              <Modal.Open opens="Izbriši instituciju">
                <Menus.Button title="Izbriši instituciju" icon={<HiTrash />}>
                  Izbriši
                </Menus.Button>
              </Modal.Open>
            </Menus.List>
          </Menus.Menu>
          <Modal.Window name="Uredi instituciju" size="large">
            <CreateInstitutionForm institutionToEdit={institution} />
          </Modal.Window>
          <Modal.Window name="Izbriši instituciju" size="small">
            <ConfirmDelete
              resourceName="institution"
              disabled={isPending}
              onConfirm={() => handleDelete(idguid)}
            />
          </Modal.Window>
        </Modal>
      </Cell>
    </Table.Row>
  );
}

export default InstitutionRow;
