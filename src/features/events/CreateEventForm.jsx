import { useForm } from 'react-hook-form';

import Input from '../../ui/Input';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
// import FileInput from '../../ui/FileInput';
import TextArea from '../../ui/TextArea';
import FormRow from '../../ui/FormRow';

import { usePostEvent } from './usePostEvent';
import { useUpdateEvent } from './useUpdateEvent';
import { format } from 'date-fns';
import { useGetCategories } from '../categories/useCategories';
import CalendarSpinner from '../../ui/CalendarSpinner';
import { useUserProfile } from '../authentication/useUserProfile';

function CreateEventForm({ eventToEdit = {}, onCloseModal }) {
  const { isCreating, postEvent } = usePostEvent();
  const { isEditing, updateEvent } = useUpdateEvent();
  const { isLoading, categories } = useGetCategories();

  //POPRAVITI povuci korisnika na osnovu IDa
  const { isLoading: isLoadingUser, user } = useUserProfile();

  const isWorking = isCreating || isEditing;

  let formatedValues = {};

  const { idguid: editIdd } = eventToEdit;
  const isEditSession = Boolean(editIdd);

  if (isEditSession) {
    formatedValues = {
      ...eventToEdit,
      start_date: format(new Date(eventToEdit.start_date), 'yyyy-MM-dd'),
      end_date: format(new Date(eventToEdit.end_date), 'yyyy-MM-dd'),
      user_idguid: user.idguid,
    };
  }
  const { idguid: editId, ...editValues } = formatedValues;

  const { register, handleSubmit, reset, watch, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });

  //POPRAVITI pozadina cudna
  if (isLoading || isLoadingUser) return <CalendarSpinner />;

  const { errors } = formState;

  function onSubmit(data) {
    if (isEditSession)
      updateEvent(
        { data, editId },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    else {
      postEvent(
        { ...data },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    }
  }

  function onError() {
    // console.log(errors);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)} type={onCloseModal ? 'modal' : 'regular'}>
      <FormRow label="Title" error={errors?.title?.message}>
        <Input
          type="text"
          id="title"
          disabled={isWorking}
          {...register('title', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow label="Event Description" error={errors?.description?.message}>
        <TextArea
          type="text"
          id="description"
          defaultValue=""
          disabled={isWorking}
          {...register('description', {
            required: 'This field is required',
          })}
        />
      </FormRow>
      <FormRow label="Event Location" error={errors?.location?.message}>
        <Input
          type="text"
          id="location"
          defaultValue=""
          disabled={isWorking}
          {...register('location', {
            required: 'This field is required',
          })}
        />
      </FormRow>
      <FormRow label="Category" error={errors?.category_idguid?.message}>
        {/* POPRAVITI style komponenta nova */}
        <select
          id="category_idguid"
          defaultValue={eventToEdit.category_idguid || ''}
          disabled={isWorking}
          {...register('category_idguid', {
            required: 'This field is required',
          })}
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((category) => (
            <option key={category.idguid} value={category.idguid}>
              {category.naziv}
            </option>
          ))}
        </select>
      </FormRow>

      <FormRow label="User" error={errors?.user_idguid?.message}>
        <Input
          type="text"
          id="user_display"
          value={`${user.first_name} ${user.last_name}`}
          disabled
        />
        <input
          type="hidden"
          id="user_idguid"
          value={user.idguid}
          {...register('user_idguid', {
            required: 'This field is required',
          })}
        />
      </FormRow>
      <FormRow label="Event Start Date" error={errors?.start_date?.message}>
        <Input
          type="date"
          id="start_date"
          defaultValue=""
          disabled={isWorking}
          {...register('start_date', {
            required: 'This field is required',
          })}
        />
      </FormRow>
      <FormRow label="Event End Date" error={errors?.end_date?.message}>
        <Input
          type="date"
          id="end_date"
          defaultValue=""
          disabled={isWorking}
          {...register('end_date', {
            required: 'This field is required',
          })}
        />
      </FormRow>
      <FormRow label="Is Public" error={errors?.is_public?.message}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <input type="checkbox" id="is_public" disabled={isWorking} {...register('is_public')} />
          {/* Prati vrijednost kroz watch da dinamički prikazuje labelu */}
          <label
            htmlFor="is_public"
            style={{
              color: watch('is_public') ? 'green' : 'red',
              fontWeight: 'bold',
              userSelect: 'none',
            }}
          >
            {watch('is_public') ? 'Public Event' : 'Private Event'}
          </label>
        </div>
      </FormRow>
      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation="secondary" type="reset" size="small" onClick={() => onCloseModal?.()}>
          Cancel
        </Button>
        <Button size="small" variation="primary" disabled={isWorking}>
          {isEditSession ? 'Edit event' : 'Create new event'}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateEventForm;
