import styled from 'styled-components';

const StyledBadge = styled.div`
  background-color: ${(props) => props.$bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem;
  width: 5rem;
  height: 5rem;
  text-align: center;
  border-radius: ${(props) => (props.$hasChildren ? '0.5rem' : '1.5rem')};
  color: ${(props) => props.color};
`;

export default function BadgeIcon({ bgColor, color = '#fefefe', children }) {
  return (
    <StyledBadge color={color} $hasChildren={children !== undefined} $bgColor={bgColor}>
      {children}
    </StyledBadge>
  );
}
