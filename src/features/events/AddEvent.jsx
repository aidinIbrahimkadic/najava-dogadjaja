import CreateEventForm from './CreateEventForm';

import Button from '../../ui/Button';
import Modal from '../../ui/Modal';

function AddEvent() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="Create new event">
          <Button variation="primary" size="medium">
            Create new event
          </Button>
        </Modal.Open>
        <Modal.Window name="Create new event">
          <CreateEventForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddEvent;
