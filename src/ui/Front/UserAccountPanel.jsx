import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { HiEye, HiEyeSlash } from 'react-icons/hi2';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import FormField from '../../ui/FormField';
import Input from '../../ui/Input';
import Heading from '../Heading';
import DeactivateUserForm from '../../features/user/DeactivateUserForm';

// —— Layout —— //
const Panel = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  padding: 20px;
  width: 90%;
  justify-self: center;
  margin-bottom: 24px;

  @media (max-width: 400px) {
    width: 100%;
  }
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: start;
  gap: 16px;

  @media (max-width: 400px) {
    grid-template-columns: 1fr;
  }
`;

const Title = styled.h3`
  margin-bottom: 2rem;
  font-size: 20px;
  font-weight: 800;
`;

const Meta = styled.div`
  display: grid;
  gap: 6px;
  padding: 3rem 0;
  color: #475569;
  font-size: 1.4rem;

  span b {
    color: #0f172a;
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  justify-content: flex-end;
`;

const Brand = '#f97316';

// —— Forms in modals —— //
function EditProfileForm({ user, onSubmit, isWorking, onCloseModal }) {
  const { register, handleSubmit, formState, reset } = useForm({
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
    },
  });

  const { errors } = formState;

  function submit(values) {
    const data = values;
    onSubmit?.(
      { data },
      {
        onSuccess: () => {
          reset();
          onCloseModal?.();
        },
      }
    );
  }

  return (
    <Form onSubmit={handleSubmit(submit)} type="modal">
      <FormRow columns="1fr 1fr">
        <FormField label="Ime" required error={errors?.first_name?.message}>
          <Input
            id="first_name"
            disabled={isWorking}
            {...register('first_name', {
              required: 'Unesite ime',
              maxLength: { value: 50, message: 'Maksimalno 50 znakova' },
            })}
          />
        </FormField>
        <FormField label="Prezime" required error={errors?.last_name?.message}>
          <Input
            id="last_name"
            disabled={isWorking}
            {...register('last_name', {
              required: 'Unesite prezime',
              maxLength: { value: 50, message: 'Maksimalno 50 znakova' },
            })}
          />
        </FormField>
      </FormRow>

      <FormRow buttons="has">
        <Button
          variation="secondary"
          type="button"
          size="small"
          onClick={() => onCloseModal?.()}
          disabled={isWorking}
        >
          Odustani
        </Button>
        <Button
          variation="primary"
          size="small"
          type="submit"
          disabled={isWorking}
          style={{ background: Brand }}
        >
          Sačuvaj promjene
        </Button>
      </FormRow>
    </Form>
  );
}

const FieldWrap = styled.div`
  position: relative;
`;

const EyeBtn = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  border: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  opacity: 0.8;
  /* padding: 4px; */
  line-height: 0;

  &:hover {
    opacity: 1;
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

function ChangePasswordForm({ onSubmit, onCloseModal, isWorking, isEditing }) {
  const { register, handleSubmit, watch, formState, reset } = useForm({
    defaultValues: {
      current_password: '',
      new_password: '',
      new_password_confirmation: '',
    },
  });
  const { errors } = formState;
  const newPass = watch('new_password');

  // lokalni toggle-i za prikaz lozinki
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  function submit(values) {
    const data = values;
    onSubmit?.(
      { data },
      {
        onSuccess: () => {
          reset();
          onCloseModal?.();
        },
      }
    );
  }

  return (
    <Form onSubmit={handleSubmit(submit)} type="modal">
      <FormRow>
        <FieldWrap>
          <FormField label="Trenutna šifra" required error={errors?.current_password?.message}>
            <Input
              id="current_password"
              type={showCurrent ? 'text' : 'password'}
              disabled={isWorking}
              style={{ paddingRight: '2.5rem' }}
              {...register('current_password', { required: 'Unesite trenutnu šifru' })}
            />
            <EyeBtn
              type="button"
              onClick={() => setShowCurrent((s) => !s)}
              aria-label={showCurrent ? 'Sakrij šifru' : 'Prikaži šifru'}
              disabled={isWorking}
              tabIndex={0}
            >
              {showCurrent ? <HiEyeSlash size={18} /> : <HiEye size={18} />}
            </EyeBtn>
          </FormField>
        </FieldWrap>
      </FormRow>

      <FormRow columns="1fr 1fr">
        <FieldWrap>
          <FormField label="Nova šifra" required error={errors?.new_password?.message}>
            <Input
              id="new_password"
              type={showNew ? 'text' : 'password'}
              disabled={isWorking}
              placeholder="Najmanje 8 znakova"
              style={{ paddingRight: '2.5rem' }}
              {...register('new_password', {
                required: 'Unesite novu šifru',
                minLength: { value: 8, message: 'Najmanje 8 znakova' },
              })}
            />
            <EyeBtn
              type="button"
              onClick={() => setShowNew((s) => !s)}
              aria-label={showNew ? 'Sakrij šifru' : 'Prikaži šifru'}
              disabled={isWorking}
              tabIndex={0}
            >
              {showNew ? <HiEyeSlash size={18} /> : <HiEye size={18} />}
            </EyeBtn>
          </FormField>
        </FieldWrap>

        <FieldWrap>
          <FormField
            label="Ponovite novu šifru"
            required
            error={errors?.new_password_confirmation?.message}
          >
            <Input
              id="new_password_confirmation"
              type={showConfirm ? 'text' : 'password'}
              disabled={isWorking}
              style={{ paddingRight: '2.5rem' }}
              {...register('new_password_confirmation', {
                required: 'Potvrdite novu šifru',
                validate: (v) => v === newPass || 'Potvrda ne odgovara novoj šifri',
              })}
            />
            <EyeBtn
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              aria-label={showConfirm ? 'Sakrij šifru' : 'Prikaži šifru'}
              disabled={isWorking}
              tabIndex={0}
            >
              {showConfirm ? <HiEyeSlash size={18} /> : <HiEye size={18} />}
            </EyeBtn>
          </FormField>
        </FieldWrap>
      </FormRow>

      <FormRow buttons="has">
        <Button
          variation="secondary"
          type="button"
          size="small"
          onClick={() => onCloseModal?.()}
          disabled={isWorking}
        >
          Odustani
        </Button>
        <Button
          size="small"
          variation="primary"
          type="submit"
          disabled={isWorking}
          style={{ background: Brand }}
        >
          {isEditing ? 'Mijenjam šifru...' : 'Promijeni šifru'}
        </Button>
      </FormRow>
    </Form>
  );
}

// —— Main Component —— //
export default function UserAccountPanel({
  user,
  onUpdateProfile,
  onChangePassword,
  onDeactivate,
  isSavingProfile = false,
  isChangingPassword = false,
  isDeactivating = false,
  isEditing,
}) {
  const initial = useMemo(
    () => ({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      active: Boolean(user?.active),
      verified: Boolean(user?.email_verified_at),
    }),
    [user]
  );

  return (
    <Panel>
      <Header>
        <div>
          <Heading as="h2">Moj profil</Heading>
          <Meta>
            <span>
              Ime i prezime:{' '}
              <b>
                {user?.first_name} {user?.last_name}
              </b>
            </span>
            <span>
              Email: <b>{user?.email}</b>{' '}
              {initial.verified ? ' - verifikovan ✅' : ' - nije verifikovan ⛔️'}
            </span>

            <span>
              Status: <b>{initial.active ? 'Aktivan' : 'Neaktivan'}</b>
            </span>
          </Meta>
        </div>

        {/* Actions + Modals */}
        <Modal>
          <Actions>
            <Modal.Open opens="Uredi profil">
              <Button size="small" variation="primary" style={{ background: Brand }}>
                Uredi profil
              </Button>
            </Modal.Open>

            <Modal.Open opens="Promjena šifre">
              <Button size="small" variation="primary" style={{ background: Brand }}>
                Promjena šifre
              </Button>
            </Modal.Open>

            <Modal.Open opens="Deaktivacija računa">
              <Button size="small" variation="danger">
                Deaktiviraj račun
              </Button>
            </Modal.Open>
          </Actions>

          {/* — Uredi profil — */}
          <Modal.Window name="Uredi profil" size="medium">
            <EditProfileForm
              user={user}
              isWorking={isSavingProfile}
              onSubmit={onUpdateProfile}
              // onCancel={() => window?.dispatchEvent(new CustomEvent('modal:close'))}
            />
          </Modal.Window>

          {/* — Promjena šifre — */}
          <Modal.Window name="Promjena šifre" size="medium">
            <ChangePasswordForm
              isEditing={isEditing}
              isWorking={isChangingPassword}
              onSubmit={onChangePassword}
              // onCancel={() => window?.dispatchEvent(new CustomEvent('modal:close'))}
            />
          </Modal.Window>

          {/* — Deaktivacija računa — */}
          <Modal.Window name="Deaktivacija računa" size="medium">
            <DeactivateUserForm
              resourceName="korisnički račun"
              disabled={isDeactivating}
              onConfirm={onDeactivate}
            >
              Da li ste sigurni da želite deaktivirati nalog?
            </DeactivateUserForm>
          </Modal.Window>
        </Modal>
      </Header>
    </Panel>
  );
}
