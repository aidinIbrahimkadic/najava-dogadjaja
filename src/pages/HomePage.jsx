import styled from 'styled-components';
import { useGetAllCategories } from '../features/front/useAllCategories';
import { useGetAllInstitutions } from '../features/front/useAllInstitutions';
import { useGetUpcomingEvents } from '../features/front/useUpcomingEvents';
import { useUpdateUserInterests } from '../features/front/useUpdateUserInterests';
import { useGetUserInterests } from '../features/front/useUserInterests';
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
  const { isLoading: isLoadingUserInterests, userInterests } = useGetUserInterests();
  const { isEditing: isUpdatingUserInterests, updateUserInterests } = useUpdateUserInterests();

  const interests = userInterests?.map((interest) => interest.category_idguid);

  return (
    <Container>
      {isLoading || isLoadingCategories || isLoadingInstitutions || isLoadingUserInterests ? (
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
            initialSelectedIds={interests}
            isUpdating={isUpdatingUserInterests}
            onSave={async (category_idguids) => {
              console.log(category_idguids);
              updateUserInterests({ category_idguids });
              // npr. await fetch('/api/me/subscriptions', { method: 'POST', body: JSON.stringify({ categories: ids })})
            }}
          />
        </>
      )}
    </Container>
  );
}
