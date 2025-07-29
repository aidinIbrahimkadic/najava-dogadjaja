import Button from '../../ui/Button';
import Modal from '../../ui/Modal';
import CreateRoleForm from './CreateRoleForm';

function AddRole() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="Dodaj novu rolu">
          <Button title="Dodaj novu rolu" variation="primary" size="medium">
            Dodaj novu rolu
          </Button>
        </Modal.Open>
        <Modal.Window name="Dodaj novu rolu" size="large">
          <CreateRoleForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddRole;
