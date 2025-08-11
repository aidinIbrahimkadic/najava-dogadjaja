import { useForm } from 'react-hook-form';

import Input from '../../ui/Input';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
// import FileInput from '../../ui/FileInput';
import TextArea from '../../ui/TextArea';
import FormRow from '../../ui/FormRow';
import FormField from '../../ui/FormField';

import { usePostCategory } from './usePostCategory';
import { useUpdateCategory } from './useUpdateCategory';
import InputColor from '../../ui/InputColor';
import { IconSelector } from './IconSelector';
import { useGetCategories } from './useCategories';
import Select from '../../ui/Select';
import Spinner from '../../ui/Spinner';

function CreateCategoryForm({ categoryToEdit = {}, onCloseModal }) {
  const { isCreating, postCategory } = usePostCategory();
  const { isEditing, updateCategory } = useUpdateCategory();

  const { isLoading: isLoadingCategories, categories: categoriesAPI } = useGetCategories();

  const categories = categoriesAPI?.filter((category) => {
    if (category.parent_idguid === '00000000-0000-0000-0000-000000000000') {
      return category;
    }
  });

  const isWorking = isCreating || isEditing;

  const { idguid: editId, ...editValues } = categoryToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, formState, setValue, watch } = useForm({
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
      <FormRow>
        <FormField label="Naziv kategorije" error={errors?.naziv?.message} required>
          <Input
            autoFocus
            type="text"
            id="naziv"
            disabled={isWorking}
            {...register('naziv', {
              required: 'Ovo polje je obavezno',
            })}
          />
        </FormField>
      </FormRow>

      <FormRow>
        <FormField label="Opis kategorije" error={errors?.opis?.message}>
          <TextArea
            type="text"
            id="opis"
            defaultValue=""
            disabled={isWorking}
            {...register('opis')}
          />
        </FormField>
      </FormRow>

      <FormRow columns="1fr 1fr">
        <FormField label="Kategorija događaja" error={errors?.parent_idguid?.message}>
          {isLoadingCategories ? (
            <Spinner />
          ) : (
            <Select
              id="parent_idguid"
              name="parent_idguid"
              options={categories.map((c) => ({
                value: c.idguid,
                label: c.naziv,
              }))}
              disabled={isWorking}
              register={register}
              setValue={setValue}
              watch={watch}
              // validation={{
              //   required: 'Molimo odaberite odgovarajuću kategoriju',
              // }}
            />
          )}
        </FormField>
        <FormField label="Boja kategorije">
          <InputColor
            type="color"
            id="boja"
            defaultValue="#ffffff"
            disabled={isWorking}
            {...register('boja')}
          />
        </FormField>
      </FormRow>
      <FormRow>
        <FormField label="Ikona kategorije">
          <IconSelector register={register} name="ikona" defaultValue={editValues.ikona} />
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
          title={isEditSession ? 'Uredi kategoriju' : 'Dodaj novu kategoriju'}
          size="small"
          variation="primary"
          disabled={isWorking}
        >
          {isEditSession ? 'Uredi kategoriju' : 'Dodaj novu kategoriju'}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCategoryForm;
