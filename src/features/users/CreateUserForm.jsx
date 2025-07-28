import { Controller, useForm } from 'react-hook-form';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import FormRow from '../../ui/FormRow';
import FormField from '../../ui/FormField';
// import Input from '../../ui/Input'; POPRAVITI
import { Input } from 'antd';
import { usePostUser } from './usePostUser';
import { useUpdateUser } from './useUpdateUser';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useGetInstitutions } from '../institutions/useInstitutions';
import Spinner from '../../ui/Spinner';
import Select from '../../ui/Select';
import Heading from '../../ui/Heading';

// Unified styled component for all input types
const StyledInput = styled(Input)`
  &.ant-input,
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
    &.ant-input-focused,
    &.ant-input-affix-wrapper-focused {
      border-color: var(--color-brand-500);
      box-shadow: none;
    }

    .ant-input-prefix {
      margin-right: 8px;
    }
  }

  /* Specific styles for password input */
  &.ant-input-password {
    .ant-input {
      height: auto;
      padding: 0;
    }
  }
`;

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

function CreateUserForm({ userToEdit = {}, onCloseModal }) {
  const { isCreating, postUser } = usePostUser();
  const { isEditing, updateUser } = useUpdateUser();
  const { isLoading, institutions } = useGetInstitutions();
  const isWorking = isCreating || isEditing;
  const { idguid: editId, ...editValues } = userToEdit;
  const isEditSession = Boolean(editId);

  const { handleSubmit, reset, control, formState, getValues, watch, setValue, register } = useForm(
    {
      defaultValues: isEditSession ? editValues : {},
    }
  );
  const { errors } = formState;

  function onSubmit(data) {
    if (isEditSession)
      updateUser(
        { data, editId },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    else
      postUser(
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
      <FormRow columns="1fr">
        <FormField label="Email" error={errors?.email?.message} required>
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
                // autoFocus
                {...field}
                prefix={<MailOutlined />}
                placeholder="Email adresa"
                size="large"
                status={errors.email ? 'error' : ''}
              />
            )}
          />
        </FormField>
      </FormRow>
      <FormRow columns="1fr 1fr">
        <FormField label="Institucija" required error={errors?.institution_idguid?.message}>
          {isLoading ? (
            <Spinner />
          ) : (
            <Select
              id="institution_idguid"
              name="institution_idguid"
              options={institutions.data.map((c) => ({
                value: c.idguid,
                label: c.naziv,
              }))}
              disabled={isWorking}
              register={register}
              setValue={setValue}
              watch={watch}
              validation={{
                required: 'Molimo odaberite odgovarajuću kategoriju',
              }}
            />
          )}
        </FormField>

        <FormField label="Rola" required error={errors?.first_name?.message}>
          <Controller
            name="first_name"
            control={control}
            render={({ field }) => (
              <StyledInput
                // autoFocus
                {...field}
                placeholder="Rola"
                size="large"
                status={errors.email ? 'error' : ''}
              />
            )}
          />
        </FormField>
      </FormRow>
      <FormRow columns="1fr 1fr">
        <FormField label="Ime korisnika" error={errors?.first_name?.message}>
          <Controller
            name="first_name"
            control={control}
            render={({ field }) => (
              <StyledInput
                // autoFocus
                {...field}
                placeholder="Ime korisnika"
                size="large"
                status={errors.email ? 'error' : ''}
              />
            )}
          />
        </FormField>
        <FormField label="Prezime korisnika" error={errors?.last_name?.message}>
          <Controller
            name="last_name"
            control={control}
            render={({ field }) => (
              <StyledInput
                // autoFocus
                {...field}
                placeholder="Prezime korisnika"
                size="large"
                status={errors.email ? 'error' : ''}
              />
            )}
          />
        </FormField>
      </FormRow>
      <hr />

      <Heading as="h3">Sigurnosne postavke</Heading>

      <FormRow columns="1fr 1fr">
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
        <Button
          title={isEditSession ? 'Uredi korisnika' : 'Dodaj novog korisnika'}
          size="small"
          variation="primary"
          disabled={isWorking}
        >
          {isEditSession ? 'Uredi korisnika' : 'Dodaj novog korisnika'}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateUserForm;
