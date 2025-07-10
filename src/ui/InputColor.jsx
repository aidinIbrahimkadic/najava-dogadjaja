import styled from 'styled-components';

const InputColor = styled.input.attrs({ type: 'color' })`
  appearance: none;
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.2rem;
  height: 4rem;
  width: 12rem;
  margin-top: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  // Custom color box look
  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: var(--border-radius-sm);
  }

  &::-moz-color-swatch {
    border: none;
    border-radius: var(--border-radius-sm);
  }

  &:hover {
    border-color: var(--color-brand-500);
  }

  &:focus {
    border-color: var(--color-brand-500);
    box-shadow: 0 0 0 3px rgba(100, 116, 139, 0.2); /* Tailwind slate-500/20 */
    outline: none;
  }

  &:disabled {
    background-color: var(--color-grey-100);
    border-color: var(--color-grey-200);
    cursor: not-allowed;
    opacity: 0.6;
  }

  &:read-only {
    background-color: var(--color-grey-100);
    border-color: var(--color-grey-200);
    cursor: default;
  }
`;

export default InputColor;
