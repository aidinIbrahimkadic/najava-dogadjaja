import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';

import dayjs from 'dayjs';
import CustomDatePicker from '../../ui/CustomDatePicker';
import { DEFAULT_EVENT_DURATION_IN_HOURS, FILE_URL } from '../../utils/constants.js';

import Input from '../../ui/Input';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import FileInput from '../../ui/FileInput';
import TextArea from '../../ui/TextArea';
import FormRow from '../../ui/FormRow';
import FormField from '../../ui/FormField';
import Spinner from '../../ui/Spinner';
import Select from '../../ui/Select';

import { usePostEvent } from './usePostEvent';
import { useUpdateEvent } from './useUpdateEvent';
import { useGetCategories } from '../categories/useCategories';
import Checkbox from '../../ui/Checkbox';
import { useEffect, useState } from 'react';
import ExistingImagePreview from '../../ui/ExistingImagePreview';
import { useGetLocations } from '../locations/useLocations';
import { useGetInstitutions } from '../institutions/useInstitutions';
import { useGetUser } from '../users/useUser';
import { useUserPermissions } from '../authentication/useUserPermissions';

function CreateEventForm({ eventToEdit = {}, onCloseModal }) {
  const [existingSlika, setExistingSlika] = useState(null);

  const { isCreating, postEvent } = usePostEvent();
  const { isEditing, updateEvent } = useUpdateEvent();
  const { isLoading, categories } = useGetCategories();
  const { isLoading: isLocationsLoading, locations } = useGetLocations();
  const { isLoading: isLoadingInstitutions, institutions } = useGetInstitutions();

  //KORISNIK KOJI JE LOGOVAN
  const { isLoading: isLoadingPermission, hasPermission, user: userCreate } = useUserPermissions();

  //Ucitavamo korisnika sa vise informacija
  const { isLoading: isLoadingUser, user } = useGetUser(
    Object.keys(eventToEdit).length !== 0 ? eventToEdit?.user_idguid : userCreate?.idguid
  );

  const isWorking = isCreating || isEditing;

  let formatedValues = {};

  const { idguid: editIdd } = eventToEdit;
  const isEditSession = Boolean(editIdd);

  useEffect(() => {
    if (isEditSession && eventToEdit.slika) {
      setExistingSlika(eventToEdit.slika);
    }
  }, [isEditSession, eventToEdit]);

  if (isEditSession) {
    formatedValues = {
      ...eventToEdit,
      start_date: format(new Date(eventToEdit.start_date), "yyyy-MM-dd'T'HH:mm"),
      end_date: format(new Date(eventToEdit.end_date), "yyyy-MM-dd'T'HH:mm"),
      user_idguid: eventToEdit.user.idguid,
      cijena: eventToEdit.cijena ? parseFloat(eventToEdit.cijena).toFixed(2) : '0.00',
    };
  }

  const { idguid: editId, ...editValues } = formatedValues;

  const { register, handleSubmit, reset, watch, setValue, getValues, formState, control } = useForm(
    {
      defaultValues: isEditSession ? editValues : { cijena: 0, institucija_idguid: '' }, // Uklanjamo user?.data?.institucija?.idguid odavde
    }
  );
  const { errors } = formState;

  // Dodajemo useEffect koji će postaviti instituciju kada se user učita
  useEffect(() => {
    if (!isEditSession && user?.data?.institucija?.idguid && !isLoadingUser) {
      setValue('institucija_idguid', user.data.institucija.idguid);
    }
  }, [user, isLoadingUser, isEditSession, setValue]);

  // Takođe možemo dodati useEffect za user_idguid
  useEffect(() => {
    if (!isEditSession && user?.data?.idguid && !isLoadingUser) {
      setValue('user_idguid', user.data.idguid);
    }
  }, [user, isLoadingUser, isEditSession, setValue]);

  function onSubmit(data) {
    const { start_date, end_date } = data;

    if (!end_date && start_date) {
      const newEnd = dayjs(start_date).add(DEFAULT_EVENT_DURATION_IN_HOURS, 'hour');
      data.end_date = newEnd.format('YYYY-MM-DDTHH:mm');
    }

    data.cijena = parseFloat(Number(data.cijena || 0).toFixed(2));
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
          <FormField label="Naziv događaja" error={errors?.title?.message} required>
            <Input
              autoFocus
              type="text"
              id="title"
              disabled={isWorking}
              {...register('title', {
                required: 'Ovo polje je obavezno',
              })}
            />
          </FormField>
          <FormField label="Kategorija događaja" required error={errors?.category_idguid?.message}>
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
                  required: 'Molimo odaberite odgovarajuću kategoriju',
                }}
              />
            )}
          </FormField>
        </FormRow>
        <FormRow columns="1fr 1fr">
          <FormField label="Lokacija događaja" required error={errors?.location?.message}>
            {isLocationsLoading ? (
              <Spinner />
            ) : (
              <Select
                id="location"
                name="location"
                options={locations.data.map((c) => ({
                  value: c.idguid,
                  label: c.naziv,
                }))}
                disabled={isWorking}
                register={register}
                setValue={setValue}
                watch={watch}
                validation={{
                  required: 'Molimo odaberite odgovarajuću lokaciju događaja',
                }}
              />
            )}
          </FormField>
          <FormField label="Korisnik" error={errors?.user_idguid?.message}>
            <Input
              type="text"
              id="user_display"
              value={`${user?.data?.first_name || ''} ${user?.data?.last_name || ''}`}
              disabled
            />
            <input
              type="hidden"
              id="user_idguid"
              value={user?.data?.idguid || ''}
              {...register('user_idguid', {
                required: 'Ovo polje je obavezno',
              })}
            />
          </FormField>
        </FormRow>
        <FormRow columns="1fr 1fr">
          <FormField label="Institucija" required error={errors?.institucija_idguid?.message}>
            {isLoadingInstitutions && isLoadingPermission && isLoadingUser ? (
              <Spinner />
            ) : (
              <Select
                id="institucija_idguid"
                name="institucija_idguid"
                options={institutions?.data?.map((inst) => ({
                  value: inst.idguid,
                  label: inst.naziv,
                }))}
                disabled={!hasPermission('events_institucije_save')}
                register={register}
                setValue={setValue}
                watch={watch}
                validation={{
                  required: 'Molimo odaberite odgovarajuću instituciju',
                }}
              />
            )}
          </FormField>
          <FormField label="Cijena (KM)" error={errors?.cijena?.message}>
            <Controller
              control={control}
              name="cijena"
              rules={{
                min: { value: 0, message: 'Cijena ne može biti negativna' },
              }}
              render={({ field }) => (
                <Input
                  type="number"
                  step="0.05"
                  min="0"
                  id="cijena"
                  disabled={isWorking}
                  value={field.value}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    field.onChange(isNaN(value) ? 0 : parseFloat(value.toFixed(2)));
                  }}
                />
              )}
            />
          </FormField>
        </FormRow>
        <FormRow>
          <FormField label="Opis događaja" error={errors?.description?.message}>
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
          <FormField
            label="Datum i vrijeme početka događaja"
            error={errors?.start_date?.message}
            required
          >
            <Controller
              control={control}
              name="start_date"
              rules={{ required: 'Ovo polje je obavezno' }}
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
          <FormField label="Datum i vrijeme završetka događaja" error={errors?.end_date?.message}>
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
                    return 'Datum i vrijeme završetka ne mogu biti raniji od datuma i vremena početka događaja';
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
        <FormRow columns="1fr 1fr">
          <FormField label="Poster:" error={errors?.slika?.message}>
            {existingSlika ? (
              <ExistingImagePreview
                slikaUrl={`${FILE_URL}${existingSlika}`}
                onRemove={() => {
                  setExistingSlika(null);
                  setValue('slika', null);
                }}
              />
            ) : (
              <FileInput id="slika" accept="image/*" disabled={isWorking} {...register('slika')} />
            )}
          </FormField>
          <FormField error={errors?.is_public?.message}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <label
                htmlFor="is_public"
                style={{
                  fontWeight: 'bold',
                  userSelect: 'none',
                }}
              >
                Javno vidljivo
              </label>
              <Checkbox id="is_public" disabled={isWorking} {...register('is_public')} />
            </div>
          </FormField>
        </FormRow>

        <FormRow>
          <Button
            variation="secondary"
            title="Odustani"
            type="reset"
            size="small"
            onClick={() => onCloseModal?.()}
          >
            Odustani
          </Button>
          <Button
            title={isEditSession ? 'Uredi događaj' : 'Dodaj novi događaj'}
            size="small"
            variation="primary"
            disabled={isWorking}
          >
            {isEditSession ? 'Uredi događaj' : 'Dodaj novi događaj'}
          </Button>
        </FormRow>
      </Form>
    </>
  );
}

export default CreateEventForm;
