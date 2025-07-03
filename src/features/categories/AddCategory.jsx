import Button from '../../ui/Button';
import CreateCabinForm from './CreateCategoryForm';
import Modal from '../../ui/Modal';

function AddCategory() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="Create new Category">
          <Button variation="primary" size="medium">
            Create new Category
          </Button>
        </Modal.Open>
        <Modal.Window name="Create new Category">
          <CreateCabinForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddCategory;
