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
// import ExistingImagePreview from '../../ui/ExistingImagePreview';
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
    }
  }, [settings, reset]);

  function onSubmit(data) {
    const payload = {
      ...data,
      site_logo: data.site_logo?.length ? data.site_logo : existingSlika,
      favicon16x16: data.favicon16x16?.length ? data.favicon16x16 : existingIcon,
    };

    updateSettings(
      { data: payload },
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
        <FormField label="Logotip" error={errors?.site_logo?.message}>
          {existingSlika ? (
            <div
              style={{
                position: 'relative',
                display: 'inline-block',
                width: 'fit-content',
                // height: 'fit-content',
              }}
            >
              <img
                src={
                  /^data:image\/[a-z]+;base64,/.test(existingSlika)
                    ? existingSlika
                    : `${FILE_URL}${existingSlika}`
                }
                alt="Logotip"
                style={{
                  display: 'block',
                  maxWidth: '200px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setExistingSlika(null);
                  setValue('site_logo', null);
                }}
                style={{
                  position: 'absolute',
                  top: '-1rem',
                  right: '-1rem',
                  backgroundColor: 'var(--color-red-500)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>
          ) : (
            <FileInput
              disabled={isEditing}
              id="site_logo"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onloadend = () => {
                  setExistingSlika(reader.result); // base64 prikaz
                  setValue('site_logo', e.target.files); // proslijedi RHF-u
                };
                reader.readAsDataURL(file);
              }}
            />
          )}
        </FormField>

        <FormField label="Ikonica" error={errors?.favicon16x16?.message}>
          {existingIcon ? (
            <div
              style={{
                position: 'relative',
                display: 'inline-block',
                width: 'fit-content',
                height: 'fit-content',
              }}
            >
              <img
                src={
                  /^data:image\/[a-z]+;base64,/.test(existingIcon)
                    ? existingIcon
                    : `${FILE_URL}${existingIcon}`
                }
                alt="Favicon"
                style={{
                  display: 'block',
                  width: '64px',
                  height: '64px',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setExistingIcon(null);
                  setValue('favicon16x16', null);
                }}
                style={{
                  position: 'absolute',
                  top: '-1rem',
                  right: '-1rem',
                  backgroundColor: 'var(--color-red-500)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>
          ) : (
            <FileInput
              disabled={isEditing}
              id="favicon16x16"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onloadend = () => {
                  setExistingIcon(reader.result); // base64 preview
                  setValue('favicon16x16', e.target.files); // RHF
                };
                reader.readAsDataURL(file);
              }}
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
      <FormRow buttons="has">
        <Button title="Spremi izmjene" size="medium" variation="primary">
          Spremi izmjene
        </Button>
      </FormRow>
    </Form>
  );
}
