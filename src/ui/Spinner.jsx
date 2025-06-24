import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const SpinnerWrapper = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const StyledSpinner = styled.div`
  width: 4rem;
  height: 4rem;
  border: 4px solid var(--color-grey-200);
  border-top-color: var(--color-brand-600);
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export default function Spinner() {
  return (
    <SpinnerWrapper>
      <StyledSpinner />
    </SpinnerWrapper>
  );
}
