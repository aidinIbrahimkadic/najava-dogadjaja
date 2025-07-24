import { useNavigate } from 'react-router-dom';

import { useDeleteLocation } from './useDeleteLocation';

import Table from '../../ui/Table';
import Modal from '../../ui/Modal';
import Menus from '../../ui/Menus';
import ConfirmDelete from '../../ui/ConfirmDelete';

import { HiEye, HiTrash, HiPencilSquare } from 'react-icons/hi2';
import Cell from '../../ui/Cell';
import CreateLocationForm from './CreateLocationForm';

function LocationRow({ location, index }) {
  const navigate = useNavigate();
  const { mutate: deleteLocation, isPending } = useDeleteLocation();

  const { idguid, naziv, opis, adresa, mjesto } = location;

  function handleDelete(id) {
    deleteLocation(id);
  }

  return (
    <Table.Row>
      <Cell>{index + 1}</Cell>
      <Cell>{naziv}</Cell>
      <Cell type="textCell">{opis}</Cell>
      <Cell type="textCell">{adresa}</Cell>
      <Cell type="textCell">{mjesto}</Cell>
      <Cell>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={idguid} />
            <Menus.List id={idguid}>
              <Menus.Button icon={<HiEye />} onClick={() => navigate(`/lokacije/${idguid}`)}>
                Više detalja
              </Menus.Button>
              <Modal.Open opens="Uredi lokaciju">
                <Menus.Button title="Uredi lokaciju" icon={<HiPencilSquare />}>
                  Uredi
                </Menus.Button>
              </Modal.Open>
              <Modal.Open opens="Izbriši lokaciju">
                <Menus.Button title="Izbriši lokaciju" icon={<HiTrash />}>
                  Izbriši
                </Menus.Button>
              </Modal.Open>
            </Menus.List>
          </Menus.Menu>
          <Modal.Window name="Uredi lokaciju" size="large">
            <CreateLocationForm locationToEdit={location} />
          </Modal.Window>
          <Modal.Window name="Izbriši lokaciju" size="small">
            <ConfirmDelete
              resourceName="location"
              disabled={isPending}
              onConfirm={() => handleDelete(idguid)}
            />
          </Modal.Window>
        </Modal>
      </Cell>
    </Table.Row>
  );
}

export default LocationRow;
