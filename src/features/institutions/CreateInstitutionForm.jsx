import { useForm } from 'react-hook-form';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import FormRow from '../../ui/FormRow';
import FormField from '../../ui/FormField';
import Input from '../../ui/Input';
import { usePostInstitution } from './usePostInstitution';
import { useUpdateInstitution } from './useUpdateInstitution';
import Textarea from '../../ui/TextArea';

// Unified styled component for all input types

function CreateInstitutionForm({ institutionToEdit = {}, onCloseModal }) {
  const { isCreating, postInstitution } = usePostInstitution();
  const { isEditing, updateInstitution } = useUpdateInstitution();
  const isWorking = isCreating || isEditing;
  const { idguid: editId, ...editValues } = institutionToEdit;
  const isEditSession = Boolean(editId);

  const { handleSubmit, reset, formState, register } = useForm({
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
      <FormRow>
        <FormField label="Naziv institucije" error={errors?.naziv?.message} required>
          <Input
            autoFocus
            type="text"
            id="naziv"
            disabled={isWorking}
            {...register('naziv', {
              required: 'Ovo polje je obavezno',
            })}
          />
        </FormField>
      </FormRow>
      <FormRow>
        <FormField label="Opis institucije" error={errors?.opis?.message}>
          <Textarea type="text" id="opis" disabled={isWorking} {...register('opis')} />
        </FormField>
      </FormRow>

      <FormRow>
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
          title={isEditSession ? 'Uredi instituciju' : 'Dodaj novog instituciju'}
          size="small"
          variation="primary"
          disabled={isWorking}
        >
          {isEditSession ? 'Uredi instituciju' : 'Dodaj novog instituciju'}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateInstitutionForm;
