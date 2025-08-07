import { useForm } from 'react-hook-form';

import Input from '../../ui/Input';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import FormRow from '../../ui/FormRow';
import FormField from '../../ui/FormField';
import { useUpdateMe } from './useUpdateMe';
import Checkbox from '../../ui/Checkbox';
import { usePostActivate } from './usePostActivate';
import { usePostDeactivate } from './usePostDeactivate';

function EditUserForm({ userToEdit = {}, onCloseModal }) {
  const { isEditing, updateMe } = useUpdateMe();
  const { postActivate, isEditing: isActivating } = usePostActivate();
  const { postDeactivate, isEditing: isDeactivating } = usePostDeactivate();

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: userToEdit.data,
  });
  const { errors } = formState;

  function onSubmit(data) {
    //POPRAVITI Ne radi aktivacija i deaktivacija korisnika, ne moze korisnik sam se aktivirati ili deaktivirati jer nema prava

    if (userToEdit.data.active && !data.active) {
      postDeactivate({ id: userToEdit.data.idguid }, { onSuccess: () => reset() });
      return;
    }

    if (!userToEdit.data.active && data.active) {
      postActivate({ id: userToEdit.data.idguid }, { onSuccess: () => reset() });
      return;
    }

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

  // console.log(userToEdit.data.active);

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
      <FormRow columns="1fr">
        <FormField error={errors?.active?.message}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label
              htmlFor="active"
              style={{
                fontWeight: 'bold',
                userSelect: 'none',
              }}
            >
              {userToEdit?.data?.active ? 'Aktivan korisnik' : 'Neaktivan korisnik'}
            </label>
            <Checkbox
              id="active"
              disabled={isActivating || isDeactivating}
              {...register('active')}
            />
          </div>
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
