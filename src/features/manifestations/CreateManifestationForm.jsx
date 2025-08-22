import { useForm, Controller } from 'react-hook-form';
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

import { usePostManifestation } from './usePostManifestation';
import { useUpdateManifestation } from './useUpdateManifestation';
import Checkbox from '../../ui/Checkbox';
import { useEffect, useState } from 'react';
import { useGetLocations } from '../locations/useLocations';
import { useGetInstitutions } from '../institutions/useInstitutions';
// import { useGetUser } from '../users/useUser';
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

function CreateManifestationForm({ manifestationToEdit = {}, onCloseModal }) {
  const [existingSlika, setExistingSlika] = useState(null);
  const { mutate: deleteImage } = useDeleteImage();

  const { isCreating, postManifestation } = usePostManifestation();
  const { isEditing, updateManifestation } = useUpdateManifestation();
  const { isLoading: isLocationsLoading, locations } = useGetLocations();
  const { isLoading: isLoadingInstitutions, institutions } = useGetInstitutions();

  // KORISNIK KOJI JE LOGOVAN
  const { isLoadingUser, hasPermission, user } = useUserPermissions();

  const isWorking = isCreating || isEditing;

  let formatedValues = {};
  const { idguid: editIdd } = manifestationToEdit;
  const isEditSession = Boolean(editIdd);

  useEffect(() => {
    if (isEditSession && manifestationToEdit.slika) setExistingSlika(manifestationToEdit.slika);
  }, [isEditSession, manifestationToEdit]);

  // Pre-format za edit (UI-friendly)
  if (isEditSession) {
    formatedValues = {
      ...manifestationToEdit,
      start_time: format(new Date(manifestationToEdit.start_time), "yyyy-MM-dd'T'HH:mm"),
      end_time: format(new Date(manifestationToEdit.end_time), "yyyy-MM-dd'T'HH:mm"),
    };
  }

  const { idguid: editId, ...editValues } = formatedValues;

  const { register, handleSubmit, reset, watch, setValue, getValues, formState, control } = useForm(
    {
      defaultValues: isEditSession ? editValues : {},
    }
  );

  const { errors } = formState;

  // Postavi instituciju kad se user učita
  useEffect(() => {
    if (!isEditSession && user?.data?.institucija?.idguid && !isLoadingUser) {
      setValue('institucija_idguid', user.data.institucija.idguid);
    }
  }, [user, isLoadingUser, isEditSession, setValue]);

  function onSubmit(data) {
    const { start_time, end_time } = data;

    if (manifestationToEdit.slika && !existingSlika) {
      const id = manifestationToEdit.idguid;
      deleteImage({ id });
    }

    // Ako nema end_time, izračunaj (postojeće ponašanje)
    if (!end_time && start_time) {
      const newEnd = dayjs(start_time).add(DEFAULT_EVENT_DURATION_IN_HOURS, 'hour');
      data.end_time = newEnd.format('YYYY-MM-DDTHH:mm');
    }

    // Normalizuj root datume u ISOZ
    if (data.start_time) data.start_time = toISOZ(data.start_time);
    if (data.end_time) data.end_time = toISOZ(data.end_time);

    // Stringify da ne završi kao [object Object]
    const payload = { ...data };

    if (isEditSession)
      updateManifestation(
        { data: payload, editId },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    else {
      postManifestation(
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
        <FormRow columns="1fr">
          <FormField label="Naziv manifestacije" error={errors?.title?.message} required>
            <Input
              autoFocus
              type="text"
              id="title"
              disabled={isWorking}
              {...register('title', { required: 'Ovo polje je obavezno' })}
            />
          </FormField>
        </FormRow>

        <FormRow columns="1fr 1fr">
          <FormField label="Lokacija" error={errors?.location?.message}>
            {isLocationsLoading ? (
              <Spinner />
            ) : (
              <Select
                id="location"
                name="location"
                options={locations.map((c) => ({ value: c.idguid, label: c.naziv }))}
                disabled={isWorking}
                register={register}
                setValue={setValue}
                watch={watch}
              />
            )}
          </FormField>
          <FormField label="Institucija" error={errors?.institucija_idguid?.message}>
            {isLoadingInstitutions && isLoadingUser ? (
              <Spinner />
            ) : (
              <Select
                id="institucija_idguid"
                name="institucija_idguid"
                options={institutions?.map((inst) => ({
                  value: inst.idguid,
                  label: inst.naziv,
                }))}
                disabled={!hasPermission('events_institucije_save')}
                register={register}
                setValue={setValue}
                watch={watch}
              />
            )}
          </FormField>
        </FormRow>

        <FormRow>
          <FormField label="Opis manifestacije" error={errors?.description?.message}>
            <TextArea
              type="text"
              id="description"
              defaultValue=""
              disabled={isWorking}
              {...register('description')}
            />
          </FormField>
        </FormRow>

        {/* Single termin */}
        <FormRow columns="1fr 1fr">
          <FormField
            label="Datum i vrijeme početka manifestacije"
            error={errors?.start_time?.message}
            required
          >
            <Controller
              control={control}
              name="start_time"
              rules={{ required: 'Ovo polje je obavezno' }}
              render={({ field }) => (
                <CustomDatePicker
                  {...field}
                  id="start_time"
                  disabled={isWorking}
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => field.onChange(date ? date.format('YYYY-MM-DDTHH:mm') : '')}
                />
              )}
            />
          </FormField>

          <FormField
            label="Datum i vrijeme završetka manifestacije"
            error={errors?.end_time?.message}
          >
            <Controller
              control={control}
              name="end_time"
              rules={{
                validate: (value) => {
                  if (!value) return true;
                  const startRaw = getValues('start_time');
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
                  id="end_time"
                  disabled={isWorking}
                  value={field.value ? dayjs(field.value, 'YYYY-MM-DDTHH:mm') : null}
                  onChange={(date) => field.onChange(date ? date.format('YYYY-MM-DDTHH:mm') : '')}
                  disabledDate={(current) => {
                    const startRaw = getValues('start_time');
                    const start = startRaw ? dayjs(startRaw, 'YYYY-MM-DDTHH:mm') : null;
                    return current && start && current.isBefore(start, 'day');
                  }}
                  disabledTime={(current) => {
                    const startRaw = getValues('start_time');
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

export default CreateManifestationForm;
