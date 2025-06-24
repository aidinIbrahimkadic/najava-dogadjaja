import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
`;

const SpinnerWrapper = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  padding: 3rem;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.6rem;
`;

const CalendarSquare = styled.div`
  width: 1.8rem;
  height: 1.8rem;
  background-color: var(--color-brand-500);
  opacity: 0.6;
  border-radius: 4px;
  animation: ${pulse} 1.2s infinite;
  animation-delay: ${({ index }) => `${index * 0.1}s`};
`;

export default function CalendarSpinner() {
  return (
    <SpinnerWrapper>
      <CalendarGrid>
        {[...Array(9)].map((_, i) => (
          <CalendarSquare key={i} index={i} />
        ))}
      </CalendarGrid>
    </SpinnerWrapper>
  );
}
