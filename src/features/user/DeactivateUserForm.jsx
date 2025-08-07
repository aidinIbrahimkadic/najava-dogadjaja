import { useForm, Controller } from 'react-hook-form';

import Form from '../../ui/Form';
import Button from '../../ui/Button';
import FormRow from '../../ui/FormRow';
import FormField from '../../ui/FormField';

import { usePostDeactivateMe } from './usePostDeactivateMe';

import { StyledPasswordInput } from '../../ui/StyledPasswordInput';
import { LockOutlined } from '@ant-design/icons';

function DeactivateUserForm({ onCloseModal }) {
  const { postDeactivateMe, isEditing: isDeactivating } = usePostDeactivateMe();

  const { handleSubmit, formState, control } = useForm();
  const { errors } = formState;

  function onSubmit(data) {
    postDeactivateMe({ data });
  }

  function onError() {
    // console.log(errors);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)} type={onCloseModal ? 'modal' : 'regular'}>
      <FormRow columns="1fr">
        <FormField
          label="Unesite Vašu lozinku da biste deaktivirali profil"
          error={errors?.currentPassword?.message}
          required
        >
          <Controller
            name="current_password"
            control={control}
            rules={{
              required: 'Unesite Vašu lozinku da biste deaktivirali profil!',
              minLength: {
                value: 8,
                message: 'Lozinka mora imati najmanje 8 znakova!',
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                message: 'Lozinka mora sadržavati velika slova, mala slova i brojeve!',
              },
            }}
            render={({ field }) => (
              <StyledPasswordInput
                {...field}
                autoComplete="current_password"
                prefix={<LockOutlined />}
                placeholder="Unesite Vašu lozinku da biste deaktivirali profil"
                size="large"
                status={errors.password ? 'error' : ''}
              />
            )}
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
          title="Deaktiviraj korisnika"
          size="small"
          variation="danger"
          disabled={isDeactivating}
        >
          Deaktiviraj korisnika
        </Button>
      </FormRow>
    </Form>
  );
}

export default DeactivateUserForm;
