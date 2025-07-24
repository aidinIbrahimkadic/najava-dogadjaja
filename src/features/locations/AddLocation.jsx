import Button from '../../ui/Button';
import CreateLocationForm from './CreateLocationForm';
import Modal from '../../ui/Modal';

function AddLocation() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="Dodaj novu lokaciju">
          <Button title="Dodaj novu lokaciju" variation="primary" size="medium">
            Dodaj novu lokaciju
          </Button>
        </Modal.Open>
        <Modal.Window name="Dodaj novu lokaciju" size="large">
          <CreateLocationForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddLocation;
