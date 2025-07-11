import styled from 'styled-components';

const StyledBadge = styled.div`
  background-color: ${(props) => props.$bgColor};
  padding: 0.2rem 0.4rem;
  height: ${(props) => !props.$hasChildren && '3rem'};
  width: ${(props) => !props.$hasChildren && '3rem'};
  text-align: center;
  border-radius: ${(props) => (props.$hasChildren ? '0.5rem' : '1.5rem')};
  color: ${(props) => props.color};
`;

export default function Badge({ bgColor, color = '#fefefe', children }) {
  return (
    <StyledBadge color={color} $hasChildren={children !== undefined} $bgColor={bgColor}>
      {children}
    </StyledBadge>
  );
}
