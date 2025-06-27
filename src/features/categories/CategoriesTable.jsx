import CalendarSpinner from '../../ui/CalendarSpinner';
import { useGetCategory } from './useCategory';

export default function CategoriesTable() {
  const { isLoading, category } = useGetCategory();

  {
    isLoading && <CalendarSpinner />;
  }
  console.log(category);
  return <h1>Categories</h1>;
}
