import { useDeleteLocation } from './useDeleteLocation';

import Table from '../../ui/Table';
import Modal from '../../ui/Modal';
import Menus from '../../ui/Menus';
import ConfirmDelete from '../../ui/ConfirmDelete';

import { HiTrash, HiPencilSquare } from 'react-icons/hi2';
import Cell from '../../ui/Cell';
import CreateLocationForm from './CreateLocationForm';
import { useGetUser } from '../users/useUser';
import { useUserPermissions } from '../authentication/useUserPermissions';
import Spinner from '../../ui/Spinner';

function LocationRow({ location, index }) {
  const { mutate: deleteLocation, isPending } = useDeleteLocation();
  const { isLoading, hasPermission } = useUserPermissions();

  const { idguid, naziv, adresa, mjesto, operater } = location;
  const { user } = useGetUser(operater);

  const user_email = user?.data.email;

  function handleDelete(id) {
    deleteLocation(id);
  }

  {
    isLoading && <Spinner />;
  }
  return (
    <Table.Row>
      <Cell>{index + 1}</Cell>
      <Cell>{naziv}</Cell>
      <Cell type="textAdresa">{adresa}</Cell>
      <Cell type="textCell">{mjesto}</Cell>
      <Cell>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={idguid} />
            <Menus.List id={idguid}>
              {hasPermission('events_lokacije_save') && (
                <Modal.Open opens="Uredi lokaciju">
                  <Menus.Button title="Uredi lokaciju" icon={<HiPencilSquare />}>
                    Uredi
                  </Menus.Button>
                </Modal.Open>
              )}
              {hasPermission('events_lokacije_delete') && (
                <Modal.Open opens="Izbriši lokaciju">
                  <Menus.Button title="Izbriši lokaciju" icon={<HiTrash />}>
                    Izbriši
                  </Menus.Button>
                </Modal.Open>
              )}
            </Menus.List>
          </Menus.Menu>
          {hasPermission('events_lokacije_save') && (
            <Modal.Window name="Uredi lokaciju" size="large">
              <CreateLocationForm locationToEdit={location} user_email={user_email} />
            </Modal.Window>
          )}
          {hasPermission('events_lokacije_delete') && (
            <Modal.Window name="Izbriši lokaciju" size="small">
              <ConfirmDelete
                resourceName="location"
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

export default LocationRow;
