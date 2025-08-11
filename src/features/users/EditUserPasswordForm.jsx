import { Controller, useForm } from 'react-hook-form';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import FormRow from '../../ui/FormRow';
import FormField from '../../ui/FormField';
import { Input } from 'antd';
import { useUpdateUser } from './useUpdateUser';
import { LockOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useGetUser } from './useUser';

const StyledPasswordInput = styled(Input.Password)`
  &.ant-input-affix-wrapper {
    border: 1px solid var(--color-grey-300);
    background-color: var(--color-grey-0);
    border-radius: var(--border-radius-sm);
    padding: 0.8rem 1.2rem;
    box-shadow: none;
    transition: all 0.3s;
    height: auto;

    &:hover {
      border-color: var(--color-brand-500);
    }

    &:focus,
    &.ant-input-affix-wrapper-focused {
      border-color: var(--color-brand-500);
      box-shadow: none;
    }

    .ant-input {
      background: transparent;
      border: none;
      padding: 0;
      height: auto;

      &:focus {
        box-shadow: none;
      }
    }

    .ant-input-prefix {
      margin-right: 8px;
    }
  }
`;

function EditUserPasswordForm({ userToEdit = {}, onCloseModal }) {
  const { isEditing, updateUser } = useUpdateUser();
  const { idguid: editId, ...editValues } = userToEdit;

  const { user } = useGetUser(editId);

  const { handleSubmit, reset, control, formState, getValues } = useForm({
    defaultValues: editValues,
  });

  const { errors } = formState;

  function onSubmit(formData) {
    const formattedData = {
      email: userToEdit.email,
      first_name: userToEdit.first_name,
      last_name: userToEdit.last_name,
      password: formData.password,
      password2: formData.password2,
      institucija_idguid: userToEdit.institucija,
      role_idguid: user.data.roles[0].idguid,
    };
    updateUser(
      { formattedData, editId },
      {
        onSuccess: () => {
          reset();
          onCloseModal?.();
        },
      }
    );
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} type={onCloseModal ? 'modal' : 'regular'}>
      <FormRow columns="1fr">
        <FormField label="Lozinka" error={errors?.password?.message} required>
          <Controller
            name="password"
            control={control}
            rules={{
              required: 'Molimo unesite lozinku!',
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
                // autoComplete="new-password"
                prefix={<LockOutlined />}
                placeholder="Lozinka"
                size="large"
                status={errors.password ? 'error' : ''}
              />
            )}
          />
        </FormField>
      </FormRow>
      <FormRow>
        <FormField label="Ponovite lozinku" error={errors?.password2?.message} required>
          <Controller
            name="password2"
            control={control}
            rules={{
              required: 'Molimo ponovite lozinku!',
              validate: (value) => value === getValues('password') || 'Lozinke se ne podudaraju!',
            }}
            render={({ field }) => (
              <StyledPasswordInput
                {...field}
                prefix={<LockOutlined />}
                placeholder="Ponovite lozinku"
                size="large"
                status={errors.password2 ? 'error' : ''}
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
        <Button
          title={isEditing ? 'Uređujem korisnika...' : 'Uredi korisnika'}
          size="small"
          variation="primary"
          disabled={isEditing}
        >
          {isEditing ? 'Uređujem korisnika...' : 'Uredi korisnika'}
        </Button>
      </FormRow>
    </Form>
  );
}

export default EditUserPasswordForm;
