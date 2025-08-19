import { useUserPermissions } from '../features/authentication/useUserPermissions';
import { useGetAllCategories } from '../features/front/useAllCategories';
import { useGetUpcomingEvents } from '../features/front/useUpcomingEvents';
import { useUpdateUserInterests } from '../features/front/useUpdateUserInterests';
import { useGetUserInterests } from '../features/front/useUserInterests';
import { usePostChangePassword } from '../features/user/usePostChangePassword';
import { usePostDeactivateMe } from '../features/user/usePostDeactivateMe';
import { useUpdateMe } from '../features/user/useUpdateMe';
import CalendarSpinner from '../ui/CalendarSpinner';
import CategorySubscriptions from '../ui/Front/CategorySubscriptions';
import { Page } from '../ui/Front/Page';
import { RightColumn } from '../ui/Front/RightColumn';
import { UpcomingEvents } from '../ui/Front/UpcomingEvents';
import UserAccountPanel from '../ui/Front/UserAccountPanel';
import { WeatherForecast3Day } from '../ui/Front/WeatherForecast3Day';
import Spinner from '../ui/Spinner';

export default function UserProfilePage() {
  const { isLoading: isLoadingEvents, upcomingEvents } = useGetUpcomingEvents();
  const { isLoading: isLoadingCategories, allCategories } = useGetAllCategories();
  const { isEditing: isUpdatingUserInterests, updateUserInterests } = useUpdateUserInterests();
  const { mutate: changePassword, isEditing } = usePostChangePassword();

  const { postDeactivateMe, isEditing: isDeactivating } = usePostDeactivateMe();

  const { isEditing: isEditingProfile, updateMe } = useUpdateMe();

  const { isLoading: isLoadingUser, user } = useUserPermissions();

  const hasUser = !!user?.idguid;
  const { isLoading: isLoadingUserInterests, userInterests } = useGetUserInterests({
    enabled: hasUser,
    userId: user?.idguid,
  });

  const showSpinner =
    isLoadingEvents || isLoadingCategories || isLoadingUser || (hasUser && isLoadingUserInterests);

  const allEvents = upcomingEvents?.map((event) => {
    const startDate = new Date(event.start_date);
    const formatedDate =
      startDate.getFullYear() +
      '-' +
      String(startDate.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(startDate.getDate()).padStart(2, '0');

    const formattedTime =
      String(startDate.getHours()).padStart(2, '0') +
      ':' +
      String(startDate.getMinutes()).padStart(2, '0');

    return {
      id: event.idguid,
      title: event.title,
      price: parseFloat(event.cijena),
      date: formatedDate,
      time: formattedTime,
      category: event.category.naziv,
      category_idguid: event.category.idguid,
      location: event.lokacija.naziv,
      institution: event.institucija.naziv,
      institution_idguid: event.institucija.idguid,
    };
  });

  const interests = (userInterests ?? []).map((i) => i.category_idguid);

  if (isLoadingEvents) {
    <CalendarSpinner />;
  }

  return (
    <Page>
      {showSpinner ? (
        <Spinner />
      ) : (
        <>
          <div>
            <UserAccountPanel
              user={user}
              onChangePassword={changePassword}
              onUpdateProfile={updateMe}
              onDeactivate={postDeactivateMe}
              isSavingProfile={false}
              isChangingPassword={false}
              isDeactivating={isDeactivating}
              isEditing={isEditing}
              isEditingProfile={isEditingProfile}
            />
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
          </div>
          <RightColumn>
            <UpcomingEvents events={allEvents} />
            <WeatherForecast3Day />
          </RightColumn>
        </>
      )}
    </Page>
  );
}
