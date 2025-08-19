import styled from 'styled-components';
import Button from './Button';

const StyledConfirmDelete = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  & p {
    color: var(--color-grey-500);
    margin-bottom: 1.2rem;
  }

  & div {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

function ConfirmDelete({ resourceName, onConfirm, disabled, onCloseModal, children }) {
  return (
    <StyledConfirmDelete>
      {children ? (
        children
      ) : (
        <p>
          Da li ste sigurni da želite obrisati trajno ovaj {resourceName}? Jednom obrisana ova
          stavka se više ne može vratiti.
        </p>
      )}

      <div>
        <Button variation="secondary" size="small" disabled={disabled} onClick={onCloseModal}>
          Odustani
        </Button>
        <Button variation="danger" size="small" disabled={disabled} onClick={onConfirm}>
          {children ? 'Deaktiviraj' : 'Izbriši'}
        </Button>
      </div>
    </StyledConfirmDelete>
  );
}

export default ConfirmDelete;
