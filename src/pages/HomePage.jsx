import styled from 'styled-components';
import { useUserPermissions } from '../features/authentication/useUserPermissions';
import { useGetAllCategories } from '../features/front/useAllCategories';
import { useGetAllInstitutions } from '../features/front/useAllInstitutions';
import { useGetUpcomingEvents } from '../features/front/useUpcomingEvents';
import { useUpdateUserInterests } from '../features/front/useUpdateUserInterests';
import { useGetUserInterests } from '../features/front/useUserInterests';
import CalendarSpinner from '../ui/CalendarSpinner';
import AllEvents from '../ui/Front/AllEvents';
import CategorySubscriptions from '../ui/Front/CategorySubscriptions';
import LayoutUpcomingWeather from '../ui/Front/LayoutUpcomingWeather';
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
  const { isLoading: isLoadingUser, user } = useUserPermissions();

  const hasUser = !!user?.idguid;

  const { isLoading: isLoadingUserInterests, userInterests } = useGetUserInterests({
    enabled: hasUser,
    userId: user?.idguid,
  });

  const { isEditing: isUpdatingUserInterests, updateUserInterests } = useUpdateUserInterests();

  // const interests = userInterests?.map((interest) => interest.category_idguid);
  const interests = (userInterests ?? []).map((i) => i.category_idguid);

  const showSpinner =
    isLoading ||
    isLoadingCategories ||
    isLoadingInstitutions ||
    isLoadingUser ||
    (hasUser && isLoadingUserInterests);

  return (
    <Container>
      {showSpinner ? (
        <CalendarSpinner />
      ) : (
        <>
          <PosterCarousel upcomingEvents={upcomingEvents} />

          <AllEvents upcomingEvents={upcomingEvents} allCategories={allCategories} />
          <LayoutUpcomingWeather upcomingEvents={upcomingEvents} />
          <LogoSlider allInstitutions={allInstitutions} />
          <CategorySubscriptions
            isAuthenticated={hasUser}
            categories={allCategories}
            initialSelectedIds={interests}
            isUpdating={isUpdatingUserInterests}
            onSave={async (category_idguids) => {
              if (!hasUser) return;
              updateUserInterests({ category_idguids });
            }}
          />
        </>
      )}
    </Container>
  );
}
