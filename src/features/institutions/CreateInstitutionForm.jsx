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

// Unified styled component for all input types

function CreateInstitutionForm({ institutionToEdit = {}, onCloseModal }) {
  const { isCreating, postInstitution } = usePostInstitution();
  const { isEditing, updateInstitution } = useUpdateInstitution();
  const isWorking = isCreating || isEditing;
  const { idguid: editId, ...editValues } = institutionToEdit;
  const isEditSession = Boolean(editId);

  const { handleSubmit, reset, formState, control, register } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });
  const { errors } = formState;

  function onSubmit(data) {
    if (isEditSession)
      updateInstitution(
        { data, editId },
        {
          onSuccess: () => {
            reset();
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
            onCloseModal?.();
          },
        }
      );
  }

  function onError() {
    // console.log(errors);
  }

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
        {/* <FormField label="Email" error={errors?.email?.message}>
          <Input type="text" id="email" disabled={isWorking} {...register('email')} />
        </FormField> */}
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
