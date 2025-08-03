import * as FaIcons from 'react-icons/fa';

import Table from '../../ui/Table';
import Modal from '../../ui/Modal';
import Menus from '../../ui/Menus';
import ConfirmDelete from '../../ui/ConfirmDelete';
import CreateCategoryForm from './CreateCategoryForm';

import { useDeleteCategory } from './useDeleteCategory';
import { HiTrash, HiPencilSquare } from 'react-icons/hi2';
import BadgeIcon from '../../ui/BadgeIcon';
import { useUserPermissions } from '../authentication/useUserPermissions';
import Spinner from '../../ui/Spinner';
import Cell from '../../ui/Cell';

// const Cell = styled.div`
//   font-weight: 400;
//   color: ${(props) => (props.color ? 'var(--color-grey-50)' : 'var(--color-grey-600)')};
//   background-color: ${(props) => props.color};

//   font-family: 'Sono';
// `;

function CategoryRow({ category, index }) {
  const { mutate: deleteCategory, isPending } = useDeleteCategory();
  const { isLoading, hasPermission } = useUserPermissions();

  const { idguid, naziv, opis, boja, ikona } = category;
  const IconComponent = FaIcons[ikona];

  function handleDelete(id) {
    deleteCategory(id);
  }

  {
    isLoading && <Spinner />;
  }

  return (
    <Table.Row>
      <Cell>{index + 1}</Cell>
      <Cell>{naziv}</Cell>
      <Cell>
        <BadgeIcon bgColor={boja}>
          {IconComponent && (
            <IconComponent
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '8rem',
              }}
              size={30}
            />
          )}
        </BadgeIcon>
      </Cell>

      <Cell type="textAdresa">{opis}</Cell>

      <Cell>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={idguid} />
            <Menus.List id={idguid}>
              {hasPermission('events_categories_save') && (
                <Modal.Open opens="Uredi kategoriju">
                  <Menus.Button title="Uredi kategoriju" icon={<HiPencilSquare />}>
                    Uredi
                  </Menus.Button>
                </Modal.Open>
              )}
              {hasPermission('events_categories_delete') && (
                <Modal.Open opens="Izbriši kategoriju">
                  <Menus.Button title="Izbriši kategoriju" icon={<HiTrash />}>
                    Izbriši
                  </Menus.Button>
                </Modal.Open>
              )}
            </Menus.List>
          </Menus.Menu>
          {hasPermission('events_categories_save') && (
            <Modal.Window name="Uredi kategoriju">
              <CreateCategoryForm categoryToEdit={category} />
            </Modal.Window>
          )}
          {hasPermission('events_categories_delete') && (
            <Modal.Window name="Izbriši kategoriju" size="small">
              <ConfirmDelete
                resourceName="categories"
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

export default CategoryRow;
