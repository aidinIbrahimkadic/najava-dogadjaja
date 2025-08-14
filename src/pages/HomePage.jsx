import styled from 'styled-components';
import { useGetAllCategories } from '../features/front/useAllCategories';
import { useGetAllInstitutions } from '../features/front/useAllInstitutions';
import { useGetUpcomingEvents } from '../features/front/useUpcomingEvents';
import CalendarSpinner from '../ui/CalendarSpinner';
import AllEvents from '../ui/Front/AllEvents';
import CategorySubscriptions from '../ui/Front/CategorySubscriptions';
import HomeLayoutUpcomingCalendarWeather from '../ui/Front/HomeLayoutUpcomingCalendarWeather';
import LogoSlider from '../ui/Front/LogoSlider';
import PosterCarousel from '../ui/Front/PosterCarousel';

const Container = styled.div`
  background-color: #fbfdff;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export default function HomePage() {
  const { upcomingEvents, isLoading } = useGetUpcomingEvents();
  const { isLoading: isLoadingCategories, allCategories } = useGetAllCategories();
  const { isLoading: isLoadingInstitutions, allInstitutions } = useGetAllInstitutions();

  return (
    <Container>
      {isLoading || isLoadingCategories || isLoadingInstitutions ? (
        <CalendarSpinner />
      ) : (
        <>
          <PosterCarousel upcomingEvents={upcomingEvents} />

          <AllEvents upcomingEvents={upcomingEvents} allCategories={allCategories} />
          <HomeLayoutUpcomingCalendarWeather upcomingEvents={upcomingEvents} />
          <LogoSlider allInstitutions={allInstitutions} />
          <CategorySubscriptions
            isAuthenticated={true}
            categories={allCategories}
            initialSelectedIds={[
              'e2967b0e-4dff-4fd1-a734-f34af5db1508',
              'c43c30b6-a07f-4ff8-8519-132e8e41c550',
            ]}
            onSave={async (ids) => {
              // npr. await fetch('/api/me/subscriptions', { method: 'POST', body: JSON.stringify({ categories: ids })})
              console.log('Spremam na backend:', ids);
            }}
          />
        </>
      )}
    </Container>
  );
}
