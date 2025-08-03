import { useForm } from 'react-hook-form';

import Input from '../../ui/Input';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import FormRow from '../../ui/FormRow';
import FormField from '../../ui/FormField';
import { useUpdateMe } from './useUpdateMe';

function EditUserForm({ userToEdit = {}, onCloseModal }) {
  const { isEditing, updateMe } = useUpdateMe();

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: userToEdit.data,
  });
  const { errors } = formState;

  function onSubmit(data) {
    updateMe(
      { data },
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
      <FormRow columns="1fr">
        <FormField label="Username" error={errors?.username?.message}>
          <Input
            autoFocus
            type="text"
            id="username"
            disabled={isEditing}
            {...register('username')}
          />
        </FormField>
      </FormRow>

      <FormRow columns="1fr">
        <FormField label="Ime" error={errors?.first_name?.message}>
          <Input type="text" id="first_name" disabled={isEditing} {...register('first_name')} />
        </FormField>
        <FormField label="Prezime" error={errors?.last_name?.message}>
          <Input type="text" id="last_name" disabled={isEditing} {...register('last_name')} />
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
        <Button title="Uredi korisnika" size="small" variation="primary" disabled={isEditing}>
          Uredi korisnika
        </Button>
      </FormRow>
    </Form>
  );
}

export default EditUserForm;
