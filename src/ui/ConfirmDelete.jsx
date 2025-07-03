import styled from 'styled-components';
import Button from './Button';
import Heading from './Heading';

const StyledConfirmDelete = styled.div`
  width: 40rem;
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

function ConfirmDelete({ resourceName, onConfirm, disabled, onCloseModal }) {
  return (
    <StyledConfirmDelete>
      {/* <Heading as="h3">Delete {resourceName}</Heading> */}
      <p>
        Da li ste sigurni da želite obrisati trajno ovaj {resourceName}? Jednom obrisana ova stavka
        se više ne može vratiti.
      </p>

      <div>
        <Button variation="secondary" size="small" disabled={disabled} onClick={onCloseModal}>
          Cancel
        </Button>
        <Button variation="danger" size="small" disabled={disabled} onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </StyledConfirmDelete>
  );
}

export default ConfirmDelete;
