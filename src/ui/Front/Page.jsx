import styled from 'styled-components';

export const Page = styled.div`
  width: 90%;
  /* min-height: 100vh; */
  background: #fbfdff;
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 1.5rem;
  padding: 1.5rem;
  margin-bottom: 3rem;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;
