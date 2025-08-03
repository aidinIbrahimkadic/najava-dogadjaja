import Button from '../../ui/Button';
import CreateCategoryForm from './CreateCategoryForm';
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
        <Modal.Window name="Dodaj novu kategoriju" size="">
          <CreateCategoryForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddCategory;
