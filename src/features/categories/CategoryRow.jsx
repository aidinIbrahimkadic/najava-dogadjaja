import styled from 'styled-components';

import Table from '../../ui/Table';
import Modal from '../../ui/Modal';
import Menus from '../../ui/Menus';
import ConfirmDelete from '../../ui/ConfirmDelete';

// import { useGetCategory } from './useCategory';
import { useNavigate } from 'react-router-dom';
import { useDeleteCategory } from './useDeleteCategory';

import { HiEye, HiTrash, HiPencilSquare } from 'react-icons/hi2';

const Cell = styled.div`
  font-weight: 400;
  color: var(--color-grey-600);
  font-family: 'Sono';
`;

function CategoryRow({ category: { idguid, naziv, operater, opis }, index }) {
  const navigate = useNavigate();

  const { mutate: deleteCategory, isPending } = useDeleteCategory();

  function handleDelete(id) {
    deleteCategory(id);
  }

  return (
    <Table.Row>
      <Cell>{index + 1}</Cell>
      <Cell>{naziv}</Cell>
      <Cell>{operater}</Cell>
      <Cell>{opis}</Cell>
      <Cell>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={idguid} />
            <Menus.List id={idguid}>
              <Menus.Button icon={<HiEye />} onClick={() => navigate(`/category/${idguid}`)}>
                Više detalja
              </Menus.Button>
              <Menus.Button icon={<HiPencilSquare />}>Edit event</Menus.Button>
              <Modal.Open opens="delete">
                <Menus.Button icon={<HiTrash />}>Delete event</Menus.Button>
              </Modal.Open>
            </Menus.List>
          </Menus.Menu>

          <Modal.Window name="delete">
            <ConfirmDelete
              resourceName="categories"
              disabled={isPending}
              onConfirm={() => handleDelete(idguid)}
            />
          </Modal.Window>
        </Modal>
      </Cell>
    </Table.Row>
  );
}

export default CategoryRow;
