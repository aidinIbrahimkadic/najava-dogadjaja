// import { Controller, useForm } from 'react-hook-form';
// import Form from '../../ui/Form';
// import Button from '../../ui/Button';
// import FormRow from '../../ui/FormRow';
// import FormField from '../../ui/FormField';
// import { Input } from 'antd';
// import { usePostUser } from './usePostUser';
// import { useUpdateUser } from './useUpdateUser';
// import { MailOutlined, LockOutlined } from '@ant-design/icons';
// import styled from 'styled-components';
// import { useGetInstitutions } from '../institutions/useInstitutions';
// import Spinner from '../../ui/Spinner';
// import Select from '../../ui/Select';
// import Heading from '../../ui/Heading';
// import { useGetRoles } from '../roles/useRoles';
// import { useGetUser } from './useUser';
// import { useUpdateUserRoles } from '../user-roles/useUpdateUserRoles';
// import { useEffect, useState } from 'react';

// // Styled components
// const StyledInput = styled(Input)`
//   &.ant-input,
//   &.ant-input-affix-wrapper {
//     border: 1px solid var(--color-grey-300);
//     background-color: var(--color-grey-0);
//     border-radius: var(--border-radius-sm);
//     padding: 0.8rem 1.2rem;
//     box-shadow: none;
//     transition: all 0.3s;
//     height: auto;

//     &:hover {
//       border-color: var(--color-brand-500);
//     }

//     &:focus,
//     &.ant-input-focused,
//     &.ant-input-affix-wrapper-focused {
//       border-color: var(--color-brand-500);
//       box-shadow: none;
//     }

//     .ant-input-prefix {
//       margin-right: 8px;
//     }
//   }

//   &.ant-input-password {
//     .ant-input {
//       height: auto;
//       padding: 0;
//     }
//   }
// `;

// const StyledPasswordInput = styled(Input.Password)`
//   &.ant-input-affix-wrapper {
//     border: 1px solid var(--color-grey-300);
//     background-color: var(--color-grey-0);
//     border-radius: var(--border-radius-sm);
//     padding: 0.8rem 1.2rem;
//     box-shadow: none;
//     transition: all 0.3s;
//     height: auto;

//     &:hover {
//       border-color: var(--color-brand-500);
//     }

//     &:focus,
//     &.ant-input-affix-wrapper-focused {
//       border-color: var(--color-brand-500);
//       box-shadow: none;
//     }

//     .ant-input {
//       background: transparent;
//       border: none;
//       padding: 0;
//       height: auto;

//       &:focus {
//         box-shadow: none;
//       }
//     }

//     .ant-input-prefix {
//       margin-right: 8px;
//     }
//   }
// `;

// function CreateUserForm({ userToEdit = {}, onCloseModal }) {
//   const { isCreating, postUser } = usePostUser();
//   const { isEditing, updateUser } = useUpdateUser();
//   const { isLoadingInstitutions, institutions } = useGetInstitutions();
//   const { isLoading: isLoadingRoles, roles } = useGetRoles();
//   const { updateUserRoles } = useUpdateUserRoles();

//   const { idguid: editId, ...editValuesRaw } = userToEdit;
//   const isEditSession = Boolean(editId);

//   const { isLoading: isLoadingUser, user } = useGetUser(editId);
//   const [selectedRoleIdguid, setSelectedRoleIdguid] = useState('');

//   const editValues = {
//     ...editValuesRaw,
//     institucija: userToEdit?.institucija?.idguid || '',
//   };

//   const { handleSubmit, reset, control, formState, getValues, watch, setValue, register } = useForm(
//     {
//       defaultValues: isEditSession ? editValues : {},
//     }
//   );

//   const { errors } = formState;
//   const isWorking = isCreating || isEditing || isLoadingUser;

//   // Set initial role after user is fetched
//   useEffect(() => {
//     if (isEditSession && user?.data?.roles?.length > 0) {
//       const currentRole = user?.data?.roles[0];
//       if (currentRole) {
//         setValue('role_idguid', currentRole.idguid);
//         setSelectedRoleIdguid(currentRole.idguid);
//       }
//     }
//   }, [user, isEditSession, setValue]);

//   function onSubmit(data) {
//     const newRoleId = getValues('role_idguid');

//     if (isEditSession) {
//       updateUser(
//         { data, editId },
//         {
//           onSuccess: () => {
//             if (newRoleId && newRoleId !== selectedRoleIdguid) {
//               updateUserRoles(
//                 { selectedRole: newRoleId, editId },
//                 {
//                   onSuccess: () => {
//                     reset();
//                     onCloseModal?.();
//                   },
//                 }
//               );
//             } else {
//               reset();
//               onCloseModal?.();
//             }
//           },
//         }
//       );
//     } else {
//       postUser(
//         { ...data },
//         {
//           onSuccess: () => {
//             reset();
//             onCloseModal?.();
//           },
//         }
//       );
//     }
//   }

//   return (
//     <Form onSubmit={handleSubmit(onSubmit)} type={onCloseModal ? 'modal' : 'regular'}>
//       <FormRow columns="1fr">
//         <FormField label="Email" error={errors?.email?.message} required>
//           <Controller
//             name="email"
//             control={control}
//             rules={{
//               required: 'Molimo unesite email adresu!',
//               pattern: {
//                 value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                 message: 'Molimo unesite validnu email adresu!',
//               },
//             }}
//             render={({ field }) => (
//               <StyledInput
//                 {...field}
//                 prefix={<MailOutlined />}
//                 placeholder="Email adresa"
//                 size="large"
//                 status={errors.email ? 'error' : ''}
//               />
//             )}
//           />
//         </FormField>
//       </FormRow>

//       <FormRow columns="1fr 1fr">
//         <FormField label="Institucija" error={errors?.institucija?.message}>
//           {isLoadingInstitutions ? (
//             <Spinner />
//           ) : (
//             <Select
//               id="institucija"
//               name="institucija"
//               options={institutions?.data?.map((inst) => ({
//                 value: inst.idguid,
//                 label: inst.naziv,
//               }))}
//               disabled={isWorking}
//               register={register}
//               setValue={setValue}
//               watch={watch}
//             />
//           )}
//         </FormField>

//         <FormField label="Uloga" required error={errors?.role_idguid?.message}>
//           {isLoadingRoles || isLoadingUser ? (
//             <Spinner />
//           ) : (
//             <Select
//               id="role_idguid"
//               name="role_idguid"
//               options={roles?.data?.roles.map((r) => ({
//                 value: r.idguid,
//                 label: r.name,
//               }))}
//               value={watch('role_idguid')}
//               disabled={isWorking}
//               register={register}
//               setValue={setValue}
//               watch={watch}
//               onChange={(e) => setValue('role_idguid', e.target.value)}
//               validation={{
//                 required: 'Molimo odaberite odgovarajuću rolu',
//               }}
//             />
//           )}
//         </FormField>
//       </FormRow>

//       <FormRow columns="1fr 1fr">
//         <FormField label="Ime korisnika" required error={errors?.first_name?.message}>
//           <Controller
//             name="first_name"
//             control={control}
//             render={({ field }) => (
//               <StyledInput
//                 {...field}
//                 placeholder="Ime korisnika"
//                 size="large"
//                 status={errors.first_name ? 'error' : ''}
//               />
//             )}
//           />
//         </FormField>
//         <FormField label="Prezime korisnika" required error={errors?.last_name?.message}>
//           <Controller
//             name="last_name"
//             control={control}
//             render={({ field }) => (
//               <StyledInput
//                 {...field}
//                 placeholder="Prezime korisnika"
//                 size="large"
//                 status={errors.last_name ? 'error' : ''}
//               />
//             )}
//           />
//         </FormField>
//       </FormRow>

//       <hr />
//       <Heading as="h3">Sigurnosne postavke</Heading>

//       <FormRow columns="1fr 1fr">
//         <FormField label="Lozinka" error={errors?.password?.message} required>
//           <Controller
//             name="password"
//             control={control}
//             rules={{
//               required: 'Molimo unesite lozinku!',
//               minLength: {
//                 value: 8,
//                 message: 'Lozinka mora imati najmanje 8 znakova!',
//               },
//               pattern: {
//                 value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
//                 message: 'Lozinka mora sadržavati velika slova, mala slova i brojeve!',
//               },
//             }}
//             render={({ field }) => (
//               <StyledPasswordInput
//                 {...field}
//                 autoComplete="new-password"
//                 prefix={<LockOutlined />}
//                 placeholder="Lozinka"
//                 size="large"
//                 status={errors.password ? 'error' : ''}
//               />
//             )}
//           />
//         </FormField>

//         <FormField label="Ponovite lozinku" error={errors?.password2?.message} required>
//           <Controller
//             name="password2"
//             control={control}
//             rules={{
//               required: 'Molimo ponovite lozinku!',
//               validate: (value) => value === getValues('password') || 'Lozinke se ne podudaraju!',
//             }}
//             render={({ field }) => (
//               <StyledPasswordInput
//                 {...field}
//                 prefix={<LockOutlined />}
//                 placeholder="Ponovite lozinku"
//                 size="large"
//                 status={errors.password2 ? 'error' : ''}
//                 onPaste={(e) => e.preventDefault()}
//               />
//             )}
//           />
//         </FormField>
//       </FormRow>

//       <FormRow>
//         <Button
//           title="Odustani"
//           variation="secondary"
//           type="reset"
//           size="small"
//           onClick={() => onCloseModal?.()}
//         >
//           Odustani
//         </Button>
//         <Button
//           title={isEditSession ? 'Uredi korisnika' : 'Dodaj novog korisnika'}
//           size="small"
//           variation="primary"
//           disabled={isWorking}
//         >
//           {isEditSession ? 'Uredi korisnika' : 'Dodaj novog korisnika'}
//         </Button>
//       </FormRow>
//     </Form>
//   );
// }

// export default CreateUserForm;

import { Controller, useForm } from 'react-hook-form';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import FormRow from '../../ui/FormRow';
import FormField from '../../ui/FormField';
import { Input } from 'antd';
import { usePostUser } from './usePostUser';
import { useUpdateUser } from './useUpdateUser';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useGetInstitutions } from '../institutions/useInstitutions';
import Spinner from '../../ui/Spinner';
import Select from '../../ui/Select';
import Heading from '../../ui/Heading';
import { useGetRoles } from '../roles/useRoles';
import { useGetUser } from './useUser';
import { useUpdateUserRoles } from '../user-roles/useUpdateUserRoles';
import { useEffect, useState } from 'react';

// Styled components
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
  const { isLoadingInstitutions, institutions } = useGetInstitutions();
  const { isLoading: isLoadingRoles, roles } = useGetRoles();
  const { updateUserRoles } = useUpdateUserRoles();

  const { idguid: editId, ...editValuesRaw } = userToEdit;
  const isEditSession = Boolean(editId);

  const { isLoading: isLoadingUser, user } = useGetUser(editId);
  const [selectedRoleIdguid, setSelectedRoleIdguid] = useState('');

  const editValues = {
    ...editValuesRaw,
    institucija: userToEdit?.institucija?.idguid || '',
  };

  const { handleSubmit, reset, control, formState, getValues, watch, setValue, register } = useForm(
    {
      defaultValues: isEditSession ? editValues : {},
    }
  );

  const { errors } = formState;
  const isWorking = isCreating || isEditing || isLoadingUser;

  // Set initial role after user is fetched
  useEffect(() => {
    if (isEditSession && user?.data?.roles?.length > 0) {
      const currentRole = user?.data?.roles[0];
      if (currentRole) {
        setValue('role_idguid', currentRole.idguid);
        setSelectedRoleIdguid(currentRole.idguid);
      }
    }
  }, [user, isEditSession, setValue]);

  function onSubmit(data) {
    const newRoleId = getValues('role_idguid');

    if (isEditSession) {
      updateUser(
        { data, editId },
        {
          onSuccess: () => {
            if (newRoleId && newRoleId !== selectedRoleIdguid) {
              updateUserRoles(
                { selectedRole: newRoleId, editId },
                {
                  onSuccess: () => {
                    reset();
                    onCloseModal?.();
                  },
                }
              );
            } else {
              reset();
              onCloseModal?.();
            }
          },
        }
      );
    } else {
      // Format data for new user creation
      const formattedData = {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        password: data.password,
        password2: data.password2,
        institucija_idguid: data.institucija, // Change from 'institucija' to 'institucija_idguid'
        roles: data.role_idguid ? [data.role_idguid] : [], // Convert role to array format
      };

      postUser(formattedData, {
        onSuccess: () => {
          reset();
          onCloseModal?.();
        },
      });
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} type={onCloseModal ? 'modal' : 'regular'}>
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
        <FormField label="Institucija" error={errors?.institucija?.message}>
          {isLoadingInstitutions ? (
            <Spinner />
          ) : (
            <Select
              id="institucija"
              name="institucija"
              options={institutions?.data?.map((inst) => ({
                value: inst.idguid,
                label: inst.naziv,
              }))}
              disabled={isWorking}
              register={register}
              setValue={setValue}
              watch={watch}
            />
          )}
        </FormField>

        <FormField label="Uloga" required error={errors?.role_idguid?.message}>
          {isLoadingRoles || isLoadingUser ? (
            <Spinner />
          ) : (
            <Select
              id="role_idguid"
              name="role_idguid"
              options={roles?.data?.roles.map((r) => ({
                value: r.idguid,
                label: r.name,
              }))}
              value={watch('role_idguid')}
              disabled={isWorking}
              register={register}
              setValue={setValue}
              watch={watch}
              onChange={(e) => setValue('role_idguid', e.target.value)}
              validation={{
                required: 'Molimo odaberite odgovarajuću rolu',
              }}
            />
          )}
        </FormField>
      </FormRow>

      <FormRow columns="1fr 1fr">
        <FormField label="Ime korisnika" required error={errors?.first_name?.message}>
          <Controller
            name="first_name"
            control={control}
            rules={{
              required: 'Molimo unesite ime korisnika!',
            }}
            render={({ field }) => (
              <StyledInput
                {...field}
                placeholder="Ime korisnika"
                size="large"
                status={errors.first_name ? 'error' : ''}
              />
            )}
          />
        </FormField>
        <FormField label="Prezime korisnika" required error={errors?.last_name?.message}>
          <Controller
            name="last_name"
            control={control}
            rules={{
              required: 'Molimo unesite prezime korisnika!',
            }}
            render={({ field }) => (
              <StyledInput
                {...field}
                placeholder="Prezime korisnika"
                size="large"
                status={errors.last_name ? 'error' : ''}
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
