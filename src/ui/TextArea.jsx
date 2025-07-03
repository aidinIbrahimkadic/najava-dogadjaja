import styled from 'styled-components';

const Textarea = styled.textarea`
  padding: 0.8rem 1.2rem;
  outline: 1px solid var(--color-grey-300);
  border: none;
  border-radius: 5px;
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
  width: 100%;
  height: 8rem;

  &:focus {
    outline: 1px solid var(--color-brand-500);
  }
`;

export default Textarea;
