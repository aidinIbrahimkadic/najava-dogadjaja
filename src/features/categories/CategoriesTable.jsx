import CalendarSpinner from '../../ui/CalendarSpinner';
import Empty from '../../ui/Empty';
import Heading from '../../ui/Heading';
import Menus from '../../ui/Menus';
import Pagination from '../../ui/Pagination';
import Table from '../../ui/Table';
import CategoryRow from './CategoryRow';
import { useGetCategories } from './useCategories';

export default function CategoriesTable() {
  const { isLoading, categories: categoriesAPI, error, count } = useGetCategories();

  const categories = categoriesAPI?.filter((category) => {
    if (category.parent_idguid !== '00000000-0000-0000-0000-000000000000') {
      return category;
    }
  });

  const parentCategories = categoriesAPI?.filter((category) => {
    if (category.parent_idguid === '00000000-0000-0000-0000-000000000000') {
      return category;
    }
  });

  if (isLoading) return <CalendarSpinner />;
  if (error) return <Empty />;

  return (
    <Menus>
      <Heading as="h2" style={{ marginTop: '2rem' }}>
        Kategorije
      </Heading>
      <Table columns=".2fr 1fr .3fr 2fr .2fr">
        <Table.Header>
          <div>#</div>
          <div>Naziv</div>
          <div>Ikona</div>
          <div>Grupa</div>
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

      <Heading as="h2" style={{ marginTop: '2rem' }}>
        Grupe kategorija
      </Heading>
      <Table columns=".2fr 1fr .3fr 2fr .2fr">
        <Table.Header>
          <div>#</div>
          <div>Naziv</div>
          <div>Ikona</div>
          <div>Opis</div>
          <div></div>
        </Table.Header>
        <Table.Body
          data={parentCategories}
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
