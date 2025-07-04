import styled from 'styled-components';

const Label = styled.label`
  font-weight: 500;
`;

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledFormField = styled.div`
  display: flex;
  flex-direction: column;
`;
const RequiredAsterisk = styled.span`
  color: red;
  margin-left: 0.2rem;
`;

const ErrorContainer = styled.div`
  height: 1.6rem;
`;

function FormField({ label, error, children, required }) {
  const childId = children?.props?.id || undefined;
  return (
    <StyledFormField>
      {label && (
        <Label htmlFor={childId}>
          {label} {required && <RequiredAsterisk>*</RequiredAsterisk>}
        </Label>
      )}
      <Container>
        {children}
        <ErrorContainer>{error && <Error>{error}</Error>}</ErrorContainer>
      </Container>
    </StyledFormField>
  );
}

export default FormField;
