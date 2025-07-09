import CategoriesTable from '../features/categories/CategoriesTable';
import Heading from '../ui/Heading';
import Row from '../ui/Row';
import AddCategory from '../features/categories/AddCategory';

export default function Categories() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Sve kategorije</Heading>
        <AddCategory />
      </Row>
      <Row type="vertical">
        <CategoriesTable />
      </Row>
    </>
  );
}
