import Button from '../../ui/Button';
import CreateCabinForm from './CreateCategoryForm';
import Modal from '../../ui/Modal';

function AddCategory() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="Dodaj novu kategoriju">
          <Button title="Dodaj novu kategoriju" variation="primary" size="medium">
            Dodaj novu kategoriju
          </Button>
        </Modal.Open>
        <Modal.Window name="Dodaj novu kategoriju" size="medium">
          <CreateCabinForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddCategory;
