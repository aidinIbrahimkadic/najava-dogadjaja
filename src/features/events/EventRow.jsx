import styled from 'styled-components';

import Table from '../../ui/Table';
import Modal from '../../ui/Modal';
import Menus from '../../ui/Menus';
import ConfirmDelete from '../../ui/ConfirmDelete';

import { useGetCategory } from '../categories/useCategory';
import formater from '../../utils/dateFormatter';
import { useNavigate } from 'react-router-dom';
import { useDeleteEvent } from '../events/useDeleteEvent';

import { HiEye, HiTrash } from 'react-icons/hi2';

const Cell = styled.div`
  font-weight: 400;
  color: var(--color-grey-600);
  font-family: 'Sono';
`;

function EventRow({
  event: { idguid, title, location, description, image_url, is_public, start_date, end_date },
  index,
}) {
  const navigate = useNavigate();

  const { mutate: deleteEvent, isPending } = useDeleteEvent();

  function handleDelete(id) {
    deleteEvent(id);
  }

  //POPRAVITI
  const { category } = useGetCategory();
  const naziv = category?.naziv;

  return (
    <Table.Row>
      <Cell>{index + 1}</Cell>
      <Cell>{title}</Cell>
      <Cell>{location}</Cell>
      <Cell>{naziv}</Cell>
      <Cell>{description}</Cell>
      <Cell>{image_url}</Cell>
      <Cell>{is_public}</Cell>
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

              <Modal.Open opens="delete">
                <Menus.Button icon={<HiTrash />}>Delete event</Menus.Button>
              </Modal.Open>
            </Menus.List>
          </Menus.Menu>

          <Modal.Window name="delete">
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
