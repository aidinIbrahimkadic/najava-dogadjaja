// import { useNavigate } from 'react-router-dom';

import Table from '../../ui/Table';
import Modal from '../../ui/Modal';
import Menus from '../../ui/Menus';
import ConfirmDelete from '../../ui/ConfirmDelete';

import { HiTrash, HiPencilSquare } from 'react-icons/hi2';
import CreateEventForm from './CreateManifestationForm';
import Cell from '../../ui/Cell';
import TwoRowCell from '../../ui/TwoRowCell';
import { useGetLocation } from '../locations/useLocation';
import Spinner from '../../ui/Spinner';
import { useUserPermissions } from '../authentication/useUserPermissions';
import { useDeleteManifestation } from './useDeleteManifestation';
// import { useGetInstitution } from '../institutions/useInstitution';

function EventRow({ manifestation, index }) {
  const { mutate: deleteManifestation, isPending } = useDeleteManifestation();
  const { isLoading, hasPermission } = useUserPermissions();

  const { idguid, title, location, institucija, start_time, end_time } = manifestation;

  const { isLoading: isLoadingLocation, location: lokacija } = useGetLocation(location);
  // const { isLoading: isLoadingInstitution, institution } = useGetInstitution(institution_idguid);

  function handleDelete(id) {
    deleteManifestation(id);
  }

  {
    isLoading && <Spinner />;
  }

  return (
    <Table.Row>
      <Cell>{index + 1}</Cell>
      <Cell type="textAdresa">{title}</Cell>

      <Cell>{isLoadingLocation ? <Spinner size="small" /> : lokacija?.naziv}</Cell>
      <Cell>{institucija?.naziv}</Cell>

      <TwoRowCell>{start_time}</TwoRowCell>
      <TwoRowCell>{end_time}</TwoRowCell>

      <Cell>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={idguid} />
            <Menus.List id={idguid}>
              {/* <Menus.Button icon={<HiEye />} onClick={() => navigate(`/events/${idguid}`)}>
                Više detalja
              </Menus.Button> */}
              {hasPermission('events_save') && (
                <Modal.Open opens="Uredi manifestaciju">
                  <Menus.Button title="Uredi manifestaciju" icon={<HiPencilSquare />}>
                    Uredi
                  </Menus.Button>
                </Modal.Open>
              )}
              {hasPermission('events_delete') && (
                <Modal.Open opens="Izbriši manifestaciju">
                  <Menus.Button title="Izbriši manifestaciju" icon={<HiTrash />}>
                    Izbriši
                  </Menus.Button>
                </Modal.Open>
              )}
            </Menus.List>
          </Menus.Menu>
          {hasPermission('events_save') && (
            <Modal.Window name="Uredi manifestaciju" size="extraLarge">
              <CreateEventForm manifestationToEdit={manifestation} />
            </Modal.Window>
          )}
          {hasPermission('events_delete') && (
            <Modal.Window name="Izbriši manifestaciju" size="small">
              <ConfirmDelete
                resourceName="manifestation"
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

export default EventRow;
