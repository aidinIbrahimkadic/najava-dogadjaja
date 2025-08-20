import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import CustomDatePicker from '../../ui/CustomDatePicker';
import { DEFAULT_EVENT_DURATION_IN_HOURS } from '../../utils/constants.js';

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
import { useGetLocations } from '../locations/useLocations';
import { useGetInstitutions } from '../institutions/useInstitutions';
import { useGetUser } from '../users/useUser';
import { useUserPermissions } from '../authentication/useUserPermissions';
import { ImageCell } from '../../ui/ImageCell';
import { useDeleteImage } from './useDeleteImage';

// Pretvori lokalni 'YYYY-MM-DDTHH:mm' u ISO-8601 sa Z
const toISOZ = (val) => {
  if (!val) return '';
  let d = dayjs(val);
  if (!d.isValid()) d = dayjs(val, 'YYYY-MM-DDTHH:mm');
  if (!d.isValid()) return '';
  return d.second(0).millisecond(0).toDate().toISOString();
};

// Lokalno vrijeme → ISO sa offsetom (npr. ...20:00:00+02:00), BEZ 'Z'

function CreateEventForm({ eventToEdit = {}, onCloseModal }) {
  const [existingSlika, setExistingSlika] = useState(null);
  const { mutate: deleteImage } = useDeleteImage();

  const { isCreating, postEvent } = usePostEvent();
  const { isEditing, updateEvent } = useUpdateEvent();
  const { isLoading, categories: categoriesFromAPI } = useGetCategories();
  const { isLoading: isLocationsLoading, locations } = useGetLocations();
  const { isLoading: isLoadingInstitutions, institutions } = useGetInstitutions();

  // PRIKAZI SAMO CHILD KATEGORIJE
  const categories = categoriesFromAPI?.filter((category) => {
    if (category.parent_idguid !== '00000000-0000-0000-0000-000000000000') return category;
  });

  // KORISNIK KOJI JE LOGOVAN
  const { isLoading: isLoadingPermission, hasPermission, user: userCreate } = useUserPermissions();

  // Ucitavamo korisnika sa vise informacija
  const { isLoading: isLoadingUser, user } = useGetUser(
    Object.keys(eventToEdit).length !== 0 ? eventToEdit?.user_idguid : userCreate?.idguid
  );

  const isWorking = isCreating || isEditing;

  let formatedValues = {};
  const { idguid: editIdd } = eventToEdit;
  const isEditSession = Boolean(editIdd);

  useEffect(() => {
    if (isEditSession && eventToEdit.slika) setExistingSlika(eventToEdit.slika);
  }, [isEditSession, eventToEdit]);

  // Pre-format za edit (UI-friendly)
  if (isEditSession) {
    formatedValues = {
      ...eventToEdit,
      start_date: format(new Date(eventToEdit.start_date), "yyyy-MM-dd'T'HH:mm"),
      end_date: format(new Date(eventToEdit.end_date), "yyyy-MM-dd'T'HH:mm"),
      user_idguid: eventToEdit.user.idguid,
      cijena: eventToEdit.cijena ? parseFloat(eventToEdit.cijena).toFixed(2) : '0.00',
      ima_vise_termina: Array.isArray(eventToEdit.termini) && eventToEdit.termini.length > 1,
      termini: Array.isArray(eventToEdit.termini)
        ? eventToEdit.termini.map((t) => ({
            start_datetime: format(
              new Date(t.start_datetime || t.start_date || eventToEdit.start_date),
              "yyyy-MM-dd'T'HH:mm"
            ),
            end_datetime: format(
              new Date(t.end_datetime || t.end_date || t.start_datetime || eventToEdit.start_date),
              "yyyy-MM-dd'T'HH:mm"
            ),
          }))
        : [],
    };
  }

  const { idguid: editId, ...editValues } = formatedValues;

  const { register, handleSubmit, reset, watch, setValue, getValues, formState, control } = useForm(
    {
      defaultValues: isEditSession
        ? editValues
        : {
            cijena: 0,
            institucija_idguid: '',
            ima_vise_termina: false,
            termini: [],
          },
    }
  );

  const { errors } = formState;
  const ima_vise_termina = watch('ima_vise_termina');

  const { fields, append, remove } = useFieldArray({ control, name: 'termini' });

  // Postavi instituciju kad se user učita
  useEffect(() => {
    if (!isEditSession && user?.data?.institucija?.idguid && !isLoadingUser) {
      setValue('institucija_idguid', user.data.institucija.idguid);
    }
  }, [user, isLoadingUser, isEditSession, setValue]);

  // Postavi user_idguid kad se user učita
  useEffect(() => {
    if (!isEditSession && user?.data?.idguid && !isLoadingUser) {
      setValue('user_idguid', user.data.idguid);
    }
  }, [user, isLoadingUser, isEditSession, setValue]);

  function onSubmit(data) {
    const { start_date, end_date } = data;

    if (eventToEdit.slika && !existingSlika) {
      const id = eventToEdit.idguid;
      deleteImage({ id });
    }

    // Ako nema end_date, izračunaj (postojeće ponašanje)
    if (!end_date && start_date) {
      const newEnd = dayjs(start_date).add(DEFAULT_EVENT_DURATION_IN_HOURS, 'hour');
      data.end_date = newEnd.format('YYYY-MM-DDTHH:mm');
    }

    // Normalizuj root datume u ISOZ
    if (data.start_date) data.start_date = toISOZ(data.start_date);
    if (data.end_date) data.end_date = toISOZ(data.end_date);

    const preparedTermini = ima_vise_termina
      ? (data.termini || [])
          .filter((t) => t?.start_datetime || t?.start_date)
          .map((t) => {
            const s = toISOZ(t.start_datetime || t.start_date);
            return { start_date: s, end_date: s };
          })
      : data.start_date
        ? // single-termin slučaj ostaje kao i do sada (UTC), jer ti radi dobro
          [{ start_date: data.start_date, end_date: data.start_date }]
        : [];

    if (ima_vise_termina && preparedTermini.length > 0) {
      const earliestISO = preparedTermini
        .map((t) => dayjs(t.start_date)) // već je offset-aware (…+02:00)
        .filter((d) => d.isValid())
        .sort((a, b) => a.valueOf() - b.valueOf())[0]
        .toDate()
        .toISOString();

      data.start_date = earliestISO;
      if (!data.end_date) data.end_date = earliestISO;
    }

    data.ima_vise_termina = !!ima_vise_termina;

    // Stringify da ne završi kao [object Object]
    data.termini = JSON.stringify(preparedTermini);
    data.is_public = data.is_public ? true : false;
    data.ima_vise_termina = data.ima_vise_termina ? true : false;

    data.cijena = parseFloat(Number(data.cijena || 0).toFixed(2));

    console.log('pred submit', data);
    const payload = { ...data };

    if (isEditSession)
      updateEvent(
        { data: payload, editId },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    else {
      postEvent(
        { ...payload },
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
              {...register('title', { required: 'Ovo polje je obavezno' })}
            />
          </FormField>

          <FormField label="Kategorija događaja" required error={errors?.category_idguid?.message}>
            {isLoading ? (
              <Spinner />
            ) : (
              <Select
                id="category_idguid"
                name="category_idguid"
                options={categories.map((c) => ({ value: c.idguid, label: c.naziv }))}
                disabled={isWorking}
                register={register}
                setValue={setValue}
                watch={watch}
                validation={{ required: 'Molimo odaberite odgovarajuću kategoriju' }}
              />
            )}
          </FormField>
        </FormRow>

        <FormRow columns="1fr 1fr">
          <FormField label="Lokacija događaja" required error={errors?.location_idguid?.message}>
            {isLocationsLoading ? (
              <Spinner />
            ) : (
              <Select
                id="location_idguid"
                name="location_idguid"
                options={locations.data.map((c) => ({ value: c.idguid, label: c.naziv }))}
                disabled={isWorking}
                register={register}
                setValue={setValue}
                watch={watch}
                validation={{ required: 'Molimo odaberite odgovarajuću lokaciju događaja' }}
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
              {...register('user_idguid', { required: 'Ovo polje je obavezno' })}
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
                validation={{ required: 'Molimo odaberite odgovarajuću instituciju' }}
              />
            )}
          </FormField>

          <FormField label="Cijena (KM)" error={errors?.cijena?.message}>
            <Controller
              control={control}
              name="cijena"
              rules={{ min: { value: 0, message: 'Cijena ne može biti negativna' } }}
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

        {/* Toggle za više termina */}
        <FormRow>
          <FormField error={errors?.ima_vise_termina?.message}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <label htmlFor="ima_vise_termina" style={{ fontWeight: 'bold', userSelect: 'none' }}>
                Više termina
              </label>
              <Checkbox
                id="ima_vise_termina"
                disabled={isWorking}
                {...register('ima_vise_termina')}
              />
            </div>
          </FormField>
        </FormRow>

        {/* Single termin */}
        {!ima_vise_termina && (
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
                          if (selectedHour === start.hour()) {
                            return Array.from({ length: 60 }, (_, i) => i).filter(
                              (i) => ![0, 15, 30, 45].includes(i) || i < start.minute()
                            );
                          }
                          if (selectedHour < start.hour())
                            return Array.from({ length: 60 }, (_, i) => i);
                          return Array.from({ length: 60 }, (_, i) => i).filter(
                            (i) => ![0, 15, 30, 45].includes(i)
                          );
                        };
                        return { disabledHours, disabledMinutes };
                      }
                    }}
                  />
                )}
              />
            </FormField>
          </FormRow>
        )}

        {/* Više termina */}
        {ima_vise_termina && (
          <>
            <FormRow>
              <FormField
                label="Termini"
                error={
                  errors?.termini?.message ||
                  (Array.isArray(errors?.termini) &&
                    errors.termini.find((e) => e?.start_datetime?.message)?.start_datetime?.message)
                }
                required
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {fields.length === 0 && (
                    <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                      Dodajte barem jedan termin.
                    </div>
                  )}

                  {fields.map((fieldItem, index) => (
                    <div
                      key={fieldItem.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto',
                        gap: '0.75rem',
                        alignItems: 'center',
                        background: '#fff',
                        borderRadius: '0.75rem',
                        padding: '0.75rem',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                      }}
                    >
                      <Controller
                        control={control}
                        name={`termini.${index}.start_datetime`}
                        rules={{ required: 'Molimo odaberite datum i vrijeme' }}
                        render={({ field }) => (
                          <CustomDatePicker
                            {...field}
                            id={`termini_${index}_start`}
                            value={field.value ? dayjs(field.value) : null}
                            onChange={(date) => {
                              const v = date ? date.format('YYYY-MM-DDTHH:mm') : '';
                              field.onChange(v);
                              setValue(`termini.${index}.end_datetime`, v); // end = start
                            }}
                            disabled={isWorking}
                          />
                        )}
                      />

                      <Button
                        variation="secondary"
                        size="small"
                        type="button"
                        title="Ukloni termin"
                        onClick={() => remove(index)}
                      >
                        Ukloni
                      </Button>
                    </div>
                  ))}

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button
                      type="button"
                      size="small"
                      variation="primary"
                      onClick={() => append({ start_datetime: '', end_datetime: '' })}
                      disabled={isWorking}
                    >
                      + Dodaj termin
                    </Button>
                  </div>
                </div>
              </FormField>
            </FormRow>
          </>
        )}

        <FormRow columns="1fr 1fr">
          <FormField label="Poster:" error={errors?.slika?.message}>
            {existingSlika && existingSlika !== '00000000-0000-0000-0000-000000000000' ? (
              <ImageCell
                slika={existingSlika}
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
              <label htmlFor="is_public" style={{ fontWeight: 'bold', userSelect: 'none' }}>
                Javno vidljivo
              </label>
              <Checkbox id="is_public" disabled={isWorking} {...register('is_public')} />
            </div>
          </FormField>
        </FormRow>

        <FormRow buttons="has">
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
