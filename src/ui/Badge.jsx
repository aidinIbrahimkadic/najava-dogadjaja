import styled from 'styled-components';

const StyledBadge = styled.div`
  background-color: ${(props) => props.$bgColor};
  padding: 0.2rem 0.4rem;
  text-align: center;
  border-radius: 0.5rem;
  width: 12rem;
  color: ${(props) => props.color};
`;

export default function Badge({ bgColor, color = '#fefefe', children }) {
  return (
    <StyledBadge color={color} $bgColor={bgColor}>
      {children}
    </StyledBadge>
  );
}
