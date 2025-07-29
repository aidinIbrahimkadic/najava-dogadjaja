import { useForm } from 'react-hook-form';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import FormRow from '../../ui/FormRow';
import FormField from '../../ui/FormField';
import Input from '../../ui/Input';
import { usePostRole } from './usePostRole';
import { useUpdateRole } from './useUpdateRole';
import { useGetPermissions } from '../permissions/usePermissions';
import PermissionItem from '../permissions/PermissionItem';
import { useEffect, useState } from 'react';
import Heading from '../../ui/Heading';
import Checkbox from '../../ui/Checkbox';

// Unified styled component for all input types

function CreateRoleForm({ roleToEdit = {}, onCloseModal }) {
  const { isCreating, postRole } = usePostRole();
  const { isEditing, updateRole } = useUpdateRole();
  const { permissions, isLoading: isLoadingPermissions } = useGetPermissions();
  const isWorking = isCreating || isEditing;
  const { idguid: editId, permissions: rolePermissions = [], ...editValues } = roleToEdit;
  const isEditSession = Boolean(editId);

  const allPermissions = permissions?.data?.permissions || [];

  const { handleSubmit, reset, formState, register } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });
  const { errors } = formState;

  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    if (isEditSession && rolePermissions.length > 0) {
      setSelectedPermissions(rolePermissions.map((p) => p.idguid));
    }
  }, [isEditSession, rolePermissions]);

  const handlePermissionToggle = (idguid) => {
    setSelectedPermissions((prev) =>
      prev.includes(idguid) ? prev.filter((id) => id !== idguid) : [...prev, idguid]
    );
  };

  function handleSelectAllToggle() {
    // if (!permissions || permissions.length === 0) return;

    const allIds = allPermissions.map((p) => p.idguid);

    const isAllSelected = allIds.every((id) => selectedPermissions.includes(id));

    if (isAllSelected) {
      // Deselect all
      setSelectedPermissions([]);
    } else {
      // Select all
      setSelectedPermissions(allIds);
    }
  }

  console.log('isLoadingPermissions', isLoadingPermissions);
  console.log('permisije', permissions);

  function onSubmit(data) {
    if (isEditSession)
      updateRole(
        { data, editId },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    else
      postRole(
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
      <FormRow columns="1fr 1fr">
        <FormField label="Naziv role" error={errors?.name?.message} required>
          <Input
            autoFocus
            type="text"
            id="name"
            disabled={isWorking}
            {...register('name', {
              required: 'Ovo polje je obavezno',
            })}
          />
        </FormField>

        <FormField label="Opis role" error={errors?.description?.message} required>
          <Input type="text" id="description" disabled={isWorking} {...register('description')} />
        </FormField>
      </FormRow>
      <br />
      <hr />
      <br />
      <Heading as="h5">Odaberite dozvole za rolu:</Heading>

      {!isLoadingPermissions && allPermissions.length > 0 && (
        <>
          <div style={{ margin: '1rem 0' }}>
            <label
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
            >
              <Checkbox
                checked={
                  allPermissions.length > 0 &&
                  allPermissions.every((p) => selectedPermissions.includes(p.idguid))
                }
                onChange={handleSelectAllToggle}
              />
              Označi/odznači sve
            </label>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '1rem',
            }}
          >
            {allPermissions.map((permission) => (
              <PermissionItem
                key={permission.idguid}
                permission={permission}
                checked={selectedPermissions.includes(permission.idguid)}
                onChange={handlePermissionToggle}
              />
            ))}
          </div>
        </>
      )}
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
          title={isEditSession ? 'Uredi rolu' : 'Dodaj novog rolu'}
          size="small"
          variation="primary"
          disabled={isWorking}
        >
          {isEditSession ? 'Uredi rolu' : 'Dodaj novog rolu'}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateRoleForm;
