import CreateEventForm from './CreateEventForm';

import Button from '../../ui/Button';
import Modal from '../../ui/Modal';

function AddEvent() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="event-form">
          <Button variation="primary" size="medium">
            Add new event
          </Button>
        </Modal.Open>
        <Modal.Window name="event-form">
          <CreateEventForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddEvent;
