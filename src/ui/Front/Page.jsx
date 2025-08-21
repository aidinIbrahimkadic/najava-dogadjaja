import styled from 'styled-components';

export const Page = styled.div`
  width: 100%;
  /* min-height: 100vh; */
  background: #fbfdff;
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 1.5rem;
  padding: 7rem 5rem 10rem 5rem;

  /* margin-bottom: 3rem; */

  @media (max-width: 1400px) {
    grid-template-columns: 1fr;
  }
  @media (max-width: 550px) {
    padding: 2rem 1rem 5rem 1rem;
  }
`;
