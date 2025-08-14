import styled from 'styled-components';

export const RightColumn = styled.div`
  display: grid;
  grid-template-rows: 1fr auto;
  gap: 1.5rem;
  @media (max-width: 1100px) {
    grid-template-rows: auto auto;
  }
`;
