import { useForm, Controller } from 'react-hook-form';
import Form from '../../ui/Form';
import FormField from '../../ui/FormField';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import { StyledInput } from '../../ui/StyledInput';
import { MailOutlined } from '@ant-design/icons';
import Checkbox from '../../ui/Checkbox';

import { FILE_URL } from '../../utils/constants';
import { useEffect, useState } from 'react';
import FileInput from '../../ui/FileInput';
import ExistingImagePreview from '../../ui/ExistingImagePreview';
import Button from '../../ui/Button';
import { useGetSettings } from './useSettings';
import CalendarSpinner from '../../ui/CalendarSpinner';
import { useUpdateSettings } from './useUpdateSettings';

export default function SettingsPage() {
  const { isLoading, settings } = useGetSettings();

  const { isEditing, updateSettings } = useUpdateSettings();

  const [existingSlika, setExistingSlika] = useState(null);
  const [existingIcon, setExistingIcon] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: settings,
  });

  useEffect(() => {
    if (settings) {
      reset(settings);
      setExistingSlika(settings?.site_logo); // ⬅️ ako imaš slike inicijalno
      setExistingIcon(settings?.favicon16x16);
    }
  }, [settings, reset]);

  function onSubmit(data) {
    console.log(data);
    updateSettings(
      { data },
      {
        onSuccess: () => {
          reset();
        },
      }
    );
  }

  function onError() {
    // console.log(errors);
  }

  if (isLoading || !settings) return <CalendarSpinner />;

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)} type={'regular'}>
      <FormRow columns="1fr 1fr">
        <FormField label="Naziv stranice" error={errors?.site_name?.message} required>
          <Input
            autoFocus
            type="text"
            disabled={isEditing}
            id="site_name"
            {...register('site_name', {
              required: 'Ovo polje je obavezno',
            })}
          />
        </FormField>
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
      </FormRow>
      <FormRow>
        <FormField label="Site Copyright" error={errors?.site_copyright?.message} required>
          <Input
            disabled={isEditing}
            type="text"
            id="site_copyright"
            {...register('site_copyright', {
              required: 'Ovo polje je obavezno',
            })}
          />
        </FormField>
      </FormRow>
      <FormRow columns="1fr 1fr">
        <FormField label="Logotip" error={errors?.site_logo?.message} required>
          {existingSlika ? (
            <ExistingImagePreview
              slikaUrl={`${FILE_URL}${existingSlika}`}
              onRemove={() => {
                setExistingSlika(null);
                setValue('site_logo', null);
              }}
            />
          ) : (
            <FileInput
              disabled={isEditing}
              id="site_logo"
              accept="image/*"
              {...register('site_logo')}
            />
          )}
        </FormField>
        <FormField label="Ikonica" error={errors?.favicon16x16?.message} required>
          {existingSlika ? (
            <ExistingImagePreview
              slikaUrl={`${FILE_URL}${existingIcon}`}
              onRemove={() => {
                setExistingIcon(null);
                setValue('favicon16x16', null);
              }}
            />
          ) : (
            <FileInput
              disabled={isEditing}
              id="favicon16x16"
              accept="image/*"
              {...register('favicon16x16')}
            />
          )}
        </FormField>
      </FormRow>
      <FormRow columns="1fr 1fr">
        <FormField label="Adresa" error={errors?.address?.message}>
          <Input type="text" disabled={isEditing} id="address" {...register('address')} />
        </FormField>{' '}
        <FormField label="Telefon" error={errors?.phone_number?.message}>
          <Input type="text" disabled={isEditing} id="phone_number" {...register('phone_number')} />
        </FormField>
      </FormRow>
      <FormRow columns="1fr 1fr">
        <FormField label="Web stranica" error={errors?.site_link?.message}>
          <Input
            type="text"
            disabled={isEditing}
            id="site_link"
            {...register('site_link', {
              pattern: {
                value: /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/\S*)?$/,
                message: 'Unesite ispravan link web stranice',
              },
            })}
          />
        </FormField>
        <FormField label="Facebook" error={errors?.facebook_link?.message}>
          <Input
            type="text"
            disabled={isEditing}
            id="facebook_link"
            {...register('facebook_link', {
              pattern: {
                value: /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/\S*)?$/,
                message: 'Unesite ispravan facebook link',
              },
            })}
          />
        </FormField>
      </FormRow>

      <FormRow columns="1fr 1fr 1fr">
        <FormField error={errors?.site_active?.message}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label
              htmlFor="site_active"
              style={{
                fontWeight: 'bold',
                userSelect: 'none',
              }}
            >
              Stranica aktivna
            </label>
            <Checkbox disabled={isEditing} id="site_active" {...register('site_active')} />
          </div>
        </FormField>
        <FormField error={errors?.registracija?.message}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label
              htmlFor="registracija"
              style={{
                fontWeight: 'bold',
                userSelect: 'none',
              }}
            >
              Registracija
            </label>
            <Checkbox disabled={isEditing} id="registracija" {...register('registracija')} />
          </div>
        </FormField>
        <FormField error={errors?.google_login?.message}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label
              htmlFor="google_login"
              style={{
                fontWeight: 'bold',
                userSelect: 'none',
              }}
            >
              Google login
            </label>
            <Checkbox disabled={isEditing} id="google_login" {...register('google_login')} />
          </div>
        </FormField>
      </FormRow>
      <FormRow>
        <Button title="Spremi izmjene" size="medium" variation="primary">
          Spremi izmjene
        </Button>
      </FormRow>
    </Form>
  );
}
