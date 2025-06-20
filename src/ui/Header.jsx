import styled from 'styled-components';
import { Link } from 'react-router-dom';

const StyledHeader = styled.header`
  grid-area: header;
  background-color: var(--color-grey-0);
  border-bottom: 1px solid var(--color-grey-200);
`;

export default function Header() {
  return (
    <StyledHeader>
      <h2>Header</h2>
      <Link to="/login">Login</Link>
    </StyledHeader>
  );
}
