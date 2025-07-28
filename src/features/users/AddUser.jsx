import Button from '../../ui/Button';
import Modal from '../../ui/Modal';
import CreateUserForm from './CreateUserForm';

function AddUser() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="Dodaj novog korisnika">
          <Button title="Dodaj novog korisnika" variation="primary" size="medium">
            Dodaj novog korisnika
          </Button>
        </Modal.Open>
        <Modal.Window name="Dodaj novog korisnika" size="large">
          <CreateUserForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddUser;
