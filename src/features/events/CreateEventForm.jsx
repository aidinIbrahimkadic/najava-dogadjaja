import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';

import dayjs from 'dayjs';
import CustomDatePicker from '../../ui/CustomDatePicker';
import { DEFAULT_EVENT_DURATION_IN_HOURS } from '../../utils/constants.js';

import Input from '../../ui/Input';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
// import FileInput from '../../ui/FileInput';
import TextArea from '../../ui/TextArea';
import FormRow from '../../ui/FormRow';
import FormField from '../../ui/FormField';
import Spinner from '../../ui/Spinner';
import Select from '../../ui/Select';

import { usePostEvent } from './usePostEvent';
import { useUpdateEvent } from './useUpdateEvent';
import { useGetCategories } from '../categories/useCategories';
import { useUserProfile } from '../authentication/useUserProfile';
import Checkbox from '../../ui/Checkbox';

function CreateEventForm({ eventToEdit = {}, onCloseModal }) {
  const { isCreating, postEvent } = usePostEvent();
  const { isEditing, updateEvent } = useUpdateEvent();
  const { isLoading, categories } = useGetCategories();

  //POPRAVITI povuci korisnika na osnovu IDa i dodati isLoading
  const { user } = useUserProfile();

  const isWorking = isCreating || isEditing;

  let formatedValues = {};

  const { idguid: editIdd } = eventToEdit;
  const isEditSession = Boolean(editIdd);

  if (isEditSession) {
    formatedValues = {
      ...eventToEdit,
      start_date: format(new Date(eventToEdit.start_date), "yyyy-MM-dd'T'HH:mm"),
      end_date: format(new Date(eventToEdit.end_date), "yyyy-MM-dd'T'HH:mm"),
      user_idguid: user.idguid,
    };
  }
  const { idguid: editId, ...editValues } = formatedValues;

  const { register, handleSubmit, reset, watch, setValue, getValues, formState, control } = useForm(
    {
      defaultValues: isEditSession ? editValues : {},
    }
  );

  const { errors } = formState;

  function onSubmit(data) {
    const { start_date, end_date } = data;

    if (!end_date && start_date) {
      const newEnd = dayjs(start_date).add(DEFAULT_EVENT_DURATION_IN_HOURS, 'hour');
      data.end_date = newEnd.format('YYYY-MM-DDTHH:mm');
    }

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
    <>
      <Form onSubmit={handleSubmit(onSubmit, onError)} type={onCloseModal ? 'modal' : 'regular'}>
        <FormRow columns="1fr 1fr">
          <FormField label="Title" error={errors?.title?.message} required>
            <Input
              type="text"
              id="title"
              disabled={isWorking}
              {...register('title', {
                required: 'This field is required',
              })}
            />
          </FormField>
          <FormField label="Category" required error={errors?.category_idguid?.message}>
            {isLoading ? (
              <Spinner />
            ) : (
              <Select
                id="category_idguid"
                name="category_idguid"
                options={categories.map((c) => ({
                  value: c.idguid,
                  label: c.naziv,
                }))}
                disabled={isWorking}
                register={register}
                setValue={setValue}
                watch={watch}
                validation={{
                  required: 'Please select a category',
                }}
              />
            )}
          </FormField>
        </FormRow>
        <FormRow columns="1fr 1fr">
          <FormField label="Event Location" required error={errors?.location?.message}>
            <Input
              type="text"
              id="location"
              defaultValue=""
              disabled={isWorking}
              {...register('location', {
                required: 'This field is required',
              })}
            />
          </FormField>
          <FormField label="User" error={errors?.user_idguid?.message}>
            <Input
              type="text"
              id="user_display"
              value={`${user?.first_name} ${user?.last_name}`}
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
          </FormField>
        </FormRow>

        <FormRow>
          <FormField label="Event Description" error={errors?.description?.message}>
            <TextArea
              type="text"
              id="description"
              defaultValue=""
              disabled={isWorking}
              {...register('description')}
            />
          </FormField>
        </FormRow>

        <FormRow columns="1fr 1fr">
          <FormField label="Event Start Date" error={errors?.start_date?.message} required>
            <Controller
              control={control}
              name="start_date"
              rules={{ required: 'This field is required' }}
              render={({ field }) => (
                <CustomDatePicker
                  {...field}
                  id="start_date"
                  disabled={isWorking}
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => field.onChange(date ? date.format('YYYY-MM-DDTHH:mm') : '')}
                />
              )}
            />
          </FormField>
          <FormField label="Event End Date" error={errors?.end_date?.message}>
            <Controller
              control={control}
              name="end_date"
              rules={{
                validate: (value) => {
                  if (!value) return true;

                  const startRaw = getValues('start_date');
                  const start = startRaw ? dayjs(startRaw, 'YYYY-MM-DDTHH:mm') : null;
                  const end = value ? dayjs(value, 'YYYY-MM-DDTHH:mm') : null;

                  if (start && end && end.isBefore(start)) {
                    return 'End date cannot be before start date';
                  }

                  return true;
                },
              }}
              render={({ field }) => (
                <CustomDatePicker
                  {...field}
                  id="end_date"
                  disabled={isWorking}
                  value={field.value ? dayjs(field.value, 'YYYY-MM-DDTHH:mm') : null}
                  onChange={(date) => field.onChange(date ? date.format('YYYY-MM-DDTHH:mm') : '')}
                  disabledDate={(current) => {
                    const startRaw = getValues('start_date');
                    const start = startRaw ? dayjs(startRaw, 'YYYY-MM-DDTHH:mm') : null;
                    return current && start && current.isBefore(start, 'day');
                  }}
                  disabledTime={(current) => {
                    const startRaw = getValues('start_date');
                    const start = startRaw ? dayjs(startRaw, 'YYYY-MM-DDTHH:mm') : null;

                    if (!current || !start) return {};

                    if (current.isSame(start, 'day')) {
                      const disabledHours = () =>
                        Array.from({ length: 24 }, (_, i) => i).filter((h) => h < start.hour());

                      const disabledMinutes = (selectedHour) => {
                        // Ako je trenutni sat isti kao startov, onda blokiraj minute manje od start.minute()
                        if (selectedHour === start.hour()) {
                          return Array.from({ length: 60 }, (_, i) => i).filter(
                            (i) => ![0, 15, 30, 45].includes(i) || i < start.minute()
                          );
                        }

                        // Ako je sat manji od startovog, blokiraj sve minute
                        if (selectedHour < start.hour()) {
                          return Array.from({ length: 60 }, (_, i) => i);
                        }

                        // Ako je sat veći, prikazi samo 0,15,30,45
                        return Array.from({ length: 60 }, (_, i) => i).filter(
                          (i) => ![0, 15, 30, 45].includes(i)
                        );
                      };

                      return {
                        disabledHours,
                        disabledMinutes,
                      };
                    }
                  }}
                />
              )}
            />
          </FormField>
        </FormRow>
        <FormRow>
          <FormField error={errors?.is_public?.message}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <label
                htmlFor="is_public"
                style={{
                  fontWeight: 'bold',
                  userSelect: 'none',
                }}
              >
                Public Event
              </label>
              <Checkbox id="is_public" disabled={isWorking} {...register('is_public')} />
            </div>
          </FormField>
        </FormRow>

        <FormRow>
          <Button variation="secondary" type="reset" size="small" onClick={() => onCloseModal?.()}>
            Cancel
          </Button>
          <Button size="small" variation="primary" disabled={isWorking}>
            {isEditSession ? 'Edit event' : 'Create new event'}
          </Button>
        </FormRow>
      </Form>
    </>
  );
}

export default CreateEventForm;

// <Select
//   id="category_idguid"
//   name="category_idguid"
//   register={register}
//   options={categories}
//   defaultValue={eventToEdit?.category_idguid || ''}
//   disabled={isWorking}
//   required
//   validation={{
//     required: 'This field is required',
//   }}
//   placeholder="Select a category"
// />

/* 
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
                    {categories?.map((category) => (
                      <option key={category.idguid} value={category.idguid}>
                        {category.naziv}
                      </option>
                    ))}
                  </select>
                 */
