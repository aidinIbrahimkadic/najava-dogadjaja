import styled from 'styled-components';

const StyledFormRow = styled.div`
  display: ${(props) => (props.$buttons === 'has' ? 'flex' : 'grid')};
  justify-content: ${(props) => (props.$buttons === 'has' ? 'flex-end' : '')};

  align-items: center;
  grid-template-columns: ${(props) => props.$columns || '1fr'};
  gap: 1.4rem;

  padding: 0.5rem;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }

  &:not(:last-child) {
    /* border-bottom: 1px solid var(--color-grey-200); */
  }

  /* &:has(button):not(:has(a)) {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  } */
`;

function FormRow({ columns = '1fr', buttons = '', children }) {
  return (
    <StyledFormRow $buttons={buttons} $columns={columns}>
      {children}
    </StyledFormRow>
  );
}

export default FormRow;
