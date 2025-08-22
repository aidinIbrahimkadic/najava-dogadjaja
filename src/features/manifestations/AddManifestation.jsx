import Button from '../../ui/Button';
import Modal from '../../ui/Modal';
import CreateManifestationForm from './CreateManifestationForm';

function AddManifestation() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="Dodaj novu manifestaciju">
          <Button title="Dodaj novu manifestaciju" variation="primary" size="medium">
            Dodaj novu manifestaciju
          </Button>
        </Modal.Open>
        <Modal.Window name="Dodaj novu manifestaciju" size="extraLarge">
          <CreateManifestationForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddManifestation;
