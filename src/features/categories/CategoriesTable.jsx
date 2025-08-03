import CalendarSpinner from '../../ui/CalendarSpinner';
import Empty from '../../ui/Empty';
import Menus from '../../ui/Menus';
import Pagination from '../../ui/Pagination';
import Table from '../../ui/Table';
import CategoryRow from './CategoryRow';
import { useGetCategories } from './useCategories';

export default function CategoriesTable() {
  const { isLoading, categories, error, count } = useGetCategories();

  if (isLoading) return <CalendarSpinner />;
  if (error) return <Empty />;

  return (
    <Menus>
      <Table columns=".2fr 1fr .3fr 2fr .2fr">
        <Table.Header>
          <div>#</div>
          <div>Naziv</div>
          <div>Ikona</div>
          <div>Opis</div>
          <div></div>
        </Table.Header>
        <Table.Body
          data={categories}
          render={(category, i) => (
            <CategoryRow index={i} key={category.idguid} category={category} />
          )}
        />
        <Table.Footer>
          <Pagination count={count} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}
