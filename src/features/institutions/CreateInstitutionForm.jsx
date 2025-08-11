import { Controller, useForm } from 'react-hook-form';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import FormRow from '../../ui/FormRow';
import FormField from '../../ui/FormField';
import Input from '../../ui/Input';
import { usePostInstitution } from './usePostInstitution';
import { useUpdateInstitution } from './useUpdateInstitution';
import Textarea from '../../ui/TextArea';
import { StyledInput } from '../../ui/StyledInput';
import { MailOutlined } from '@ant-design/icons';
import InputColor from '../../ui/InputColor';
import { useEffect, useState } from 'react';
import { FILE_URL } from '../../utils/constants';
import FileInput from '../../ui/FileInput';

function CreateInstitutionForm({ institutionToEdit = {}, onCloseModal }) {
  const { isCreating, postInstitution } = usePostInstitution();
  const { isEditing, updateInstitution } = useUpdateInstitution();
  const isWorking = isCreating || isEditing;
  const { idguid: editId, ...editValues } = institutionToEdit;
  const isEditSession = Boolean(editId);

  const [existingSlika, setExistingSlika] = useState();
  const [logoDeleted, setLogoDeleted] = useState(false); // Dodao flag za brisanje

  const { handleSubmit, reset, formState, control, register, setValue } = useForm({
    defaultValues: isEditSession ? { ...editValues, logo: existingSlika } : {},
  });
  const { errors } = formState;

  useEffect(() => {
    // Dodao provjeru da li je logo obrisan - ako jeste, ne postavljaj ga ponovo
    if (editValues.logo && !logoDeleted) {
      // Ako je logo već base64
      if (/^data:image\/[a-z]+;base64,/.test(editValues.logo)) {
        setExistingSlika(editValues.logo);
      }
    }
  }, [editValues, setValue, reset, setExistingSlika, logoDeleted]); // Dodao logoDeleted u dependencies

  function onSubmit(payload) {
    const data = {
      ...payload,
      // Ako je logo obrisan, pošalji null, inače koristi payload.logo ili postojeći
      logo: logoDeleted ? null : payload.logo?.length ? payload.logo : existingSlika,
    };

    if (isEditSession)
      updateInstitution(
        { data, editId },
        {
          onSuccess: () => {
            reset();
            setLogoDeleted(false); // Reset flag-a nakon uspješnog submit-a
            onCloseModal?.();
          },
        }
      );
    else
      postInstitution(
        { ...data },
        {
          onSuccess: () => {
            reset();
            setLogoDeleted(false); // Reset flag-a nakon uspješnog submit-a
            onCloseModal?.();
          },
        }
      );
  }

  function onError() {
    // console.log(errors);
  }

  // Funkcija za brisanje loga
  const handleDeleteLogo = () => {
    setExistingSlika(null);
    setValue('logo', null);
    setLogoDeleted(true); // Postavi flag da je logo obrisan
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)} type={onCloseModal ? 'modal' : 'regular'}>
      <FormRow columns="1fr 1fr">
        <FormField label="Naziv institucije" error={errors?.naziv?.message} required>
          <Input
            autoFocus
            type="text"
            id="naziv"
            placeholder="Unesite naziv institucije"
            disabled={isWorking}
            {...register('naziv', {
              required: 'Ovo polje je obavezno',
            })}
          />
        </FormField>
        <FormField label="Ime direktora" error={errors?.ime_direktora?.message}>
          <Input
            type="text"
            id="ime_direktora"
            placeholder="Unesite ime direktora institucije"
            disabled={isWorking}
            {...register('ime_direktora')}
          />
        </FormField>
      </FormRow>
      <FormRow columns="1fr 1fr">
        <FormField label="Email" error={errors?.email?.message}>
          <Controller
            name="email"
            control={control}
            rules={{
              required: 'Molimo unesite email adresu!',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Molimo unesite validnu email adresu!',
              },
            }}
            render={({ field }) => (
              <StyledInput
                disabled={isEditing}
                {...field}
                prefix={<MailOutlined />}
                placeholder="Email adresa"
                size="large"
                status={errors?.email ? 'error' : ''}
              />
            )}
          />
        </FormField>
        <FormField label="Broj telefona" error={errors?.broj_telefona?.message}>
          <Input
            type="text"
            placeholder="Unesite broj telefona institucije"
            id="broj_telefona"
            disabled={isWorking}
            {...register('broj_telefona')}
          />
        </FormField>
      </FormRow>
      <FormRow columns="1fr 1fr">
        <FormField label="Adresa" error={errors?.adresa?.message}>
          <Input
            type="text"
            id="adresa"
            placeholder="Unesite adresu institucije"
            disabled={isWorking}
            {...register('adresa')}
          />
        </FormField>
        <FormField label="Web stranica" error={errors?.web_stranica?.message}>
          <Input
            type="text"
            disabled={isWorking}
            placeholder="Unesite link web stranice institucije"
            id="web_stranica"
            {...register('web_stranica', {
              pattern: {
                value: /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/\S*)?$/,
                message: 'Unesite ispravan link web stranice',
              },
            })}
          />
        </FormField>
      </FormRow>
      <FormRow>
        <FormField label="Opis institucije" error={errors?.opis?.message}>
          <Textarea
            type="text"
            id="opis"
            disabled={isWorking}
            {...register('opis')}
            placeholder="Unesite opis institucije"
          />
        </FormField>
      </FormRow>
      <FormRow columns="1fr 1fr">
        <FormField
          label="Pozadinska boja zadanog postera institucije"
          error={errors?.boja_pozadine_postera?.message}
        >
          <InputColor
            type="color"
            id="boja_pozadine_postera"
            defaultValue="#ffffff"
            disabled={isWorking}
            {...register('boja_pozadine_postera')}
          />
        </FormField>

        <FormField label="Logotip" error={errors?.logo?.message}>
          {existingSlika && !logoDeleted ? ( // Dodao provjeru logoDeleted flag-a
            <div
              style={{
                position: 'relative',
                display: 'inline-block',
                width: 'fit-content',
              }}
            >
              <img
                src={
                  /^data:image\/[a-z]+;base64,/.test(existingSlika)
                    ? existingSlika
                    : `${FILE_URL}${existingSlika}`
                }
                alt="Logotip"
                style={{
                  display: 'block',
                  maxWidth: '200px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                }}
              />
              <button
                type="button"
                onClick={handleDeleteLogo} // Koristim novu funkciju
                style={{
                  position: 'absolute',
                  top: '-1rem',
                  right: '-1rem',
                  backgroundColor: 'var(--color-red-500)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>
          ) : (
            <FileInput
              disabled={isEditing}
              id="logo"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onloadend = () => {
                  setExistingSlika(reader.result); // base64 prikaz
                  setValue('logo', file); // proslijedi RHF-u
                  setLogoDeleted(false); // Reset flag-a kada se učita nova slika
                };

                reader.readAsDataURL(file);
              }}
            />
          )}
        </FormField>
      </FormRow>
      <FormRow buttons="has">
        <Button
          title="Odustani"
          variation="secondary"
          type="reset"
          size="small"
          onClick={() => onCloseModal?.()}
        >
          Odustani
        </Button>
        <Button
          title={isEditSession ? 'Uredi instituciju' : 'Dodaj novu instituciju'}
          size="small"
          variation="primary"
          disabled={isWorking}
        >
          {isEditSession ? 'Uredi instituciju' : 'Dodaj novu instituciju'}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateInstitutionForm;
