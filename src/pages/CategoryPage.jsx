import { useParams } from 'react-router-dom';
// import { useGetSingleCategory } from '../features/front/useSingleCategory';
// import CalendarSpinner from '../ui/CalendarSpinner';

export default function CategoryPage() {
  // Here you would typically fetch the category data based on the ID from the URL
  // For example, using a custom hook or a context
  const { id } = useParams();
  console.log('Category ID:', id);
  //   const { singleCategory, isLoading } = useGetSingleCategory({ id });
  //   if (isLoading) {
  //     return <CalendarSpinner />;
  //   }

  //   return <div category={singleCategory}>TEST</div>;
  return <h1>{id}</h1>;
}
