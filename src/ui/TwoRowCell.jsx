import styled from 'styled-components';
import formater from '../utils/dateFormatter';

const StyledCell = styled.span`
  font-weight: 400;
  color: var(--color-grey-600);
  font-family: 'Sono';
`;

export default function TwoRowCell({ children }) {
  const [datum, vrijeme] = formater(children).split(' ');
  return (
    <>
      <StyledCell>
        {datum}
        <br />
        {vrijeme}
      </StyledCell>
    </>
  );
}
