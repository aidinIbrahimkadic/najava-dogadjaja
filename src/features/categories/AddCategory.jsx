import Button from '../../ui/Button';
import CreateCabinForm from './CreateCategoryForm';
import Modal from '../../ui/Modal';

function AddCategory() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="cabin-form">
          <Button variation="primary" size="medium">
            Add new category
          </Button>
        </Modal.Open>
        <Modal.Window name="cabin-form">
          <CreateCabinForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddCategory;
