import Button from '../../ui/Button';
import Modal from '../../ui/Modal';
import CreateInstitutionForm from './CreateInstitutionForm';

function AddInstitution() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="Dodaj novu instituciju">
          <Button title="Dodaj novu instituciju" variation="primary" size="medium">
            Dodaj novu instituciju
          </Button>
        </Modal.Open>
        <Modal.Window name="Dodaj novu instituciju" size="large">
          <CreateInstitutionForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddInstitution;
