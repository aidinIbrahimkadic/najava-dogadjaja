import styled from 'styled-components';

const StyledCell = styled.span`
  font-weight: 400;
  color: var(--color-grey-600);
  font-family: 'Sono';
  padding: 0;
`;

export default function Cell({ children, type = 'normal' }) {
  if (type === 'textCell') {
    return (
      <StyledCell>
        {children.slice(0, 15)}
        {children.length > 15 ? '...' : ''}
      </StyledCell>
    );
  }
  return <StyledCell>{children}</StyledCell>;
}
