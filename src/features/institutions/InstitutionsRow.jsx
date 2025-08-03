// import { useNavigate } from 'react-router-dom';

import { useDeleteInstitution } from './useDeleteInstitution';

import Table from '../../ui/Table';
import Modal from '../../ui/Modal';
import Menus from '../../ui/Menus';
import ConfirmDelete from '../../ui/ConfirmDelete';

import { HiTrash, HiPencilSquare } from 'react-icons/hi2';
import Cell from '../../ui/Cell';
import CreateInstitutionForm from './CreateInstitutionForm';
import { useUserPermissions } from '../authentication/useUserPermissions';
import Spinner from '../../ui/Spinner';

function InstitutionRow({ institution, index }) {
  const { mutate: deleteInstitution, isPending } = useDeleteInstitution();
  const { isLoading, hasPermission } = useUserPermissions();

  const { idguid, naziv, opis } = institution;

  function handleDelete(id) {
    deleteInstitution(id);
  }
  {
    isLoading && <Spinner />;
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
              {hasPermission('events_institucije_save') && (
                <Modal.Open opens="Uredi instituciju">
                  <Menus.Button title="Uredi instituciju" icon={<HiPencilSquare />}>
                    Uredi
                  </Menus.Button>
                </Modal.Open>
              )}
              {hasPermission('events_institucije_delete') && (
                <Modal.Open opens="Izbriši instituciju">
                  <Menus.Button title="Izbriši instituciju" icon={<HiTrash />}>
                    Izbriši
                  </Menus.Button>
                </Modal.Open>
              )}
            </Menus.List>
          </Menus.Menu>
          {hasPermission('events_institucije_save') && (
            <Modal.Window name="Uredi instituciju" size="large">
              <CreateInstitutionForm institutionToEdit={institution} />
            </Modal.Window>
          )}
          {hasPermission('events_institucije_delete') && (
            <Modal.Window name="Izbriši instituciju" size="small">
              <ConfirmDelete
                resourceName="institution"
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

export default InstitutionRow;
