import { useNavigate } from 'react-router-dom';

import { useGetCategory } from '../categories/useCategory';
import { useDeleteEvent } from '../events/useDeleteEvent';

import Table from '../../ui/Table';
import Modal from '../../ui/Modal';
import Menus from '../../ui/Menus';
import ConfirmDelete from '../../ui/ConfirmDelete';

import { HiEye, HiTrash, HiPencilSquare } from 'react-icons/hi2';
import CreateEventForm from './CreateEventForm';
import Badge from '../../ui/Badge';
import Cell from '../../ui/Cell';
import TwoRowCell from '../../ui/TwoRowCell';
import Checkbox from '../../ui/Checkbox';
import { ImageCell } from '../../ui/ImageCell';
import { useGetLocation } from '../locations/useLocation';
import Spinner from '../../ui/Spinner';

function EventRow({ event, index }) {
  const navigate = useNavigate();
  const { mutate: deleteEvent, isPending } = useDeleteEvent();

  const {
    idguid,
    category_idguid,
    cijena,
    title,
    location,
    slika,
    is_public,
    start_date,
    end_date,
  } = event;

  const { isLoading: isLoadingLocation, location: lokacija } = useGetLocation(location);

  function handleDelete(id) {
    deleteEvent(id);
  }

  //POPRAVITI
  const { category } = useGetCategory(category_idguid);
  const categoryName = category?.naziv;

  return (
    <Table.Row>
      <Cell>{index + 1}</Cell>
      <Cell type="textCell">{title}</Cell>
      <Cell>
        <ImageCell slika={slika} title={title} />
      </Cell>
      <Cell>
        {cijena == 0 ? (
          <Badge bgColor={'#60ca7d'}>Besplatno</Badge>
        ) : (
          parseFloat(cijena).toFixed(2) + ' KM'
        )}{' '}
      </Cell>
      <Cell>{isLoadingLocation ? <Spinner size="small" /> : lokacija.naziv}</Cell>
      <Cell>
        <Badge bgColor={category?.boja}>{categoryName}</Badge>
      </Cell>
      <TwoRowCell>{start_date}</TwoRowCell>
      <TwoRowCell>{end_date}</TwoRowCell>
      <Cell>
        <Checkbox checked={is_public} disabled />
      </Cell>
      <Cell>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={idguid} />
            <Menus.List id={idguid}>
              <Menus.Button icon={<HiEye />} onClick={() => navigate(`/events/${idguid}`)}>
                Više detalja
              </Menus.Button>
              <Modal.Open opens="Uredi događaj">
                <Menus.Button title="Uredi događaj" icon={<HiPencilSquare />}>
                  Uredi
                </Menus.Button>
              </Modal.Open>
              <Modal.Open opens="Izbriši događaj">
                <Menus.Button title="Izbriši događaj" icon={<HiTrash />}>
                  Izbriši
                </Menus.Button>
              </Modal.Open>
            </Menus.List>
          </Menus.Menu>
          <Modal.Window name="Uredi događaj" size="xl">
            <CreateEventForm eventToEdit={event} />
          </Modal.Window>
          <Modal.Window name="Izbriši događaj" size="small">
            <ConfirmDelete
              resourceName="event"
              disabled={isPending}
              onConfirm={() => handleDelete(idguid)}
            />
          </Modal.Window>
        </Modal>
      </Cell>
    </Table.Row>
  );
}

export default EventRow;
