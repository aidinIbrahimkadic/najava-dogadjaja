import styled from 'styled-components';

const InputColor = styled.input`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.2rem 0.4rem;
  height: 4rem;
  width: 12rem;
  margin-top: 1rem;

  &:focus,
  &:hover {
    border: 1px solid var(--color-brand-500);
    outline: none;
  }
`;

export default InputColor;
