import { useForm, Controller } from 'react-hook-form';

import Form from '../../ui/Form';
import Button from '../../ui/Button';
import FormRow from '../../ui/FormRow';
import FormField from '../../ui/FormField';
import { LockOutlined } from '@ant-design/icons';

import { usePostChangePassword } from './usePostChangePassword';

import { StyledPasswordInput } from '../../ui/StyledPasswordInput';

function EditUserPasswordForm({ onCloseModal }) {
  const { mutate: changePassword, isEditing } = usePostChangePassword();

  const { control, getValues, handleSubmit, reset, formState } = useForm();
  const { errors } = formState;

  function onSubmit(receivedData) {
    const data = {
      current_password: receivedData.current_password,
      new_password: receivedData.new_password,
      new_password_confirmation: receivedData.new_password_confirmation,
    };

    changePassword(
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
      <FormRow>
        <FormField label="Trenutna lozinka" error={errors?.current_password?.message} required>
          <Controller
            name="current_password"
            control={control}
            rules={{
              required: 'Molimo unesite trenutnu lozinku!',
            }}
            render={({ field }) => (
              <StyledPasswordInput
                {...field}
                autoComplete="current-password"
                prefix={<LockOutlined />}
                placeholder="Trenutna lozinka"
                size="large"
                status={errors.current_password ? 'error' : ''}
              />
            )}
          />
        </FormField>
      </FormRow>
      <FormRow>
        <FormField label="Nova lozinka" error={errors?.new_password?.message} required>
          <Controller
            name="new_password"
            control={control}
            rules={{
              required: 'Molimo unesite novu lozinku!',
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
                autoComplete="new-password"
                prefix={<LockOutlined />}
                placeholder="Nova lozinka"
                size="large"
                status={errors.password ? 'error' : ''}
              />
            )}
          />
        </FormField>
      </FormRow>

      <FormRow>
        <FormField
          label="Ponovite novu lozinku"
          error={errors?.new_password_confirmation?.message}
          required
        >
          <Controller
            name="new_password_confirmation"
            control={control}
            rules={{
              required: 'Molimo ponovite lozinku!',
              validate: (value) =>
                value === getValues('new_password') || 'Lozinke se ne podudaraju!',
            }}
            render={({ field }) => (
              <StyledPasswordInput
                {...field}
                prefix={<LockOutlined />}
                placeholder="Ponovite lozinku"
                size="large"
                status={errors.new_password_confirmation ? 'error' : ''}
                onPaste={(e) => e.preventDefault()}
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
        <Button title="Promijeni lozinku" size="small" variation="primary" disabled={isEditing}>
          Promijeni lozinku
        </Button>
      </FormRow>
    </Form>
  );
}

export default EditUserPasswordForm;
