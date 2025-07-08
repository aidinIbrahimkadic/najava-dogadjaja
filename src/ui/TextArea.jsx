import styled from 'styled-components';

const StyledTextarea = styled.textarea`
  padding: 0.8rem 1.2rem;
  border: 1px solid var(--color-grey-300);
  border-radius: 5px;
  background-color: var(--color-grey-0);
  max-width: 100%;
  box-sizing: border-box;
  resize: vertical;

  &:focus,
  &:hover {
    border-color: var(--color-brand-500);
    outline: none;
  }
`;

export default function Textarea() {
  return (
    <StyledTextarea
      onInput={(e) => {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
      }}
    />
  );
}
