import { useForm, Controller } from 'react-hook-form';

import Form from '../../ui/Form';
import Button from '../../ui/Button';
import FormRow from '../../ui/FormRow';
import FormField from '../../ui/FormField';
import { useUpdateMe } from './useUpdateMe';
import { LockOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Input } from 'antd';
import { useUserPermissions } from '../authentication/useUserPermissions';
import Spinner from '../../ui/Spinner';

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

function EditUserPasswordForm({ onCloseModal }) {
  const { isEditing, updateMe } = useUpdateMe();
  const { isLoading, user } = useUserPermissions();

  const { control, getValues, handleSubmit, reset, formState } = useForm();
  const { errors } = formState;

  function onSubmit(receivedData) {
    const data = {
      password: receivedData.password,
      password2: receivedData.password2,
      first_name: user?.first_name,
      last_name: user?.last_name,
      email: user?.email,
    };

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

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)} type={onCloseModal ? 'modal' : 'regular'}>
      <FormRow>
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
                autoComplete="new-password"
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
        <Button title="Uredi korisnika" size="small" variation="primary" disabled={isEditing}>
          Uredi korisnika
        </Button>
      </FormRow>
    </Form>
  );
}

export default EditUserPasswordForm;
