import CreateEventForm from './CreateEventForm';

import Button from '../../ui/Button';
import Modal from '../../ui/Modal';

function AddEvent() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="Dodaj novi događaj">
          <Button title="Dodaj novi događaj" variation="primary" size="medium">
            Dodaj novi događaj
          </Button>
        </Modal.Open>
        <Modal.Window name="Dodaj novi događaj" size="extraLarge">
          <CreateEventForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddEvent;
