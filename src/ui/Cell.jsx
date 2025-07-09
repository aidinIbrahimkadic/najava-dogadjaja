import styled from 'styled-components';

const StyledCell = styled.div`
  font-weight: 400;
  color: var(--color-grey-600);
  font-family: 'Sono';
`;

export default function Cell({ children, type = 'normal' }) {
  if (type === 'textCell') {
    return (
      <StyledCell>
        {children.slice(0, 20)}
        {children.length > 20 ? '...' : ''}
      </StyledCell>
    );
  }
  return <StyledCell>{children}</StyledCell>;
}
