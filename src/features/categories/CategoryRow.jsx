import styled from 'styled-components';

import Table from '../../ui/Table';
import Modal from '../../ui/Modal';
import Menus from '../../ui/Menus';
import ConfirmDelete from '../../ui/ConfirmDelete';
import CreateCategoryForm from './CreateCategoryForm';

// import { useGetCategory } from './useCategory';
import { useNavigate } from 'react-router-dom';
import { useDeleteCategory } from './useDeleteCategory';

import { HiEye, HiTrash, HiPencilSquare } from 'react-icons/hi2';
import Badge from '../../ui/Badge';

const Cell = styled.div`
  font-weight: 400;
  color: ${(props) => (props.color ? 'var(--color-grey-50)' : 'var(--color-grey-600)')};
  background-color: ${(props) => props.color};

  font-family: 'Sono';
`;

function CategoryRow({ category, index }) {
  const navigate = useNavigate();

  const { mutate: deleteCategory, isPending } = useDeleteCategory();

  //POPRAVITI kada edhem napravi API za provjeru da li se kategorija koristi
  // const [isPendingCategory, setIsPendingCategory] = useState(false);

  // async function handleConfirmDelete(idguid) {
  //   setIsPendingCategory(true);
  //   const isUsed = await checkIfCategoryIsUsed(idguid);

  //   if (isUsed) {
  //     toast.error('Ne možete obrisati kategoriju jer je vezana za postojeći event.');
  //     setIsPendingCategory(false);
  //     return;
  //   }

  //   deleteCategory(idguid);
  //   setIsPendingCategory(false);
  // }

  function handleDelete(id) {
    deleteCategory(id);
  }
  const { idguid, naziv, operater, opis, boja } = category;

  return (
    <Table.Row>
      <Cell>{index + 1}</Cell>
      <Cell>{naziv}</Cell>
      <Cell type="textCell">{opis}</Cell>
      <Cell>
        <Badge bgColor={boja}> {boja}</Badge>
      </Cell>
      <Cell>{operater}</Cell>
      <Cell>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={idguid} />
            <Menus.List id={idguid}>
              <Menus.Button
                title="Više detalja"
                icon={<HiEye />}
                onClick={() => navigate(`/category/${idguid}`)}
              >
                Više detalja
              </Menus.Button>
              <Modal.Open opens="Uredi kategoriju">
                <Menus.Button title="Uredi kategoriju" icon={<HiPencilSquare />}>
                  Uredi
                </Menus.Button>
              </Modal.Open>
              <Modal.Open opens="Izbriši kategoriju">
                <Menus.Button title="Izbriši kategoriju" icon={<HiTrash />}>
                  Izbriši
                </Menus.Button>
              </Modal.Open>
            </Menus.List>
          </Menus.Menu>

          <Modal.Window name="Uredi kategoriju" size="medium">
            <CreateCategoryForm categoryToEdit={category} />
          </Modal.Window>
          <Modal.Window name="Izbriši kategoriju" size="small">
            <ConfirmDelete
              resourceName="categories"
              disabled={isPending}
              //POPRAVITI kada edhem napravi API za provjeru da li se kategorija koristi
              // disabled={isPending || isPendingCategory}
              onConfirm={() => handleDelete(idguid)}
            />
          </Modal.Window>
        </Modal>
      </Cell>
    </Table.Row>
  );
}

export default CategoryRow;
