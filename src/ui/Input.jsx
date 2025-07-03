import styled from 'styled-components';

const Input = styled.input`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  /* box-shadow: var(--shadow-sm); */

  &:focus {
    outline: 1px solid var(--color-brand-500);
  }
`;

export default Input;

// const InputContainer = styled.div`
//   display: flex;
//   flex-direction: column;
// `;

// const ErrorMessage = styled.span`
//   color: red;
// `;

// export default function Input({ error }) {
//   return (
//     <InputContainer>
//       <StyledInput />
//       {error && <ErrorMessage>{error}</ErrorMessage>}
//     </InputContainer>
//   );
// }
