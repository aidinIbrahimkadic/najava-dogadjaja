import styled from 'styled-components';

import Table from '../../ui/Table';
import Modal from '../../ui/Modal';
import Menus from '../../ui/Menus';
import ConfirmDelete from '../../ui/ConfirmDelete';

import { useGetCategory } from '../categories/useCategory';
import formater from '../../utils/dateFormatter';
import { useNavigate } from 'react-router-dom';
import { useDeleteEvent } from '../events/useDeleteEvent';

import { HiEye, HiTrash, HiPencilSquare } from 'react-icons/hi2';
import CreateEventForm from './CreateEventForm';

const Cell = styled.div`
  font-weight: 400;
  color: var(--color-grey-600);
  font-family: 'Sono';
`;

function EventRow({ event, index }) {
  const navigate = useNavigate();
  const { mutate: deleteEvent, isPending } = useDeleteEvent();

  const {
    idguid,
    category_idguid,
    title,
    location,
    description,
    image_url,
    is_public,
    start_date,
    end_date,
  } = event;

  function handleDelete(id) {
    deleteEvent(id);
  }

  //EDIT

  //POPRAVITI
  const { category } = useGetCategory(category_idguid);
  const naziv = category?.naziv;

  return (
    <Table.Row>
      <Cell>{index + 1}</Cell>
      <Cell>{title}</Cell>
      <Cell>{location}</Cell>
      <Cell>{naziv}</Cell>
      <Cell>{description}</Cell>
      <Cell>{image_url}</Cell>
      {/* POPRAVITI dodati komponentu */}
      <Cell>
        {is_public ? (
          <span style={{ color: 'green', fontWeight: 'bold' }}>Public</span>
        ) : (
          <span style={{ color: 'red', fontWeight: 'bold' }}>Private</span>
        )}
      </Cell>
      <Cell>{formater(start_date)}</Cell>
      <Cell>{formater(end_date)}</Cell>
      <Cell>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={idguid} />
            <Menus.List id={idguid}>
              <Menus.Button icon={<HiEye />} onClick={() => navigate(`/events/${idguid}`)}>
                Više detalja
              </Menus.Button>
              <Modal.Open opens="Edit event">
                <Menus.Button icon={<HiPencilSquare />}>Edit event</Menus.Button>
              </Modal.Open>
              <Modal.Open opens="Delete event">
                <Menus.Button icon={<HiTrash />}>Delete event</Menus.Button>
              </Modal.Open>
            </Menus.List>
          </Menus.Menu>
          <Modal.Window name="Edit event" size="large">
            <CreateEventForm eventToEdit={event} />
          </Modal.Window>
          <Modal.Window name="Delete event" size="small">
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
