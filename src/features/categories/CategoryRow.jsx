// import * as FaIcons from 'react-icons/fa';

// import Table from '../../ui/Table';
// import Modal from '../../ui/Modal';
// import Menus from '../../ui/Menus';
// import ConfirmDelete from '../../ui/ConfirmDelete';
// import CreateCategoryForm from './CreateCategoryForm';

// import { useDeleteCategory } from './useDeleteCategory';
// import { HiTrash, HiPencilSquare } from 'react-icons/hi2';
// import BadgeIcon from '../../ui/BadgeIcon';
// import { useUserPermissions } from '../authentication/useUserPermissions';
// import Spinner from '../../ui/Spinner';
// import Cell from '../../ui/Cell';
// import { useGetCategory } from './useCategory';

// function CategoryRow({ category, index }) {
//   const { mutate: deleteCategory, isPending } = useDeleteCategory();
//   const { isLoading, hasPermission } = useUserPermissions();

//   const { idguid, naziv, opis, boja, ikona, parent_idguid } = category;

//   const { category: parentCategory } =
//     parent_idguid !== '00000000-0000-0000-0000-000000000000' ? useGetCategory(parent_idguid) : '';

//   const IconComponent = FaIcons[ikona];

//   console.log(parentCategory);

//   function handleDelete(id) {
//     deleteCategory(id);
//   }

//   {
//     isLoading && <Spinner />;
//   }

//   return (
//     <Table.Row>
//       <Cell>{index + 1}</Cell>
//       <Cell>{naziv}</Cell>
//       <Cell>
//         <BadgeIcon bgColor={boja}>
//           {IconComponent && (
//             <IconComponent
//               style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 width: '8rem',
//               }}
//               size={30}
//             />
//           )}
//         </BadgeIcon>
//       </Cell>

//       <Cell type="textAdresa">{opis}</Cell>

//       <Cell>
//         <Modal>
//           <Menus.Menu>
//             <Menus.Toggle id={idguid} />
//             <Menus.List id={idguid}>
//               {hasPermission('events_categories_save') && (
//                 <Modal.Open opens="Uredi kategoriju">
//                   <Menus.Button title="Uredi kategoriju" icon={<HiPencilSquare />}>
//                     Uredi
//                   </Menus.Button>
//                 </Modal.Open>
//               )}
//               {hasPermission('events_categories_delete') && (
//                 <Modal.Open opens="Izbriši kategoriju">
//                   <Menus.Button title="Izbriši kategoriju" icon={<HiTrash />}>
//                     Izbriši
//                   </Menus.Button>
//                 </Modal.Open>
//               )}
//             </Menus.List>
//           </Menus.Menu>
//           {hasPermission('events_categories_save') && (
//             <Modal.Window name="Uredi kategoriju">
//               <CreateCategoryForm categoryToEdit={category} />
//             </Modal.Window>
//           )}
//           {hasPermission('events_categories_delete') && (
//             <Modal.Window name="Izbriši kategoriju" size="small">
//               <ConfirmDelete
//                 resourceName="categories"
//                 disabled={isPending}
//                 onConfirm={() => handleDelete(idguid)}
//               />
//             </Modal.Window>
//           )}
//         </Modal>
//       </Cell>
//     </Table.Row>
//   );
// }

// export default CategoryRow;

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
import { useGetCategory } from './useCategory';

const ZERO_GUID = '00000000-0000-0000-0000-000000000000';

function CategoryRow({ category, index }) {
  const { mutate: deleteCategory, isPending } = useDeleteCategory();
  const { isLoading: isPermLoading, hasPermission } = useUserPermissions();

  const { idguid, naziv, boja, ikona, opis, parent_idguid } = category;

  const hasParent = !!parent_idguid && parent_idguid !== ZERO_GUID && parent_idguid !== idguid;

  // Pozivamo hook uvijek, ali ga "gasimo" kad nema parenta (pretpostavka: useGetCategory koristi React Query i prima options)
  const { category: parentCategory, isLoading: isParentLoading } = useGetCategory(parent_idguid, {
    enabled: hasParent,
    suppressToast: true,
  });

  const IconComponent = ikona && FaIcons[ikona] ? FaIcons[ikona] : null;

  const handleDelete = (id) => {
    deleteCategory(id);
  };

  // Ako permissions još učitavaju, prikaži red sa spinnerom (podesi colSpan prema broju kolona u tvojoj tabeli)
  if (isPermLoading) {
    return (
      <Table.Row>
        <Cell colSpan={6}>
          <Spinner size="small" />
        </Cell>
      </Table.Row>
    );
  }

  return (
    <Table.Row>
      <Cell>{index + 1}</Cell>
      <Cell>{naziv}</Cell>
      <Cell>
        <BadgeIcon bgColor={boja || '#e5e7eb'}>
          {IconComponent && (
            <IconComponent style={{ display: 'flex', alignItems: 'center' }} size={30} />
          )}
        </BadgeIcon>
      </Cell>
      {/* Nova kolona: Parent kategorija */}
      <Cell>
        {hasParent ? (
          isParentLoading ? (
            <Spinner size="small" />
          ) : (
            parentCategory?.naziv || '—'
          )
        ) : (
          opis
        )}
      </Cell>

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
                  <Menus.Button title="Izbriši kategoriju" icon={<HiTrash />} disabled={isPending}>
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
