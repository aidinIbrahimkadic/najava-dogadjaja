import { useForm } from 'react-hook-form';

import Input from '../../ui/Input';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
// import FileInput from '../../ui/FileInput';
import TextArea from '../../ui/TextArea';
import FormRow from '../../ui/FormRow';

import { usePostCategory } from './usePostCategory';
import { useUpdateCategory } from './useUpdateCategory';
import styled from 'styled-components';

const ButtonsRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 2rem;
  margin-top: 1rem;
`;

function CreateCategoryForm({ categoryToEdit = {}, onCloseModal }) {
  const { isCreating, postCategory } = usePostCategory();
  const { isEditing, updateCategory } = useUpdateCategory();
  const isWorking = isCreating || isEditing;

  const { idguid: editId, ...editValues } = categoryToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });
  const { errors } = formState;

  function onSubmit(data) {
    if (isEditSession)
      updateCategory(
        { data, editId },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    else
      postCategory(
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
      <FormRow label="Category name" error={errors?.naziv?.message}>
        <Input
          type="text"
          id="naziv"
          disabled={isWorking}
          {...register('naziv', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow label="Category Description" error={errors?.opis?.message}>
        <TextArea
          type="text"
          id="opis"
          defaultValue=""
          disabled={isWorking}
          {...register('opis')}
        />
      </FormRow>

      {/* type is an HTML attribute! */}
      <ButtonsRow>
        <Button variation="secondary" type="reset" size="small" onClick={() => onCloseModal?.()}>
          Cancel
        </Button>
        <Button size="small" variation="primary" disabled={isWorking}>
          {isEditSession ? 'Edit category' : 'Create new category'}
        </Button>
      </ButtonsRow>
    </Form>
  );
}

export default CreateCategoryForm;
