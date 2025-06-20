import styled from 'styled-components';

const StyledHeader = styled.header`
  grid-area: header;
  background-color: var(--color-grey-0);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

export default function Header() {
  return <StyledHeader>Header</StyledHeader>;
}
