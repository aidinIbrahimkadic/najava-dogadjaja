import styled from 'styled-components';

const StyledCheckbox = styled.input.attrs({ type: 'checkbox' })`
  appearance: none;
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-grey-300);
  border-radius: 4px;
  outline: none;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;

  &:checked {
    background-color: var(--color-brand-500);
    border-color: var(--color-brand-500);
  }

  &:hover {
    border-color: var(--color-brand-500);
  }

  &:checked::after {
    content: '';
    position: absolute;
    left: 6px;
    top: 2px;
    width: 5px;
    height: 10px;
    border: solid var(--color-grey-50);
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
`;

export default function Checkbox({ ...props }) {
  return <StyledCheckbox {...props} />;
}
